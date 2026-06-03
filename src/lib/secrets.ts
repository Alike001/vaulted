import { toHex, type PublicClient, type WalletClient } from 'viem'
import { EmptyVaultError, uuidToLabel } from '@piplabs/cdr-sdk'
import { getCDRClient } from './cdr'
import { buildConditions } from './conditions'
import { secretsStore, type SecretMeta } from './storage'
import { audit } from './audit'

const enc = new TextEncoder()
const dec = new TextDecoder()

export interface CreateSecretArgs {
  name: string
  value: string
  reader: `0x${string}` // wallet allowed to decrypt (owner can name themselves)
  owner: `0x${string}`
  publicClient: PublicClient
  walletClient: WalletClient
}

/** Encrypt a secret to the DKG key and write an on-chain vault gated to `reader`. */
export async function createSecret(args: CreateSecretArgs): Promise<SecretMeta> {
  const { name, value, reader, owner, publicClient, walletClient } = args
  const client = await getCDRClient(publicClient, walletClient)
  const cond = buildConditions(owner, reader)

  // NOTE: we DON'T use uploader.uploadCDR — it hardcodes away skipConditionValidation,
  // so it rejects our EOA read condition. Do the 3 steps manually instead.
  // 1) allocate the vault (skip the contract-interface check for the EOA read gate)
  const { uuid, txHash: allocateTx } = await client.uploader.allocate({
    updatable: false,
    writeConditionAddr: cond.writeConditionAddr,
    writeConditionData: cond.writeConditionData,
    readConditionAddr: cond.readConditionAddr,
    readConditionData: cond.readConditionData,
    skipConditionValidation: true,
  })
  // 2) encrypt the secret to the DKG key, bound to this vault's label
  const label = uuidToLabel(uuid)
  const ciphertext = await client.uploader.encryptDataKey({
    dataKey: enc.encode(value),
    label,
  })
  // 3) write the ciphertext into the vault
  await client.uploader.write({
    uuid,
    accessAuxData: '0x',
    encryptedData: toHex(ciphertext.raw),
  })

  const meta: SecretMeta = {
    uuid,
    name,
    owner,
    reader,
    createdAt: Date.now(),
    allocateTx,
  }
  secretsStore.add(meta)
  audit.add({ uuid, type: 'create', addr: owner, ts: Date.now(), tx: allocateTx })
  audit.add({ uuid, type: 'grant', addr: reader, ts: Date.now() })
  return meta
}

export type ReadResult =
  | { ok: true; value: string; txHash: string }
  | { ok: false; reason: 'denied' | 'empty' | 'timeout' | 'error'; message: string }

/** Decrypt a vault. Only the wallet set as `readConditionAddr` succeeds. */
export async function readSecret(
  uuid: number,
  publicClient: PublicClient,
  walletClient: WalletClient,
): Promise<ReadResult> {
  const me = walletClient.account?.address as `0x${string}` | undefined
  try {
    const client = await getCDRClient(publicClient, walletClient)
    const { dataKey, txHash } = await client.consumer.accessCDR({
      uuid,
      accessAuxData: '0x',
    })
    const value = dec.decode(dataKey)
    audit.add({ uuid, type: 'read', addr: me || 'unknown', ts: Date.now(), tx: txHash })
    return { ok: true, value, txHash }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    let reason: 'denied' | 'empty' | 'timeout' | 'error'
    // The SDK reports "got <collected>/<expected>" when collecting partials.
    // Zero collected means NO validator produced a share for this requester —
    // i.e. the wallet isn't the named reader. That's a denial, not a flaky
    // timeout (a real timeout looks like "got 2/3" — some shares, not enough).
    const zeroPartials = /got\s+0\/\d+/i.test(message)
    if (e instanceof EmptyVaultError) reason = 'empty'
    else if (zeroPartials || /revert|denied|not authoriz|condition/i.test(message)) reason = 'denied'
    else if (/timeout|timed out|threshold/i.test(message)) reason = 'timeout'
    else reason = 'error'
    if (reason === 'denied') audit.add({ uuid, type: 'denied', addr: me || 'unknown', ts: Date.now() })
    return { ok: false, reason, message }
  }
}

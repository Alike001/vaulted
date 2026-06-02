import { encodeAbiParameters } from 'viem'

// Deployed on Aeneid (from the official cdr-skill examples). Gates writes to one owner.
export const OWNER_WRITE_CONDITION =
  '0x4C9bFC96d7092b590D497A191826C3dA2277c34B' as const

export interface VaultConditions {
  writeConditionAddr: `0x${string}`
  writeConditionData: `0x${string}`
  readConditionAddr: `0x${string}`
  readConditionData: `0x${string}`
  /** EOA read condition isn't a contract — skip the SDK interface check. */
  skipConditionValidation: boolean
}

/**
 * The core gate model (NO custom Solidity):
 * - write: OwnerWriteCondition contract, data = abi.encode(owner)
 * - read:  EOA shortcut — readConditionAddr = the one wallet allowed to decrypt.
 *   The CDR precompile enforces "only this exact address can read".
 */
export function buildConditions(
  owner: `0x${string}`,
  reader: `0x${string}`,
): VaultConditions {
  return {
    writeConditionAddr: OWNER_WRITE_CONDITION,
    writeConditionData: encodeAbiParameters([{ type: 'address' }], [owner]),
    readConditionAddr: reader,
    readConditionData: '0x',
    skipConditionValidation: true,
  }
}

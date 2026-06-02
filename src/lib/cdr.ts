import { CDRClient, initWasm } from '@piplabs/cdr-sdk'
import type { PublicClient, WalletClient } from 'viem'

export const CDR_API_URL =
  import.meta.env.VITE_CDR_API_URL || 'http://172.192.41.96:1317'

// initWasm must run exactly once before any crypto. Singleton guard.
let wasmReady: Promise<void> | null = null
export function ensureWasm(): Promise<void> {
  if (!wasmReady) wasmReady = initWasm()
  return wasmReady
}

/**
 * Build a CDRClient from viem clients (from wagmi). A walletClient is required
 * for upload/access (anything that signs); read-only status calls work without.
 */
export async function getCDRClient(
  publicClient: PublicClient,
  walletClient?: WalletClient,
): Promise<CDRClient> {
  await ensureWasm()
  return new CDRClient({
    network: 'testnet',
    publicClient,
    walletClient,
    apiUrl: CDR_API_URL,
  })
}

/** Health snapshot for the connect bar — proves we're talking to the DKG network. */
export async function getNetworkStatus(publicClient: PublicClient) {
  const client = await getCDRClient(publicClient)
  const [round, participants, threshold] = await Promise.all([
    client.observer.getActiveRound(),
    client.observer.getParticipantCount(),
    client.observer.getThreshold(),
  ])
  return { round, participants, threshold }
}

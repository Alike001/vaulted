import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

const RPC = import.meta.env.VITE_STORY_RPC || 'https://aeneid.storyrpc.io'

// Story Aeneid testnet — native token is IP (verified live: chainId 1315)
export const aeneid = defineChain({
  id: Number(import.meta.env.VITE_CHAIN_ID || 1315),
  name: 'Story Aeneid Testnet',
  nativeCurrency: { name: 'IP', symbol: 'IP', decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
  blockExplorers: import.meta.env.VITE_EXPLORER_URL
    ? { default: { name: 'Explorer', url: import.meta.env.VITE_EXPLORER_URL } }
    : undefined,
  testnet: true,
})

// ADR-3: register the INJECTED connector ONLY. RainbowKit/MetaMask-SDK
// connector skew has broken wallet connect before — keep this minimal.
export const wagmiConfig = createConfig({
  chains: [aeneid],
  connectors: [injected()],
  transports: { [aeneid.id]: http(RPC) },
})

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
}

"use client"

import { WagmiProvider as WagmiProviderBase, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  },
  connectors: [
    injected()
  ]
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProviderBase config={config}>
      {children}
    </WagmiProviderBase>
  )
}

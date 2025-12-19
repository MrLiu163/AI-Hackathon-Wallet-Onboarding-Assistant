"use client"

import type React from "react"
import { createConfig, WagmiProvider, http } from "wagmi"
import { mainnet, optimism, arbitrum, polygon, base, bsc } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { injected } from "wagmi/connectors"

const queryClient = new QueryClient()

const config = createConfig({
  chains: [mainnet, optimism, arbitrum, polygon, base, bsc],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

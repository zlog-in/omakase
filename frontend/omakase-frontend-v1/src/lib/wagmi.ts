import { http, createConfig } from 'wagmi'
import { sepolia, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import {
    injectedWallet,
    metaMaskWallet,
    walletConnectWallet,
    rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [
                injectedWallet,
                metaMaskWallet,
                rainbowWallet,
                walletConnectWallet,
            ],
        },
    ],
    {
        appName: 'Crosschain Staking',
        projectId,
    }
)

export const wagmiConfig = createConfig({
    chains: [sepolia, arbitrumSepolia, baseSepolia],
    connectors,
    transports: {
        [sepolia.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC),
        [arbitrumSepolia.id]: http(process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC),
        [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC),
    },
})

export const chains = [sepolia, arbitrumSepolia, baseSepolia]

// Declare module for TypeScript support
declare module 'wagmi' {
    interface Register {
        config: typeof wagmiConfig
    }
}
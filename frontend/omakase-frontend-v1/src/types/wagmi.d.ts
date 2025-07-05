// src/types/wagmi.d.ts
import { Address } from 'viem'

declare module 'wagmi' {
    interface Register {
        config: typeof import('../lib/wagmi').wagmiConfig
    }
}

// Global type definitions
export type ContractAddress = Address | null
export type ChainId = number
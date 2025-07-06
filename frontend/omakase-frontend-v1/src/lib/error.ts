// src/lib/errors.ts
import { BaseError, ContractFunctionRevertedError } from 'viem'

export function handleContractError(error: unknown): string {
    if (error instanceof BaseError) {
        // Handle different error types
        if (error.cause instanceof ContractFunctionRevertedError) {
            return `Contract execution failed: ${error.cause.data?.errorName ?? 'Unknown error'}`
        }
        return error.shortMessage ?? 'Transaction failed'
    }

    return 'An unknown error occurred'
}
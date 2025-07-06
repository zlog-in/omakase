import { SUPPORTED_CHAINS } from './constants'

// 代币信息映射
export const TOKEN_INFO = {
    [SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id]: {
        name: 'Omakase',
        symbol: 'OMA',
        address: '0x2dA943A5E008b9A85aA0E80F0d7d8d53a4945b2D',
        type: 'ERC20',
        description: 'Native ERC20 token with LayerZero Adapter'
    },
    [SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id]: {
        name: 'Omakase OFT',
        symbol: 'OMA',
        address: '0x3b6Be820c586B7235e19c7956e9408879A0F6065',
        type: 'OFT',
        description: 'LayerZero OFT implementation'
    },
    [SUPPORTED_CHAINS.BASE_SEPOLIA.id]: {
        name: 'Omakase OFT',
        symbol: 'OMA',
        address: '0x3b6Be820c586B7235e19c7956e9408879A0F6065',
        type: 'OFT',
        description: 'LayerZero OFT implementation'
    },
} as const

/**
 * 获取指定链上的代币信息
 */
export function getTokenInfo(chainId: number) {
    return TOKEN_INFO[chainId as keyof typeof TOKEN_INFO] || {
        name: 'Unknown Token',
        symbol: 'UNKNOWN',
        address: '0x0',
        type: 'Unknown',
        description: 'Unknown token'
    }
}

/**
 * 获取代币符号
 */
export function getTokenSymbol(chainId: number): string {
    return getTokenInfo(chainId).symbol
}

/**
 * 获取代币名称
 */
export function getTokenName(chainId: number): string {
    return getTokenInfo(chainId).name
}

/**
 * 检查是否为原生代币（Ethereum Sepolia上的Omakase）
 */
export function isNativeToken(chainId: number): boolean {
    return chainId === SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id
}

/**
 * 检查是否为OFT代币
 */
export function isOFTToken(chainId: number): boolean {
    return chainId === SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id ||
        chainId === SUPPORTED_CHAINS.BASE_SEPOLIA.id
}

/**
 * 获取代币类型描述
 */
export function getTokenTypeDescription(chainId: number): string {
    const tokenInfo = getTokenInfo(chainId)
    return tokenInfo.description
}

/**
 * 格式化代币显示名称（包含链信息）
 */
export function formatTokenDisplayName(chainId: number): string {
    const tokenInfo = getTokenInfo(chainId)
    const chainName = Object.values(SUPPORTED_CHAINS).find(chain => chain.id === chainId)?.name || 'Unknown Chain'

    return `${tokenInfo.symbol} (${chainName})`
}
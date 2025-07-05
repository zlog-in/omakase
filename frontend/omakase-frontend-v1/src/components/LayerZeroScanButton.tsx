'use client'

import { useAccount, useChainId } from 'wagmi'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ExternalLink, Search, Activity } from 'lucide-react'
import { SUPPORTED_CHAINS } from '@/lib/constants'

// LayerZero Endpoint ID 映射
const LAYERZERO_ENDPOINT_IDS = {
    [SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id]: 40161,   // Ethereum Sepolia
    [SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id]: 40231,   // Arbitrum Sepolia  
    [SUPPORTED_CHAINS.BASE_SEPOLIA.id]: 40245,       // Base Sepolia (Hub)
} as const

// 链名称映射
const CHAIN_NAMES = {
    [SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id]: 'Ethereum Sepolia',
    [SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id]: 'Arbitrum Sepolia',
    [SUPPORTED_CHAINS.BASE_SEPOLIA.id]: 'Base Sepolia',
} as const

interface LayerZeroScanButtonProps {
    variant?: 'default' | 'outline' | 'secondary'
    size?: 'sm' | 'default' | 'lg'
    showChainInfo?: boolean
    className?: string
}

export function LayerZeroScanButton({
    variant = 'outline',
    size = 'default',
    showChainInfo = true,
    className
}: LayerZeroScanButtonProps) {
    const { address } = useAccount()
    const chainId = useChainId()

    // 构建LayerZero Scan URL
    const buildLayerZeroScanUrl = (): string => {
        if (!address || !chainId) return 'https://testnet.layerzeroscan.com'

        const currentChainEid = LAYERZERO_ENDPOINT_IDS[chainId as keyof typeof LAYERZERO_ENDPOINT_IDS]
        const hubChainEid = LAYERZERO_ENDPOINT_IDS[SUPPORTED_CHAINS.BASE_SEPOLIA.id]

        if (!currentChainEid) return 'https://testnet.layerzeroscan.com'

        // 构建过滤器参数
        const params = new URLSearchParams({
            // 基础过滤器
            'address': address,

            // 源链和目标链过滤 (双向)
            'srcEid': currentChainEid.toString(),
            'dstEid': hubChainEid.toString(),

            // 或者反向（从Hub链到当前链）
            'srcEid2': hubChainEid.toString(),
            'dstEid2': currentChainEid.toString(),

            // 时间范围（最近30天）
            'timeRange': '30d',

            // 消息状态
            'status': 'all'
        })

        // LayerZero Scan 的实际URL结构
        return `https://layerzeroscan.com/address/${address}?${params.toString()}`
    }

    // 获取当前链信息
    const getCurrentChainInfo = () => {
        if (!chainId) return null

        const chainName = CHAIN_NAMES[chainId as keyof typeof CHAIN_NAMES]
        const isHub = chainId === SUPPORTED_CHAINS.BASE_SEPOLIA.id
        const eid = LAYERZERO_ENDPOINT_IDS[chainId as keyof typeof LAYERZERO_ENDPOINT_IDS]

        return { chainName, isHub, eid }
    }

    const handleClick = () => {
        const url = buildLayerZeroScanUrl()
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    if (!address) {
        return (
            <Button
                variant="outline"
                size={size}
                disabled
                className={className}
            >
                <Search className="w-4 h-4 mr-2" />
                Connect Wallet to View Messages
            </Button>
        )
    }

    const chainInfo = getCurrentChainInfo()

    return (
        <div className="space-y-2">
            <Button
                variant={variant}
                size={size}
                onClick={handleClick}
                className={`gap-2 ${className}`}
            >
                <Activity className="w-4 h-4" />
                View Cross-Chain Messages
                <ExternalLink className="w-3 h-3" />
            </Button>

            {showChainInfo && chainInfo && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Messages between:</span>
                    <Badge variant="outline" className="text-xs">
                        {chainInfo.chainName}
                        {chainInfo.isHub && ' (Hub)'}
                    </Badge>
                    <span>↔</span>
                    <Badge variant="outline" className="text-xs">
                        Base Sepolia (Hub)
                    </Badge>
                </div>
            )}
        </div>
    )
}

// 扩展版本 - 包含更多信息和选项
export function LayerZeroScanWidget() {
    const { address } = useAccount()
    const chainId = useChainId()

    const chainInfo = chainId ? {
        chainName: CHAIN_NAMES[chainId as keyof typeof CHAIN_NAMES],
        isHub: chainId === SUPPORTED_CHAINS.BASE_SEPOLIA.id,
        eid: LAYERZERO_ENDPOINT_IDS[chainId as keyof typeof LAYERZERO_ENDPOINT_IDS]
    } : null

    const buildSpecificUrl = (direction: 'to-hub' | 'from-hub' | 'all') => {
        if (!address || !chainId) return '#'

        const currentChainEid = LAYERZERO_ENDPOINT_IDS[chainId as keyof typeof LAYERZERO_ENDPOINT_IDS]
        const hubChainEid = LAYERZERO_ENDPOINT_IDS[SUPPORTED_CHAINS.BASE_SEPOLIA.id]

        if (!currentChainEid) return '#'

        let params: URLSearchParams

        switch (direction) {
            case 'to-hub':
                params = new URLSearchParams({
                    'address': address,
                    'srcEid': currentChainEid.toString(),
                    'dstEid': hubChainEid.toString(),
                    'timeRange': '30d'
                })
                break
            case 'from-hub':
                params = new URLSearchParams({
                    'address': address,
                    'srcEid': hubChainEid.toString(),
                    'dstEid': currentChainEid.toString(),
                    'timeRange': '30d'
                })
                break
            default:
                params = new URLSearchParams({
                    'address': address,
                    'timeRange': '30d'
                })
        }

        return `https://layerzeroscan.com/address/${address}?${params.toString()}`
    }

    const openUrl = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer')
    }

    if (!address) {
        return (
            <div className="p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground text-center">
                    Connect your wallet to view cross-chain message history
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Cross-Chain Message History</h3>
            </div>

            {chainInfo && (
                <div className="text-sm text-muted-foreground">
                    <p>Current chain: <Badge variant="outline">{chainInfo.chainName}</Badge></p>
                    <p className="mt-1">Hub chain: <Badge variant="outline">Base Sepolia</Badge></p>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUrl(buildSpecificUrl('to-hub'))}
                    className="gap-2"
                >
                    <span>→</span>
                    To Hub Chain
                    <ExternalLink className="w-3 h-3" />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openUrl(buildSpecificUrl('from-hub'))}
                    className="gap-2"
                >
                    <span>←</span>
                    From Hub Chain
                    <ExternalLink className="w-3 h-3" />
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    onClick={() => openUrl(buildSpecificUrl('all'))}
                    className="gap-2"
                >
                    <Activity className="w-3 h-3" />
                    All Messages
                    <ExternalLink className="w-3 h-3" />
                </Button>
            </div>

            <div className="text-xs text-muted-foreground">
                <p>💡 Tip: Messages include stake, unstake, withdraw, and claim operations</p>
            </div>
        </div>
    )
}

// 简化版本 - 仅显示图标按钮
export function LayerZeroScanIconButton() {
    const { address } = useAccount()
    const chainId = useChainId()

    const buildUrl = (): string => {
        if (!address || !chainId) return 'https://layerzeroscan.com'

        const currentChainEid = LAYERZERO_ENDPOINT_IDS[chainId as keyof typeof LAYERZERO_ENDPOINT_IDS]
        if (!currentChainEid) return 'https://layerzeroscan.com'

        return `https://layerzeroscan.com/address/${address}`
    }

    const handleClick = () => {
        window.open(buildUrl(), '_blank', 'noopener,noreferrer')
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleClick}
            disabled={!address}
            className="h-8 w-8 p-0"
            title="View cross-chain messages on LayerZero Scan"
        >
            <Activity className="w-4 h-4" />
        </Button>
    )
}
'use client'

import { useChainId, useSwitchChain } from 'wagmi'
import { sepolia, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from './ui/dropdown-menu'
import { Badge } from './ui/badge'
import { ChevronDown, CheckCircle, AlertCircle } from 'lucide-react'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import toast from 'react-hot-toast'

// 👇 使用 as const 确保 chain.id 推断为字面量类型
const supportedChains = [sepolia, arbitrumSepolia, baseSepolia] as const

// 类型提取：所有支持链的 id 的联合类型
type SupportedChainId = typeof supportedChains[number]['id']

// 链配置映射
const chainConfigMap: Record<SupportedChainId, {
    name: string
    id: SupportedChainId
    config: {
        layerZeroEndpointId: number
    }
    color: string
    isHub: boolean
}> = {
    [sepolia.id]: {
        ...sepolia,
        config: SUPPORTED_CHAINS.ETHEREUM_SEPOLIA,
        color: 'bg-blue-500',
        isHub: false,
    },
    [arbitrumSepolia.id]: {
        ...arbitrumSepolia,
        config: SUPPORTED_CHAINS.ARBITRUM_SEPOLIA,
        color: 'bg-blue-600',
        isHub: false,
    },
    [baseSepolia.id]: {
        ...baseSepolia,
        config: SUPPORTED_CHAINS.BASE_SEPOLIA,
        color: 'bg-blue-700',
        isHub: true,
    },
}

export function NetworkSelector() {
    const chainId = useChainId()
    const { switchChain, isPending } = useSwitchChain()

    const currentChain = supportedChains.find(chain => chain.id === chainId)
    const currentChainConfig = chainId ? chainConfigMap[chainId as SupportedChainId] : null

    const handleSwitchChain = async (targetChainId: SupportedChainId) => {
        try {
            await switchChain({ chainId: targetChainId })
            const targetChain = supportedChains.find(chain => chain.id === targetChainId)
            toast.success(`Switched to ${targetChain?.name}`)
        } catch (error: unknown) {
            console.error('Failed to switch chain:', error)
            toast.error(`Failed to switch network: ${(error as Error)?.message || 'Unknown error'}`)
        }
    }

    const isUnsupportedChain = chainId && !supportedChains.some(chain => chain.id === chainId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={isUnsupportedChain ? "destructive" : "outline"}
                    disabled={isPending}
                    className="min-w-[140px] justify-between"
                >
                    <div className="flex items-center gap-2">
                        {currentChainConfig && (
                            <div className={`w-2 h-2 rounded-full ${currentChainConfig.color}`} />
                        )}
                        <span className="truncate">
                            {isPending
                                ? 'Switching...'
                                : isUnsupportedChain
                                    ? 'Unsupported'
                                    : currentChain?.name || 'Select Network'
                            }
                        </span>
                        {currentChainConfig?.isHub && (
                            <Badge variant="secondary" className="text-xs">
                                Hub
                            </Badge>
                        )}
                    </div>
                    <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-gray-900 backdrop-blur-none border border-gray-200 dark:border-gray-700">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Select Network
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {supportedChains.map((chain) => {
                    const config = chainConfigMap[chain.id]
                    const isCurrentChain = chain.id === chainId

                    return (
                        <DropdownMenuItem
                            key={chain.id}
                            onClick={() => !isCurrentChain && handleSwitchChain(chain.id)}
                            disabled={isCurrentChain || isPending}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                <span>{chain.name}</span>
                                {config.isHub && (
                                    <Badge variant="outline" className="text-xs">
                                        Hub
                                    </Badge>
                                )}
                            </div>
                            {isCurrentChain && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                        </DropdownMenuItem>
                    )
                })}

                {isUnsupportedChain && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled className="text-red-500">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            <span>Current network not supported</span>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Chain Information
                </DropdownMenuLabel>
                {currentChainConfig && (
                    <div className="mx-2 mb-1">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Chain ID:</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{chainId}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {currentChainConfig.isHub ? 'Hub Chain' : 'Spoke Chain'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">LayerZero EID:</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {currentChainConfig.config.layerZeroEndpointId}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

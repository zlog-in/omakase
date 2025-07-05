'use client'

import { useState, useEffect, useMemo } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useChainId } from 'wagmi'
import { StakeForm } from '@/components/stakeForm'
import { StakingDashboard } from '@/components/stakingDashboard'
import { NetworkSelector } from '@/components/networkSelector'
import { LayerZeroScanIconButton } from '@/components/LayerZeroScanButton'
import { useStaking } from '@/hooks/useStaking'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Shield, Clock, DollarSign, RotateCcw } from 'lucide-react'
import { StakingStatus } from '@/types'
import { SUPPORTED_CHAINS } from '@/lib/constants'

// 代币信息映射
const TOKEN_INFO = {
  [SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id]: {
    name: 'Omakase',
    symbol: 'OMA',
    description: 'Native ERC20 token with LayerZero Adapter',
    chainName: 'Ethereum Sepolia'
  },
  [SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id]: {
    name: 'Omakase OFT',
    symbol: 'OMA',
    description: 'LayerZero OFT implementation',
    chainName: 'Arbitrum Sepolia'
  },
  [SUPPORTED_CHAINS.BASE_SEPOLIA.id]: {
    name: 'Omakase OFT',
    symbol: 'OMA',
    description: 'LayerZero OFT implementation',
    chainName: 'Base Sepolia'
  },
} as const

function getTokenInfo(chainId: number) {
  return TOKEN_INFO[chainId as keyof typeof TOKEN_INFO] || {
    name: 'Unknown Token',
    symbol: 'TOKEN',
    description: 'Unknown token',
    chainName: 'Unknown Network'
  }
}

// 简化的统计组件（内联）
function StakingStats() {
  const [isMounted, setIsMounted] = useState(false)
  const { getGlobalStats } = useStaking()
  const globalStats = getGlobalStats()
  const chainId = useChainId()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 获取当前链的代币信息
  const tokenInfo = useMemo(() => {
    return chainId ? getTokenInfo(chainId) : { symbol: 'TOKEN' }
  }, [chainId])

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: "Total Value Locked",
      value: `${globalStats.totalStaked} ${tokenInfo.symbol}`,
      description: "Total tokens staked in protocol",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Current APR",
      value: `${globalStats.stakingAPR.toFixed(2)}%`,
      description: "Annual percentage rate",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Unstake Period",
      value: `${globalStats.unstakePeriod}s`,
      description: "Lock time after unstaking",
      icon: Clock,
      color: "text-orange-600"
    },
    {
      title: "Reward Rate",
      value: `${globalStats.rewardRate} BP/s`,
      description: "Basis points per second",
      icon: Shield,
      color: "text-purple-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{stat.title}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// 简化的Unstake警告组件（内联）
function UnstakeWarning({ stakingStatus }: { stakingStatus: any }) {
  const [isMounted, setIsMounted] = useState(false)
  const { cancelUnstake, isLoading } = useStaking()
  const chainId = useChainId()
  const tokenInfo = useMemo(() => {
    return chainId ? getTokenInfo(chainId) : { symbol: 'TOKEN' }
  }, [chainId])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || stakingStatus.status !== StakingStatus.UNSTAKED) {
    return null
  }

  const handleCancelUnstake = async () => {
    const confirmed = window.confirm(
      `This will stake additional ${tokenInfo.symbol} tokens to cancel your unstake request. Continue?`
    )
    if (confirmed) {
      await cancelUnstake('0.001')
    }
  }

  return (
    <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-yellow-800">⏳ Withdrawal Waiting Period</h4>
              {!stakingStatus.canWithdraw && (
                <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                  {stakingStatus.unstakeLockRemaining}s remaining
                </Badge>
              )}
            </div>
            
            <div className="mb-4">
              {stakingStatus.canWithdraw ? (
                <div className="p-3 bg-green-100 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✅ <strong>Ready to withdraw!</strong> Your tokens are now available for withdrawal.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-yellow-700">
                    🕐 Your unstake request is processing. You can withdraw in {stakingStatus.unstakeLockRemaining} seconds.
                  </p>
                  <div className="w-full bg-yellow-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${Math.max(0, 100 - (stakingStatus.unstakeLockRemaining / 15) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {stakingStatus.isUnstakeCancellable && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 font-medium mb-2">🔄 Restart Staking Cycle</p>
                    <p className="text-xs text-blue-700 mb-3">
                      You can seamlessly restart your staking journey! Staking now will:
                    </p>
                    <ul className="text-xs text-blue-700 space-y-1 mb-3 pl-3">
                      <li>• Cancel this withdrawal request</li>
                      <li>• Resume earning rewards immediately</li>
                      <li>• Add to your existing position</li>
                    </ul>
                    <button
                      onClick={handleCancelUnstake}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Restart Staking
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const { address } = useAccount()
  const chainId = useChainId()
  const { getStakingStatus } = useStaking()

  // 确保客户端水合完成后才渲染钱包相关内容
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const stakingStatus = address ? getStakingStatus() : null
  const tokenInfo = useMemo(() => {
    return chainId ? getTokenInfo(chainId) : { symbol: 'TOKEN', chainName: 'Unknown Network' }
  }, [chainId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Omakase Protocol
            </h1>
            <p className="text-gray-600 mt-2">
              Stake OMA tokens across multiple chains and earn USDC rewards
            </p>
            {isMounted && address && chainId && (
              <p className="text-sm text-gray-500 mt-1">
                Connected: {tokenInfo.chainName} • Token: {tokenInfo.symbol}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <LayerZeroScanIconButton />
            <NetworkSelector />
            <ConnectButton />
          </div>
        </header>

        {/* Global Statistics */}
        {isMounted && address && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Protocol Overview</h2>
            <StakingStats />
          </div>
        )}

        {/* Feature Highlights */}
        {isMounted && !address && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Why Stake with Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4">
                    <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Continuous Rewards</h4>
                    <p className="text-sm text-gray-600">Earn rewards every second</p>
                  </div>
                  <div className="text-center p-4">
                    <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Cross-Chain Support</h4>
                    <p className="text-sm text-gray-600">Stake on multiple networks</p>
                  </div>
                  <div className="text-center p-4">
                    <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <h4 className="font-medium">Flexible Unstaking</h4>
                    <p className="text-sm text-gray-600">Short 15s withdrawal lock</p>
                  </div>
                  <div className="text-center p-4">
                    <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">USDC Rewards</h4>
                    <p className="text-sm text-gray-600">Stable reward currency</p>
                  </div>
                </div>

                {/* 支持的代币信息 */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="text-center font-medium mb-3">Supported Tokens</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">Ethereum Sepolia</p>
                      <p className="text-sm text-blue-600">Omakase Token (Native ERC20)</p>
                      <p className="text-xs text-blue-500">via LayerZero Adapter</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium text-purple-800">Arbitrum Sepolia</p>
                      <p className="text-sm text-purple-600">Omakase OFT (LayerZero)</p>
                      <p className="text-xs text-purple-500">Native OFT Implementation</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800">Base Sepolia (Hub)</p>
                      <p className="text-sm text-green-600">Omakase OFT (LayerZero)</p>
                      <p className="text-xs text-green-500">Central Hub Chain</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {isMounted && address ? (
          <div className="space-y-8">
            {/* Unstake Warning (if applicable) */}
            {stakingStatus && stakingStatus.status === StakingStatus.UNSTAKED && (
              <UnstakeWarning stakingStatus={stakingStatus} />
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Staking Form */}
              <div className="lg:col-span-1">
                <StakeForm />
              </div>

              {/* Right Column - Dashboard */}
              <div className="lg:col-span-2">
                <StakingDashboard />
              </div>
            </div>
          </div>
        ) : isMounted ? (
          /* Not Connected State */
          <div className="text-center py-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Connect Your Wallet</h3>
                  <p className="text-gray-600">
                    Connect your wallet to start staking and earning USDC rewards
                  </p>
                  <div className="pt-4">
                    <ConnectButton />
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    <Badge variant="outline">Ethereum Sepolia (OMAKASE)</Badge>
                    <Badge variant="outline">Arbitrum Sepolia (OFT)</Badge>
                    <Badge variant="outline">Base Sepolia (OFT)</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Loading state during hydration */
          <div className="text-center py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Technology</h4>
              <div className="space-y-1 text-xs">
                <p>LayerZero OFT Protocol</p>
                <p>Circle CCTP</p>
                <p>Multi-chain Architecture</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Features</h4>
              <div className="space-y-1 text-xs">
                <p>Continuous Rewards</p>
                <p>Cross-chain Staking</p>
                <p>Instant Claims</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Security</h4>
              <div className="space-y-1 text-xs">
                <p>Audited Smart Contracts</p>
                <p>Decentralized Protocol</p>
                <p>Non-custodial Staking</p>
              </div>
            </div>
          </div>

          {/* 合约地址信息 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Contract Addresses</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-medium text-gray-600">Ethereum Sepolia</p>
                <p className="font-mono text-gray-500">OMAKASE: 0x2dA9...5b2D</p>
                <p className="font-mono text-gray-500">Adapter: 0x5132...694</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Arbitrum Sepolia</p>
                <p className="font-mono text-gray-500">OFT: 0x3b6B...065</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Base Sepolia (Hub)</p>
                <p className="font-mono text-gray-500">OFT: 0x3b6B...065</p>
              </div>
            </div>
          </div>

          <p className="text-xs">
            © 2025 Omakase Protocol, Built with ❤ in Cannes
          </p>
        </footer>
      </div>
    </div>
  )
}
'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { StakeForm } from '@/components/stakeForm'
import { StakingDashboard } from '@/components/stakingDashboard'
import { NetworkSelector } from '@/components/networkSelector'
import { LayerZeroScanIconButton } from '@/components/LayerZeroScanButton'
import { useStaking } from '@/hooks/useStaking'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Shield, Clock, DollarSign } from 'lucide-react'
import { StakingStatus } from '@/types'

// 简化的统计组件（内联）
function StakingStats() {
  const { getGlobalStats } = useStaking()
  const globalStats = getGlobalStats()

  const stats = [
    {
      title: "Total Value Locked",
      value: `${globalStats.totalStaked} OFT`,
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
  const { cancelUnstake, isLoading } = useStaking()

  if (stakingStatus.status !== StakingStatus.UNSTAKED) {
    return null
  }

  const handleCancelUnstake = async () => {
    const confirmed = window.confirm(
      'This will stake additional tokens to cancel your unstake request. Continue?'
    )
    if (confirmed) {
      await cancelUnstake('0.001')
    }
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-yellow-800 mb-2">Unstake In Progress</h4>
            <p className="text-sm text-yellow-700 mb-3">
              {stakingStatus.canWithdraw 
                ? "✅ Lock period ended - You can now withdraw your tokens"
                : `🕐 Lock period active - ${stakingStatus.unstakeLockRemaining}s remaining`
              }
            </p>
            
            {stakingStatus.isUnstakeCancellable && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-gray-700 mb-2">
                  💡 <strong>Tip:</strong> You can cancel this unstake by staking additional tokens.
                </p>
                <button
                  onClick={handleCancelUnstake}
                  disabled={isLoading}
                  className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
                >
                  Cancel Unstake
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const { address } = useAccount()
  const { getStakingStatus } = useStaking()
  
  const stakingStatus = address ? getStakingStatus() : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cross-Chain Staking System
            </h1>
            <p className="text-gray-600 mt-2">
              Stake OFT tokens across multiple chains and earn USDC rewards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LayerZeroScanIconButton />
            <NetworkSelector />
            <ConnectButton />
          </div>
        </header>

        {/* Global Statistics */}
        {address && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Protocol Overview</h2>
            <StakingStats />
          </div>
        )}

        {/* Feature Highlights */}
        {!address && (
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        {address ? (
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
        ) : (
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
                    <Badge variant="outline">Ethereum Sepolia</Badge>
                    <Badge variant="outline">Arbitrum Sepolia</Badge>
                    <Badge variant="outline">Base Sepolia</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
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
          <p className="text-xs">
            © 2024 Cross-Chain Staking Protocol. Built with LayerZero and Circle CCTP.
          </p>
        </footer>
      </div>
    </div>
  )
}
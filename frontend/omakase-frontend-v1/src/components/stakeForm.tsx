'use client'

import { useState, useEffect } from 'react'
import { useStaking } from '@/hooks/useStaking'
import { useAccount, useChainId } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { AlertTriangle, Info, Calculator, Zap, TrendingUp, Wallet } from 'lucide-react'
import { isValidAmount } from '@/lib/utils'
import { StakingStatus } from '@/types'
import { SUPPORTED_CHAINS } from '@/lib/constants'

// 代币信息映射
const TOKEN_INFO = {
  [SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id]: {
    name: 'Omakase',
    symbol: 'OMA',
    description: 'Native ERC20 token with LayerZero Adapter'
  },
  [SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id]: {
    name: 'Omakase OFT',
    symbol: 'OMA',
    description: 'LayerZero OFT implementation'
  },
  [SUPPORTED_CHAINS.BASE_SEPOLIA.id]: {
    name: 'Omakase OFT',
    symbol: 'OMA',
    description: 'LayerZero OFT implementation'
  },
} as const

function getTokenInfo(chainId: number) {
  return TOKEN_INFO[chainId as keyof typeof TOKEN_INFO] || {
    name: 'Unknown Token',
    symbol: 'TOKEN',
    description: 'Unknown token'
  }
}

export function StakeForm() {
  const [amount, setAmount] = useState('')
  const [showCalculator, setShowCalculator] = useState(false)
  const { address } = useAccount()
  const chainId = useChainId()
  const {
    stake,
    isLoading,
    getTokenBalance,
    getStakingStatus,
    getRewardCalculation,
    canStake
  } = useStaking()

  const [balance, setBalance] = useState('0')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warnings, setWarnings] = useState<Record<string, string>>({})

  const stakingStatus = getStakingStatus()
  const rewardCalculation = getRewardCalculation()

  // 获取当前链的代币信息
  const tokenInfo = chainId ? getTokenInfo(chainId) : { name: 'Token', symbol: 'TOKEN', description: '' }

  // 加载余额
  const loadBalance = async () => {
    const bal = getTokenBalance()
    setBalance(bal)
  }

  // 初始加载余额
  useEffect(() => {
    if (address) {
      loadBalance()
    }
  }, [address])

  // 验证输入
  useEffect(() => {
    const newErrors: Record<string, string> = {}
    const newWarnings: Record<string, string> = {}

    if (amount) {
      if (!isValidAmount(amount)) {
        newErrors.amount = 'Please enter a valid amount'
      } else {
        const numAmount = parseFloat(amount)
        const numBalance = parseFloat(balance)

        if (numAmount > numBalance) {
          newErrors.amount = 'Amount exceeds your balance'
        } else if (numAmount < 0.001) {
          newWarnings.amount = `Minimum recommended stake is 0.001 ${tokenInfo.symbol}`
        }
      }
    }

    // 检查是否会取消unstake
    if (stakingStatus.status === StakingStatus.UNSTAKED && stakingStatus.isUnstakeCancellable) {
      newWarnings.unstakeCancel = 'Staking now will cancel your pending unstake request'
    }

    setErrors(newErrors)
    setWarnings(newWarnings)
  }, [amount, balance, stakingStatus, tokenInfo.symbol])

  // 计算预估奖励
  const calculateProjectedRewards = (stakeAmount: string) => {
    if (!isValidAmount(stakeAmount)) return null

    const amount = parseFloat(stakeAmount)
    const dailyRate = rewardCalculation.annualPercentageRate / 365 / 100

    return {
      daily: (amount * dailyRate).toFixed(4),
      weekly: (amount * dailyRate * 7).toFixed(4),
      monthly: (amount * dailyRate * 30).toFixed(4),
    }
  }

  const projectedRewards = calculateProjectedRewards(amount)

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0 || Object.keys(errors).length > 0) {
      return
    }

    // 特殊确认：如果会取消unstake
    if (stakingStatus.status === StakingStatus.UNSTAKED && stakingStatus.isUnstakeCancellable) {
      const confirmed = window.confirm(
        '⚠️ Warning: Staking now will cancel your pending unstake request.\n\n' +
        'Your tokens will remain staked and continue earning rewards.\n' +
        'You can unstake again later if needed.\n\n' +
        'Do you want to continue?'
      )
      if (!confirmed) return
    }

    await stake(amount)
    setAmount('')
  }

  const handleMaxClick = () => {
    setAmount(balance)
  }

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (parseFloat(balance) * percentage / 100).toString()
    setAmount(quickAmount)
  }

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Stake {tokenInfo.name}
          </CardTitle>
          <CardDescription>
            Stake your {tokenInfo.symbol} tokens to earn USDC rewards continuously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 余额和网络信息 */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Wallet className="w-4 h-4" />
              Your Balance:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{balance} {tokenInfo.symbol}</span>
              <button
                onClick={loadBalance}
                className="text-blue-600 hover:underline text-xs"
                disabled={isLoading}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* 当前APR显示 */}
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Current APR:
              </span>
              <span className="font-bold text-green-800 text-lg">
                {rewardCalculation.annualPercentageRate.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Rewards calculated every second ⚡
            </p>
          </div>

          {/* Unstake警告 */}
          {warnings.unstakeCancel && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Cancel Unstake</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {warnings.unstakeCancel}. This will reset your staking period and continue earning rewards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 输入区域 */}
          <div className="space-y-2">
            <Label htmlFor="amount">Stake Amount ({tokenInfo.symbol})</Label>
            <div className="space-y-2">
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder={`Enter stake amount in ${tokenInfo.symbol}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={errors.amount ? 'border-red-500' : ''}
                  step="0.001"
                  min="0"
                />
                <button
                  onClick={handleMaxClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:underline"
                  disabled={!balance || balance === '0'}
                >
                  MAX
                </button>
              </div>

              {/* 快速选择按钮 */}
              <div className="flex gap-2">
                {[25, 50, 75].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleQuickAmount(percentage)}
                    className="px-2 py-1 text-xs border rounded hover:bg-gray-50 transition-colors"
                    disabled={!balance || balance === '0'}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>

            {/* 错误和警告显示 */}
            {errors.amount && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.amount}
              </p>
            )}
            {warnings.amount && !errors.amount && (
              <p className="text-sm text-yellow-600 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {warnings.amount}
              </p>
            )}
          </div>

          {/* 奖励预测 */}
          {projectedRewards && amount && isValidAmount(amount) && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800 flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  Estimated Rewards
                </span>
                <button
                  onClick={() => setShowCalculator(!showCalculator)}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Calculator className="w-3 h-3" />
                  {showCalculator ? 'Hide' : 'Details'}
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-blue-600 font-medium">{projectedRewards.daily}</div>
                  <div className="text-blue-500">Daily</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-medium">{projectedRewards.weekly}</div>
                  <div className="text-blue-500">Weekly</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 font-medium">{projectedRewards.monthly}</div>
                  <div className="text-blue-500">Monthly</div>
                </div>
              </div>
              {showCalculator && (
                <div className="mt-2 pt-2 border-t border-blue-200 space-y-2">
                  <p className="text-xs text-blue-700">
                    💡 <strong>How rewards work:</strong>
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Rewards calculated every second (100 BP/s)</li>
                    <li>• Compound automatically</li>
                    <li>• Claim anytime without affecting stake</li>
                    <li>• Paid in USDC via Circle CCTP</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 质押按钮 */}
          <Button
            onClick={handleStake}
            disabled={
              isLoading ||
              !address ||
              !amount ||
              !canStake(amount) ||
              Object.keys(errors).length > 0
            }
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Staking...
              </div>
            ) : warnings.unstakeCancel ? (
              'Stake & Cancel Unstake'
            ) : (
              `Stake ${tokenInfo.symbol}`
            )}
          </Button>

          {!address && (
            <p className="text-sm text-red-600 text-center flex items-center justify-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Please connect your wallet first
            </p>
          )}

          {/* 信息提示 */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border">
              <Info className="w-4 h-4 text-gray-500 mt-0.5" />
              <div className="text-gray-600">
                <p className="font-medium text-sm">How it works:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Rewards are calculated continuously (every second)</li>
                  <li>• No lock period for staking - unstake anytime</li>
                  <li>• 15-second withdrawal lock after unstaking</li>
                  <li>• Claim rewards independently of staking</li>
                  <li>• Cross-chain support via LayerZero</li>
                </ul>
              </div>
            </div>

            {/* 网络和代币信息 */}
            {chainId && (
              <div className="text-xs text-gray-500 text-center space-y-1">
                <p>Connected to: {
                  chainId === SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id ? 'Ethereum Sepolia' :
                    chainId === SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id ? 'Arbitrum Sepolia' :
                      chainId === SUPPORTED_CHAINS.BASE_SEPOLIA.id ? 'Base Sepolia (Hub)' :
                        'Unknown Network'
                }</p>
                <p>Token: {tokenInfo.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 当前质押状态摘要 */}
      {stakingStatus.status !== StakingStatus.NOT_STAKED && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Current Position
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Staked</p>
                <p className="font-medium">{stakingStatus.stakedAmount} {tokenInfo.symbol}</p>
              </div>
              <div>
                <p className="text-gray-600">Rewards</p>
                <p className="font-medium">{stakingStatus.rewards} USDC</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <Badge
                variant={
                  stakingStatus.status === StakingStatus.ACTIVE ? 'success' :
                    stakingStatus.status === StakingStatus.UNSTAKED ? 'warning' : 'secondary'
                }
                className="gap-1"
              >
                {stakingStatus.status === StakingStatus.ACTIVE && <Zap className="w-3 h-3" />}
                {stakingStatus.status === StakingStatus.ACTIVE ? 'Active' :
                  stakingStatus.status === StakingStatus.UNSTAKED ? 'Unstaked' : 'Inactive'}
              </Badge>

              {stakingStatus.status === StakingStatus.ACTIVE && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Earning rewards
                </span>
              )}

              {stakingStatus.status === StakingStatus.UNSTAKED && (
                <span className="text-xs text-yellow-600">
                  {stakingStatus.canWithdraw ? 'Ready to withdraw' : 'Lock period active'}
                </span>
              )}
            </div>

            {/* 额外信息 */}
            {stakingStatus.status === StakingStatus.ACTIVE && (
              <div className="mt-3 p-2 bg-green-50 rounded text-xs text-green-700">
                Daily estimate: <strong>{stakingStatus.estimatedDailyReward} USDC</strong>
              </div>
            )}

            {stakingStatus.status === StakingStatus.UNSTAKED && stakingStatus.isUnstakeCancellable && (
              <div className="mt-3 p-2 bg-yellow-50 rounded text-xs text-yellow-700">
                💡 You can cancel unstake by staking more {tokenInfo.symbol} tokens
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
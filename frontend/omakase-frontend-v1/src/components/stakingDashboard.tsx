'use client'

import { useMemo } from 'react'
import { useStaking, useUnstakeCountdown, useRealtimeRewards } from '@/hooks/useStaking'
import { useAccount, useChainId } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { AlertTriangle, Clock, TrendingUp, Zap, RotateCcw, Database, Info } from 'lucide-react'
import { StakingStatus, ChefContractDataStatus } from '@/types'
import { formatUSDCAmount } from '@/lib/utils'
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

// Chef合约状态指示器
function getChefContractStatusBadge(status: ChefContractDataStatus) {
    switch (status) {
        case ChefContractDataStatus.SUCCESS:
            return <Badge variant="success" className="gap-1"><Database className="w-3 h-3" />Active</Badge>
        case ChefContractDataStatus.NO_DATA:
            return <Badge variant="secondary" className="gap-1"><Info className="w-3 h-3" />New User</Badge>
        case ChefContractDataStatus.LOADING:
            return <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" />Loading</Badge>
        case ChefContractDataStatus.ERROR:
            return <Badge variant="destructive" className="gap-1"><AlertTriangle className="w-3 h-3" />Error</Badge>
        default:
            return <Badge variant="muted">Unknown</Badge>
    }
}

function getChefContractStatusDescription(status: ChefContractDataStatus, isFirstTimeUser: boolean) {
    switch (status) {
        case ChefContractDataStatus.SUCCESS:
            return "Chef contract data loaded successfully"
        case ChefContractDataStatus.NO_DATA:
            return isFirstTimeUser ? "Welcome! No staking history found - ready to start staking" : "No active staking position"
        case ChefContractDataStatus.LOADING:
            return "Loading data from Chef contract on Base Sepolia..."
        case ChefContractDataStatus.ERROR:
            return "Unable to connect to Chef contract - please check network connection"
        default:
            return "Unknown contract status"
    }
}

export function StakingDashboard() {
    const { address } = useAccount()
    const chainId = useChainId()
    const {
        getStakingStatus,
        unstake,
        withdraw,
        claimReward,
        cancelUnstake,
        isLoading,
        canUnstake,
        canWithdraw,
        canClaim,
        getRewardCalculation
    } = useStaking()

    // 获取当前链的代币信息
    const tokenInfo = useMemo(() => {
        return chainId ? getTokenInfo(chainId) : { name: 'Token', symbol: 'TOKEN', description: '' }
    }, [chainId])

    // 获取质押状态 - 即使没有连接钱包也要调用，避免条件性Hook调用
    const stakingStatus = getStakingStatus()
    const rewardCalculation = getRewardCalculation()
    
    // 恢复倒计时功能，显示15秒锁定期间剩余时间 - 始终调用Hook
    const countdownText = useUnstakeCountdown(stakingStatus.unstakeUnlockTime)
    
    // 构建realtimeRewards的参数，避免条件性Hook调用
    const realtimeRewardsParam = stakingStatus.stakedAmountRaw > 0n ? {
        stakeAmount: stakingStatus.stakedAmountRaw,
        stakeReward: stakingStatus.rewardsRaw,
        lastStakeTime: BigInt(stakingStatus.lastStakeTime ? Math.floor(stakingStatus.lastStakeTime.getTime() / 1000) : 0),
        lastUnstakeTime: BigInt(stakingStatus.lastUnstakeTime ? Math.floor(stakingStatus.lastUnstakeTime.getTime() / 1000) : 0),
    } : undefined
    
    const realtimeRewards = useRealtimeRewards(realtimeRewardsParam)

    if (!address) {
        return (
            <Card>
                <CardContent className="text-center py-8">
                    <p className="text-gray-500">Please connect wallet to view staking positions</p>
                </CardContent>
            </Card>
        )
    }

    if (stakingStatus.status === StakingStatus.NOT_STAKED) {
        // 检查是否有可以claim的奖励（用户可能已经完成了withdraw但还有奖励）
        const hasClaimableRewards = parseFloat(stakingStatus.rewards) > 0 || parseFloat(realtimeRewards.toString()) > 0
        
        return (
            <div className="space-y-4">
                {/* Chef Contract Status for New Users */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Chef Contract Status</CardTitle>
                            {getChefContractStatusBadge(stakingStatus.chefContractData.queryStatus)}
                        </div>
                        <CardDescription>
                            {getChefContractStatusDescription(
                                stakingStatus.chefContractData.queryStatus, 
                                stakingStatus.chefContractData.isFirstTimeUser
                            )}
                        </CardDescription>
                    </CardHeader>
                    {process.env.NODE_ENV === 'development' && (
                        <CardContent className="pt-0">
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>🏠 Contract: {stakingStatus.chefContractData.contractAddress}</p>
                                <p>🕐 Last Query: {stakingStatus.chefContractData.lastQueryTime?.toLocaleString()}</p>
                                <p>👤 First Time User: {stakingStatus.chefContractData.isFirstTimeUser ? 'Yes' : 'No'}</p>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* 显示可以claim的奖励（如果有的话） */}
                {hasClaimableRewards && (
                    <Card className="border-l-4 border-l-green-500">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Zap className="w-5 h-5 text-green-600" />
                                Claimable Rewards Available
                            </CardTitle>
                            <CardDescription>
                                You have rewards available to claim from your previous staking activity.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Available Rewards</p>
                                    <p className="text-xl font-bold text-green-600">{stakingStatus.rewards} USDC</p>
                                </div>
                                <Button
                                    variant="default"
                                    onClick={() => claimReward()}
                                    disabled={isLoading || !canClaim()}
                                    className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Zap className="w-4 h-4" />
                                    Claim Rewards
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                            {hasClaimableRewards ? 'No active staking position - but you have rewards to claim!' : 'No active staking position found'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Start staking to earn USDC rewards automatically!
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const getStatusBadge = (status: StakingStatus) => {
        switch (status) {
            case StakingStatus.ACTIVE:
                return <Badge variant="success" className="gap-1"><Zap className="w-3 h-3" />Active</Badge>
            case StakingStatus.UNSTAKED:
                return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3" />Unstaked</Badge>
            case StakingStatus.WITHDRAWN:
                return <Badge variant="secondary">Withdrawn</Badge>
            default:
                return <Badge variant="muted">Unknown</Badge>
        }
    }

    const getStatusDescription = (status: StakingStatus) => {
        switch (status) {
            case StakingStatus.ACTIVE:
                return `Your ${tokenInfo.symbol} tokens are actively earning rewards`
            case StakingStatus.UNSTAKED:
                return stakingStatus.canWithdraw 
                    ? "Ready to withdraw your tokens"
                    : "Unstake initiated - waiting for unlock period"
            case StakingStatus.WITHDRAWN:
                return "Tokens have been withdrawn - you can still claim any remaining rewards"
            default:
                return ""
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">My Staking Position</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">Chef Contract:</span>
                        {getChefContractStatusBadge(stakingStatus.chefContractData.queryStatus)}
                    </div>
                </div>
                {getStatusBadge(stakingStatus.status)}
            </div>

            {/* 主要质押信息卡片 */}
            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Your Staking Position</CardTitle>
                            <CardDescription>
                                {getStatusDescription(stakingStatus.status)}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            {stakingStatus.status === StakingStatus.ACTIVE && (
                                <div className="text-sm text-green-600">
                                    ✨ Earning rewards
                                </div>
                            )}
                            {chainId && (
                                <div className="text-xs text-gray-500 mt-1">
                                    {chainId === SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id ? 'Ethereum Sepolia' :
                                        chainId === SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id ? 'Arbitrum Sepolia' :
                                            chainId === SUPPORTED_CHAINS.BASE_SEPOLIA.id ? 'Base Sepolia (Hub)' :
                                                'Unknown Network'}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* 数据网格 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">Staked Amount</p>
                            <p className="text-xl font-bold text-blue-600">{stakingStatus.stakedAmount} {tokenInfo.symbol}</p>
                            <p className="text-xs text-gray-500 mt-1">{tokenInfo.description}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-sm text-gray-600">Current Rewards</p>
                            <p className="text-xl font-bold text-green-600">
                                {formatUSDCAmount(realtimeRewards)} USDC
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Real-time calculation</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <p className="text-sm text-gray-600">Daily Estimate</p>
                            <p className="text-xl font-bold text-purple-600">{stakingStatus.estimatedDailyReward} USDC</p>
                            <p className="text-xs text-gray-500 mt-1">Projected earnings</p>
                        </div>
                    </div>

                    {/* Unstake状态特殊显示 */}
                    {stakingStatus.status === StakingStatus.UNSTAKED && (
                        <div className={`p-4 border rounded-lg ${
                            stakingStatus.canWithdraw 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-yellow-50 border-yellow-200'
                        }`}>
                            <div className="flex items-start gap-3">
                                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                                    stakingStatus.canWithdraw 
                                        ? 'text-green-600' 
                                        : 'text-yellow-600'
                                }`} />
                                <div className="flex-1">
                                    <h4 className={`font-medium ${
                                        stakingStatus.canWithdraw 
                                            ? 'text-green-800' 
                                            : 'text-yellow-800'
                                    }`}>
                                        {stakingStatus.canWithdraw ? 'Ready to Withdraw!' : 'Unstake Lock Period'}
                                    </h4>
                                    <p className={`text-sm mt-1 ${
                                        stakingStatus.canWithdraw 
                                            ? 'text-green-700' 
                                            : 'text-yellow-700'
                                    }`}>
                                        {stakingStatus.canWithdraw
                                            ? "✅ Lock period has ended - You can now withdraw your tokens or unstake again"
                                            : `🕐 ${countdownText} remaining until you can withdraw`
                                        }
                                    </p>
                                    {stakingStatus.isUnstakeCancellable && (
                                        <div className="mt-3 p-3 bg-white rounded border">
                                            <p className="text-sm text-gray-700 mb-2">
                                                💡 <strong>Tip:</strong> You can restart staking by adding more {tokenInfo.symbol} tokens.
                                                This will cancel your unstake and resume earning rewards.
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => cancelUnstake('0.001')}
                                                disabled={isLoading}
                                                className="gap-2"
                                            >
                                                <RotateCcw className="w-4 h-4" />
                                                Restart Staking
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Withdrawn状态特殊显示 - 突出显示可以claim rewards */}
                    {stakingStatus.status === StakingStatus.WITHDRAWN && (
                        <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                            <div className="flex items-start gap-3">
                                <Zap className="w-5 h-5 mt-0.5 text-blue-600" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-blue-800">
                                        Tokens Successfully Withdrawn!
                                    </h4>
                                    <p className="text-sm mt-1 text-blue-700">
                                        ✅ Your {tokenInfo.symbol} tokens have been withdrawn. You can still claim any remaining rewards.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex flex-wrap gap-3">
                        {stakingStatus.status === StakingStatus.ACTIVE && (
                            <Button
                                variant="outline"
                                onClick={() => unstake()}
                                disabled={isLoading || !canUnstake()}
                                className="gap-2"
                            >
                                <Clock className="w-4 h-4" />
                                Unstake {tokenInfo.symbol}
                            </Button>
                        )}

                        {stakingStatus.status === StakingStatus.UNSTAKED && stakingStatus.canWithdraw && (
                            <Button
                                onClick={() => withdraw()}
                                disabled={isLoading || !canWithdraw()}
                                className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 text-lg"
                                size="lg"
                            >
                                <TrendingUp className="w-5 h-5" />
                                🎉 Withdraw {tokenInfo.symbol} Now!
                            </Button>
                        )}

                        {stakingStatus.status === StakingStatus.UNSTAKED && !stakingStatus.canWithdraw && (
                            <Button
                                onClick={() => withdraw()}
                                disabled={true}
                                variant="outline"
                                className="gap-2 opacity-50 cursor-not-allowed"
                            >
                                <Clock className="w-4 h-4" />
                                Withdraw in {countdownText}
                            </Button>
                        )}

                        {stakingStatus.status === StakingStatus.UNSTAKED && (
                            <Button
                                variant="outline"
                                onClick={() => unstake()}
                                disabled={isLoading || !canUnstake()}
                                className="gap-2"
                            >
                                <Clock className="w-4 h-4" />
                                Unstake Again (Reset Timer)
                            </Button>
                        )}

                        {(parseFloat(stakingStatus.rewards) > 0 || parseFloat(realtimeRewards.toString()) > 0) && (
                            <Button
                                variant="secondary"
                                onClick={() => claimReward()}
                                disabled={isLoading || !canClaim()}
                                className="gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                Claim {stakingStatus.rewards} USDC
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* 奖励详情卡片 */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Reward Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Current Rewards</p>
                            <p className="text-lg font-semibold">{rewardCalculation.currentReward} USDC</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Daily Projection</p>
                            <p className="text-lg font-semibold">{rewardCalculation.projectedDailyReward} USDC</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Weekly Projection</p>
                            <p className="text-lg font-semibold">{rewardCalculation.projectedWeeklyReward} USDC</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">APR</p>
                            <p className="text-lg font-semibold text-green-600">
                                {rewardCalculation.annualPercentageRate.toFixed(2)}%
                            </p>
                        </div>
                    </div>

                    {stakingStatus.status === StakingStatus.ACTIVE && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                💰 You&apos;re earning approximately <strong>{rewardCalculation.projectedDailyReward} USDC</strong> per day from your {stakingStatus.stakedAmount} {tokenInfo.symbol} stake.
                                Rewards are calculated continuously and can be claimed at any time.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Chef Contract Debug Information (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
                <Card className="border-l-4 border-l-gray-300">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Chef Contract Debug Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-700">Contract Status</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {getChefContractStatusBadge(stakingStatus.chefContractData.queryStatus)}
                                    <span className="text-gray-600">
                                        {getChefContractStatusDescription(
                                            stakingStatus.chefContractData.queryStatus,
                                            stakingStatus.chefContractData.isFirstTimeUser
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Contract Address</p>
                                <p className="text-gray-600 font-mono text-xs mt-1">
                                    {stakingStatus.chefContractData.contractAddress}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Query Status</p>
                                <p className="text-gray-600 mt-1">
                                    Valid Data: {stakingStatus.chefContractData.hasValidStakeData ? '✅' : '❌'}
                                </p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">Last Query</p>
                                <p className="text-gray-600 mt-1">
                                    {stakingStatus.chefContractData.lastQueryTime?.toLocaleString() || 'Never'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* 质押时间信息 */}
            {stakingStatus.lastStakeTime && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Staking Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Last Stake Time:</span>
                                <span className="text-sm font-medium">
                                    {stakingStatus.lastStakeTime.toLocaleString()}
                                </span>
                            </div>
                            {stakingStatus.lastUnstakeTime && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Unstake Time:</span>
                                    <span className="text-sm font-medium">
                                        {stakingStatus.lastUnstakeTime.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Staking Duration:</span>
                                <span className="text-sm font-medium">
                                    {Math.floor(stakingStatus.stakingDuration / 86400)} days, {Math.floor((stakingStatus.stakingDuration % 86400) / 3600)} hours
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Token Type:</span>
                                <span className="text-sm font-medium">
                                    {tokenInfo.description}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
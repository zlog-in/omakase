import { useState, useCallback, useEffect, useMemo } from 'react'
import { useAccount, useChainId } from 'wagmi'
// import { parseEther, formatEther } from 'viem'
import { useWaiterContract, useChefReadContract, useOFTContract } from './useContract'
import { SUPPORTED_CHAINS, STAKING_CONSTANTS } from '@/lib/constants'
import { customToast } from '@/lib/toast'
import {
  formatTokenAmount,
  formatUSDCAmount,
  parseTokenAmount,
  calculateCurrentReward,
  getStakingStatus as getStakingStatusFromInfo,  // 重命名以避免冲突
  canCancelUnstake,
  canWithdraw,
  calculateRewardProjection,
  calculateTimeRemaining,
  formatTimeRemaining,
  calculateAPR
} from '@/lib/utils'
import {
  UserStakingPosition,
  StakingStatus,
  GlobalStats,
  RewardCalculation,
  UseStakingReturn,
  ContractStakeInfo,
  SupportedChainId,
  ChefContractDataStatus,
  ChefContractQueryResult
} from '@/types'

export function useStaking(): UseStakingReturn {
  const { address } = useAccount()
  const chainId = useChainId()
  const [isLoading, setIsLoading] = useState(false)
  const [hasActivePositionPrev, setHasActivePositionPrev] = useState(false)

  // 类型安全的链ID检查
  const safeChainId = useMemo(() => {
    if (!chainId) return 11155111 // 默认值
    return [11155111, 421614, 84532].includes(chainId) ? chainId as SupportedChainId : 11155111
  }, [chainId])

  const waiterContract = useWaiterContract(safeChainId)
  
  // ✅ 质押查询逻辑：始终查询 Base Sepolia 上的 Chef 合约
  // Chef 合约部署在 Base Sepolia 上，存储所有用户的质押数据
  // 无论用户在哪个链上操作，都从 Chef 合约查询质押状态
  const chefQueries = useChefReadContract()
  
  // ✅ Token余额查询逻辑：根据当前链查询正确的token合约
  // - Ethereum Sepolia: 查询原生 ERC20 合约 (Omakase 0x2dA9...)
  // - Arbitrum Sepolia: 查询 OFT 合约 (0x3b6B...)  
  // - Base Sepolia: 查询 OFT 合约 (0x3b6B...)
  const oftContract = useOFTContract(safeChainId)

  // 获取用户质押信息 - 使用增强的Chef合约查询结果
  const chefStakeInfoQuery: ChefContractQueryResult<ContractStakeInfo> = chefQueries.getUserStakeInfo(address || '0x0' as `0x${string}`)
  
  // 兼容性包装，保持原有接口
  const refetchStakeInfo = () => {
    // 这里需要手动触发refetch，但由于新的结构，我们可能需要重新思考这部分
    console.log('🔄 Refetching stake info from Chef contract...')
  }

  // 获取用户实时奖励 - 类型安全处理
  const {
    data: userRewards,
    refetch: refetchRewards,
    isLoading: isLoadingRewards,
    error: rewardsError
  } = chefQueries.getUserReward(address || '0x0' as `0x${string}`)

  // 获取unstake锁定时间 - 类型安全处理
  const {
    data: unstakeLockTime,
    refetch: refetchUnstakeLockTime,
    error: unstakeLockError
  } = chefQueries.getUserUnstakeLockTime(address || '0x0' as `0x${string}`)

  // 获取总质押量
  const { data: totalStaked, error: totalStakedError } = chefQueries.getTotalStakedAmount()

  // 获取token信息 - 类型安全处理
  const tokenInfo = oftContract.useTokenInfo()
  const { data: tokenBalance, error: balanceError } = oftContract.getTokenBalance(address || '0x0' as `0x${string}`)
  
  // 获取token allowance - 在顶级调用Hook
  const { data: tokenAllowance, refetch: refetchAllowance } = oftContract.useTokenAllowance(
    address || '0x0' as `0x${string}`, 
    waiterContract.address || '0x0' as `0x${string}`
  )

  // 获取合约常量 - 类型安全处理
  const { data: contractUnstakePeriod } = chefQueries.getUnstakePeriod()
  const { data: contractRewardRate } = chefQueries.getStakeRewardRate()

  // 类型安全的数据访问辅助函数 - 使用增强的Chef查询结果
  const safeUserStakeInfo = useMemo((): ContractStakeInfo | null => {
    if (!chefStakeInfoQuery.data || chefStakeInfoQuery.isEmpty) return null

    // Chef合约数据已经经过验证和转换
    return chefStakeInfoQuery.data
  }, [chefStakeInfoQuery.data, chefStakeInfoQuery.isEmpty])

  // 类型安全的token信息访问
  const safeTokenInfo = useMemo(() => ({
    decimals: tokenInfo.decimals ?? 18,
    sharedDecimals: tokenInfo.sharedDecimals ?? 18,
    name: tokenInfo.name ?? 'OFT',
    symbol: tokenInfo.symbol ?? 'OFT',
    isLoading: tokenInfo.isLoading,
    error: tokenInfo.error
  }), [tokenInfo])

  // 类型安全的奖励数据访问
  const safeUserRewards = useMemo((): bigint => {
    if (typeof userRewards === 'bigint') return userRewards
    return 0n
  }, [userRewards])

  // 类型安全的余额访问
  const safeTokenBalance = useMemo((): bigint => {
    if (typeof tokenBalance === 'bigint') return tokenBalance
    return 0n
  }, [tokenBalance])

  // 质押操作 - 使用自定义toast
  const stake = useCallback(async (amount: string): Promise<void> => {
    if (!waiterContract.address || !oftContract.address || !safeChainId || !address) {
      throw new Error('Contract not available or wallet not connected')
    }

    setIsLoading(true)
    try {
      const amountWei = parseTokenAmount(amount, safeTokenInfo.decimals)

      if (amountWei <= 0n) {
        throw new Error('Invalid stake amount')
      }

      // 检查是否会取消现有的unstake
      const willCancelUnstake = safeUserStakeInfo && canCancelUnstake(safeUserStakeInfo)

      if (willCancelUnstake) {
        const confirmed = window.confirm(
          '🔄 RESTART STAKING CYCLE\n\n' +
          'You have a pending unstake request. Staking now will:\n' +
          '✅ Cancel your withdrawal countdown\n' +
          '🔄 Reset your staking position\n' +
          '💰 Resume earning rewards immediately\n\n' +
          'This is the intended staking cycle behavior.\n' +
          'Continue with staking?'
        )
        if (!confirmed) {
          setIsLoading(false)
          return
        }
        customToast.staking.unstakeCancelWarning()
      }

      // 检查并执行授权
      const currentAllowance = tokenAllowance as bigint | undefined

      if (!currentAllowance || currentAllowance < amountWei) {
        customToast.loading('Requesting token approval...', { id: 'approval' })
        await oftContract.approve(waiterContract.address, amountWei)
        customToast.staking.approvalSuccess()
        // 刷新 allowance 数据
        await refetchAllowance()
      }

      // 执行质押
      await waiterContract.stake(amountWei)

      if (willCancelUnstake) {
        customToast.staking.stakeSuccess('🔄 Staking cycle restarted! Your unstake request has been cancelled and you\'re earning rewards again.')
      } else {
        customToast.staking.stakeSuccess()
      }

      // 刷新数据
      console.log('🔄 Refreshing staking data after stake operation...')
      await Promise.all([
        refetchStakeInfo(),
        refetchRewards(),
        refetchUnstakeLockTime()
      ])
      console.log('✅ Staking data refreshed successfully')

    } catch (error: any) {
      console.error('Stake failed:', error)
      const errorMessage = error?.message || 'Stake failed'
      customToast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [
    waiterContract,
    oftContract,
    safeChainId,
    address,
    safeUserStakeInfo,
    safeTokenInfo.decimals,
    tokenAllowance,
    refetchStakeInfo,
    refetchRewards,
    refetchUnstakeLockTime,
    refetchAllowance
  ])

  // Unstake操作 - 使用自定义toast
  const unstake = useCallback(async (): Promise<void> => {
    if (!waiterContract.address || !safeChainId || !safeUserStakeInfo) {
      throw new Error('Cannot unstake: invalid state')
    }

    if (safeUserStakeInfo.lastUnstakeTime > 0n) {
      customToast.error('You have already initiated an unstake request')
      return
    }

    setIsLoading(true)
    try {
      await waiterContract.unstake()

      customToast.staking.unstakeSuccess(STAKING_CONSTANTS.UNSTAKE_PERIOD)

      // 刷新数据
      console.log('🔄 Refreshing staking data after unstake operation...')
      await Promise.all([
        refetchStakeInfo(),
        refetchUnstakeLockTime()
      ])
      console.log('✅ Unstake data refreshed successfully')

    } catch (error: any) {
      console.error('Unstake failed:', error)
      const errorMessage = error?.message || 'Unstake failed'
      customToast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [waiterContract, safeChainId, safeUserStakeInfo, refetchStakeInfo, refetchUnstakeLockTime])

  // Withdraw操作 - 使用自定义toast
  const withdraw = useCallback(async (): Promise<void> => {
    if (!waiterContract.address || !safeChainId || !safeUserStakeInfo) {
      throw new Error('Cannot withdraw: invalid state')
    }

    if (!canWithdraw(safeUserStakeInfo)) {
      customToast.error('Unstake lock period has not passed yet')
      return
    }

    setIsLoading(true)
    try {
      await waiterContract.withdraw()

      customToast.staking.withdrawSuccess()

      // 刷新数据
      console.log('🔄 Refreshing staking data after withdraw operation...')
      await Promise.all([
        refetchStakeInfo(),
        refetchUnstakeLockTime()
      ])
      console.log('✅ Withdraw data refreshed successfully')

    } catch (error: any) {
      console.error('Withdraw failed:', error)
      const errorMessage = error?.message || 'Withdraw failed'
      customToast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [waiterContract, safeChainId, safeUserStakeInfo, refetchStakeInfo, refetchUnstakeLockTime])

  // Claim奖励操作 - 使用自定义toast
  const claimReward = useCallback(async (): Promise<void> => {
    if (!waiterContract.address || !safeChainId || !address) {
      throw new Error('Cannot claim: invalid state')
    }

    if (safeUserRewards === 0n) {
      customToast.error('No rewards available to claim')
      return
    }

    setIsLoading(true)
    try {
      await waiterContract.claim()

      const rewardAmount = formatUSDCAmount(safeUserRewards)
      customToast.staking.claimSuccess(rewardAmount)

      // 刷新奖励数据
      console.log('🔄 Refreshing reward data after claim operation...')
      await refetchRewards()
      console.log('✅ Reward data refreshed successfully')

    } catch (error: any) {
      console.error('Claim reward failed:', error)
      const errorMessage = error?.message || 'Claim reward failed'
      customToast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [waiterContract, safeChainId, address, safeUserRewards, refetchRewards])

  // 取消Unstake操作 - 使用自定义toast
  const cancelUnstake = useCallback(async (stakeAmount: string = '0.001'): Promise<void> => {
    if (!safeUserStakeInfo || !canCancelUnstake(safeUserStakeInfo)) {
      customToast.error('No unstake request to cancel')
      return
    }

    const confirmed = window.confirm(
      '🔄 RESTART STAKING CYCLE\n\n' +
      'This will stake additional tokens to:\n' +
      '✅ Cancel your current unstake request\n' +
      '🔄 Reset your staking position\n' +
      '💰 Resume earning rewards immediately\n\n' +
      'You can unstake again anytime if needed.\n' +
      'Continue with restarting your staking cycle?'
    )

    if (!confirmed) return

    // 使用stake函数，它会自动处理取消unstake的逻辑
    await stake(stakeAmount)
  }, [safeUserStakeInfo, stake])

  // 获取token余额 - 类型安全版本
  const getTokenBalance = useCallback((): string => {
    return formatTokenAmount(safeTokenBalance, safeTokenInfo.decimals)
  }, [safeTokenBalance, safeTokenInfo.decimals])

  // 获取质押状态 - 核心功能，类型安全版本，包含Chef合约元数据
  const getStakingStatus = useCallback((): UserStakingPosition => {
    const defaultPosition: UserStakingPosition = {
      address: (address || '0x0') as `0x${string}`,
      chainId: safeChainId,
      stakedAmount: '0',
      stakedAmountRaw: 0n,
      rewards: '0',
      rewardsRaw: 0n,
      status: StakingStatus.NOT_STAKED,
      hasStaked: false,
      hasUnstaked: false,
      canWithdraw: false,
      lastStakeTime: null,
      lastUnstakeTime: null,
      unstakeUnlockTime: null,
      unstakeLockRemaining: 0,
      stakingDuration: 0,
      estimatedDailyReward: '0',
      totalRewardAccrued: '0',
      isUnstakeCancellable: false,
      chefContractData: {
        queryStatus: chefStakeInfoQuery.status,
        lastQueryTime: new Date(),
        isFirstTimeUser: chefStakeInfoQuery.status === ChefContractDataStatus.NO_DATA,
        hasValidStakeData: false,
        contractAddress: SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress || 'Unknown'
      }
    }

    if (!address || !safeUserStakeInfo) {
      return defaultPosition
    }

    const status = getStakingStatusFromInfo(safeUserStakeInfo)
    const hasStaked = safeUserStakeInfo.stakeAmount > 0n
    const hasUnstaked = safeUserStakeInfo.lastUnstakeTime > 0n
    const canWithdrawNow = canWithdraw(safeUserStakeInfo)
    const isUnstakeCancellable = canCancelUnstake(safeUserStakeInfo)

    // 计算时间相关信息 - 类型安全
    const now = Math.floor(Date.now() / 1000)
    const lastStakeTime = safeUserStakeInfo.lastStakeTime > 0n
      ? new Date(Number(safeUserStakeInfo.lastStakeTime) * 1000)
      : null
    const lastUnstakeTime = safeUserStakeInfo.lastUnstakeTime > 0n
      ? new Date(Number(safeUserStakeInfo.lastUnstakeTime) * 1000)
      : null

    let unstakeUnlockTime: Date | null = null
    let unstakeLockRemaining = 0

    if (hasUnstaked && lastUnstakeTime) {
      const unstakeTimestamp = Number(safeUserStakeInfo.lastUnstakeTime)
      const unlockTimestamp = unstakeTimestamp + STAKING_CONSTANTS.UNSTAKE_PERIOD
      unstakeUnlockTime = new Date(unlockTimestamp * 1000)

      if (typeof unstakeLockTime === 'bigint') {
        unstakeLockRemaining = Number(unstakeLockTime)
      } else {
        unstakeLockRemaining = Math.max(0, unlockTimestamp - now)
      }
    }

    // 计算质押持续时间 - 类型安全
    const stakingDuration = lastStakeTime ? now - Math.floor(lastStakeTime.getTime() / 1000) : 0

    // 计算当前奖励 - 类型安全
    const currentReward = safeUserRewards || calculateCurrentReward(safeUserStakeInfo, safeTokenInfo.sharedDecimals)

    // 计算预估奖励 - 类型安全
    const rewardProjection = calculateRewardProjection(safeUserStakeInfo.stakeAmount, safeTokenInfo.sharedDecimals)

    return {
      address,
      chainId: safeChainId,
      stakedAmount: formatTokenAmount(safeUserStakeInfo.stakeAmount, safeTokenInfo.decimals),
      stakedAmountRaw: safeUserStakeInfo.stakeAmount,
      rewards: formatUSDCAmount(currentReward),
      rewardsRaw: currentReward,
      status,
      hasStaked,
      hasUnstaked,
      canWithdraw: canWithdrawNow,
      lastStakeTime,
      lastUnstakeTime,
      unstakeUnlockTime,
      unstakeLockRemaining,
      stakingDuration,
      estimatedDailyReward: rewardProjection.projectedDailyReward,
      totalRewardAccrued: formatUSDCAmount(currentReward),
      isUnstakeCancellable,
      chefContractData: {
        queryStatus: chefStakeInfoQuery.status,
        lastQueryTime: new Date(),
        isFirstTimeUser: chefStakeInfoQuery.status === ChefContractDataStatus.NO_DATA,
        hasValidStakeData: hasStaked || hasUnstaked || currentReward > 0n,
        contractAddress: SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress || 'Unknown'
      }
    }
  }, [
    address,
    safeChainId,
    safeUserStakeInfo,
    safeUserRewards,
    unstakeLockTime,
    safeTokenInfo,
    chefStakeInfoQuery.status
  ])

  // 获取全局统计数据 - 类型安全版本
  const getGlobalStats = useCallback((): GlobalStats => {
    const safeTotalStaked = typeof totalStaked === 'bigint' ? totalStaked : 0n
    const safeUnstakePeriod = typeof contractUnstakePeriod === 'bigint'
      ? Number(contractUnstakePeriod)
      : STAKING_CONSTANTS.UNSTAKE_PERIOD
    const safeRewardRate = typeof contractRewardRate === 'bigint'
      ? Number(contractRewardRate)
      : STAKING_CONSTANTS.STAKE_REWARD_RATE

    return {
      totalStaked: formatTokenAmount(safeTotalStaked, safeTokenInfo.decimals),
      totalStakedRaw: safeTotalStaked,
      totalRewards: '0', // TODO: 实现总奖励统计
      totalUsers: 0, // TODO: 实现用户数统计
      averageStakeAmount: '0', // TODO: 实现平均质押量统计
      stakingAPR: calculateAPR(safeRewardRate),
      unstakePeriod: safeUnstakePeriod,
      rewardRate: safeRewardRate
    }
  }, [totalStaked, safeTokenInfo.decimals, contractUnstakePeriod, contractRewardRate])

  // 获取奖励计算 - 类型安全版本
  const getRewardCalculation = useCallback((): RewardCalculation => {
    if (!safeUserStakeInfo) {
      return {
        currentReward: '0',
        projectedDailyReward: '0',
        projectedWeeklyReward: '0',
        projectedMonthlyReward: '0',
        annualPercentageRate: calculateAPR()
      }
    }

    const currentReward = safeUserRewards || calculateCurrentReward(safeUserStakeInfo, safeTokenInfo.sharedDecimals)
    const projection = calculateRewardProjection(safeUserStakeInfo.stakeAmount, safeTokenInfo.sharedDecimals)

    return {
      currentReward: formatUSDCAmount(currentReward),
      projectedDailyReward: projection.projectedDailyReward,
      projectedWeeklyReward: projection.projectedWeeklyReward,
      projectedMonthlyReward: projection.projectedMonthlyReward,
      annualPercentageRate: projection.annualPercentageRate
    }
  }, [safeUserStakeInfo, safeUserRewards, safeTokenInfo.sharedDecimals])

  // 状态检查函数 - 类型安全版本
  const canStake = useCallback((amount: string): boolean => {
    if (!amount || !address || safeTokenBalance === 0n) return false

    try {
      const amountWei = parseTokenAmount(amount, safeTokenInfo.decimals)
      return amountWei > 0n && amountWei <= safeTokenBalance
    } catch {
      return false
    }
  }, [address, safeTokenBalance, safeTokenInfo.decimals])

  const canUnstake = useCallback((): boolean => {
    if (!safeUserStakeInfo) return false
    return safeUserStakeInfo.stakeAmount > 0n && safeUserStakeInfo.lastUnstakeTime === 0n
  }, [safeUserStakeInfo])

  const canWithdrawCheck = useCallback((): boolean => {
    if (!safeUserStakeInfo) return false
    return canWithdraw(safeUserStakeInfo)
  }, [safeUserStakeInfo])

  const canClaim = useCallback((): boolean => {
    return safeUserRewards > 0n
  }, [safeUserRewards])

  // 数据刷新函数 - 类型安全版本
  const refetch = useCallback((): void => {
    Promise.all([
      refetchStakeInfo(),
      refetchRewards(),
      refetchUnstakeLockTime()
    ]).catch((error) => {
      console.error('Failed to refetch staking data:', error)
    })
  }, [refetchStakeInfo, refetchRewards, refetchUnstakeLockTime])

  // 初始连接时检查仓位状态
  useEffect(() => {
    if (address && safeUserStakeInfo) {
      const hasActivePosition = safeUserStakeInfo.stakeAmount > 0n || 
                               safeUserStakeInfo.lastUnstakeTime > 0n ||
                               safeUserRewards > 0n
      
      console.log(`👛 Wallet connected: ${address}`)
      console.log(`📊 Staking Position Summary:`)
      console.log(`   • Staked Amount: ${safeUserStakeInfo.stakeAmount}`)
      console.log(`   • Last Unstake Time: ${safeUserStakeInfo.lastUnstakeTime}`)
      console.log(`   • Current Rewards: ${safeUserRewards}`)
      console.log(`   • Has Active Position: ${hasActivePosition}`)
    }
  }, [
    address, 
    safeUserStakeInfo?.stakeAmount, 
    safeUserStakeInfo?.lastUnstakeTime, 
    safeUserRewards
  ])

  // 自动刷新数据 - 只在有质押仓位时刷新
  useEffect(() => {
    if (!address || !safeUserStakeInfo) {
      setHasActivePositionPrev(false)
      return
    }
    
    // 检查用户是否有活跃的质押仓位
    const hasActivePosition = safeUserStakeInfo.stakeAmount > 0n || 
                             safeUserStakeInfo.lastUnstakeTime > 0n ||
                             safeUserRewards > 0n

    // 更新仓位状态跟踪
    const positionStatusChanged = hasActivePosition !== hasActivePositionPrev
    setHasActivePositionPrev(hasActivePosition)

    // 只有在有活跃仓位时才启动定时刷新
    if (!hasActivePosition) {
      if (positionStatusChanged) {
        console.log('🔍 No active staking position found - stopping auto-refresh')
      }
      return
    }

    if (positionStatusChanged) {
      console.log('🔄 Active staking position detected - starting auto-refresh every 10s')
    }
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing staking data...')
      refetch()
    }, 10000) // 每10秒刷新一次

    return () => {
      if (positionStatusChanged) {
        console.log('🛑 Stopping auto-refresh')
      }
      clearInterval(interval)
    }
  }, [
    address, 
    safeUserStakeInfo?.stakeAmount, 
    safeUserStakeInfo?.lastUnstakeTime, 
    safeUserRewards, 
    hasActivePositionPrev, 
    refetch
  ])

  // 计算总加载状态 - 类型安全版本
  const totalIsLoading = useMemo(() => {
    return isLoading ||
      chefStakeInfoQuery.isLoading ||
      isLoadingRewards ||
      safeTokenInfo.isLoading
  }, [isLoading, chefStakeInfoQuery.isLoading, isLoadingRewards, safeTokenInfo.isLoading])

  // 错误日志记录
  useEffect(() => {
    const errors = [
      chefStakeInfoQuery.error,
      rewardsError,
      unstakeLockError,
      totalStakedError,
      balanceError,
      safeTokenInfo.error
    ].filter(Boolean)

    if (errors.length > 0) {
      console.warn('Staking hook errors:', errors)
    }
  }, [chefStakeInfoQuery.error, rewardsError, unstakeLockError, totalStakedError, balanceError, safeTokenInfo.error])

  return {
    isLoading: totalIsLoading,
    stake,
    unstake,
    withdraw,
    claimReward,
    cancelUnstake,
    getTokenBalance,
    getStakingStatus,
    getGlobalStats,
    getRewardCalculation,
    canStake,
    canUnstake,
    canWithdraw: canWithdrawCheck,
    canClaim,
    refetch,
  }
}

// 辅助Hook：实时倒计时 - 类型安全版本
export function useUnstakeCountdown(unstakeUnlockTime: Date | null): string {
  const [timeRemaining, setTimeRemaining] = useState<string>('')

  useEffect(() => {
    if (!unstakeUnlockTime) {
      setTimeRemaining('')
      return
    }

    const updateCountdown = (): void => {
      const now = new Date().getTime()
      const unlockTime = unstakeUnlockTime.getTime()
      const remainingMs = unlockTime - now

      if (remainingMs <= 0) {
        setTimeRemaining('Ready to withdraw')
        return
      }

      const remainingSeconds = Math.floor(remainingMs / 1000)
      setTimeRemaining(formatTimeRemaining(remainingSeconds, { compact: true }))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [unstakeUnlockTime])

  return timeRemaining
}

// 辅助Hook：奖励实时计算 - 类型安全版本
export function useRealtimeRewards(
  userStakeInfo: ContractStakeInfo | undefined,
  sharedDecimals: number = 18
): bigint {
  const [realtimeReward, setRealtimeReward] = useState<bigint>(0n)

  useEffect(() => {
    if (!userStakeInfo || userStakeInfo.stakeAmount === 0n) {
      setRealtimeReward(0n)
      return
    }

    const updateReward = (): void => {
      try {
        const currentReward = calculateCurrentReward(userStakeInfo, sharedDecimals)
        setRealtimeReward(currentReward)
      } catch (error) {
        console.error('Error calculating realtime reward:', error)
        setRealtimeReward(0n)
      }
    }

    updateReward()
    const interval = setInterval(updateReward, 1000) // 每秒更新

    return () => clearInterval(interval)
  }, [userStakeInfo, sharedDecimals])

  return realtimeReward
}

// 辅助Hook：检测质押状态变化 - 使用自定义toast
export function useStakingStatusChange(currentStatus: StakingStatus): {
  previousStatus: StakingStatus
  statusChanged: boolean
} {
  const [previousStatus, setPreviousStatus] = useState<StakingStatus>(currentStatus)
  const [statusChanged, setStatusChanged] = useState(false)

  useEffect(() => {
    if (currentStatus !== previousStatus) {
      setStatusChanged(true)
      setPreviousStatus(currentStatus)

      // 显示状态变化通知
      switch (currentStatus) {
        case StakingStatus.ACTIVE:
          if (previousStatus === StakingStatus.UNSTAKED) {
            customToast.staking.statusChange.active(true)
          } else {
            customToast.staking.statusChange.active(false)
          }
          break
        case StakingStatus.UNSTAKED:
          customToast.staking.statusChange.unstaked()
          break
        case StakingStatus.WITHDRAWN:
          customToast.staking.statusChange.withdrawn()
          break
        default:
          break
      }

      // 重置状态变化标志
      const timer = setTimeout(() => setStatusChanged(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [currentStatus, previousStatus])

  return {
    previousStatus,
    statusChanged
  }
}
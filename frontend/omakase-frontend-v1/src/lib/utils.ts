import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatEther, parseEther } from "viem"
import { STAKING_CONSTANTS, TIME_UTILS } from "./constants"
// 修复：使用值导入而不是类型导入
import {
    StakingStatus,
    type TimeRemaining,
    type TimeFormatOptions,
    type ContractStakeInfo,
    type RewardCalculation
} from "@/types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// ================================ 数量格式化工具 ================================

/**
 * 格式化代币数量显示
 */
export function formatTokenAmount(
    amount: bigint,
    decimals: number = 18,
    displayDecimals: number = 4
): string {
    if (amount === 0n) return '0'

    const formatted = formatEther(amount * BigInt(10 ** (18 - decimals)))
    const num = parseFloat(formatted)

    if (num < 0.0001) return '< 0.0001'
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K'

    return num.toFixed(displayDecimals)
}

/**
 * 格式化USDC奖励数量
 */
export function formatUSDCAmount(amount: bigint, displayDecimals: number = 4): string {
    return formatTokenAmount(amount, STAKING_CONSTANTS.USDC_DECIMALS, displayDecimals)
}

/**
 * 解析用户输入的数量
 */
export function parseTokenAmount(amount: string, decimals: number = 18): bigint {
    try {
        if (!amount || amount === '') return 0n
        const parsed = parseEther(amount)
        return parsed / BigInt(10 ** (18 - decimals))
    } catch {
        return 0n
    }
}

// ================================ 时间工具函数 ================================

/**
 * 计算剩余时间
 */
export function calculateTimeRemaining(targetTimestamp: number): TimeRemaining {
    const now = Math.floor(Date.now() / TIME_UTILS.MS_PER_SECOND)
    const remaining = targetTimestamp - now

    if (remaining <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isExpired: true
        }
    }

    const days = Math.floor(remaining / TIME_UTILS.SECONDS_PER_DAY)
    const hours = Math.floor((remaining % TIME_UTILS.SECONDS_PER_DAY) / TIME_UTILS.SECONDS_PER_HOUR)
    const minutes = Math.floor((remaining % TIME_UTILS.SECONDS_PER_HOUR) / TIME_UTILS.SECONDS_PER_MINUTE)
    const seconds = remaining % TIME_UTILS.SECONDS_PER_MINUTE

    return {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: remaining,
        isExpired: false
    }
}

/**
 * 格式化时间显示
 */
export function formatTimeRemaining(
    seconds: number,
    options: TimeFormatOptions = {}
): string {
    const {
        showDays = true,
        showHours = true,
        showMinutes = true,
        showSeconds = true,
        compact = false
    } = options

    if (seconds <= 0) return 'Expired'

    const timeRemaining = calculateTimeRemaining(Math.floor(Date.now() / 1000) + seconds)
    const parts: string[] = []

    if (showDays && timeRemaining.days > 0) {
        parts.push(compact ? `${timeRemaining.days}d` : `${timeRemaining.days} day${timeRemaining.days !== 1 ? 's' : ''}`)
    }

    if (showHours && timeRemaining.hours > 0) {
        parts.push(compact ? `${timeRemaining.hours}h` : `${timeRemaining.hours} hour${timeRemaining.hours !== 1 ? 's' : ''}`)
    }

    if (showMinutes && timeRemaining.minutes > 0) {
        parts.push(compact ? `${timeRemaining.minutes}m` : `${timeRemaining.minutes} minute${timeRemaining.minutes !== 1 ? 's' : ''}`)
    }

    if (showSeconds && timeRemaining.seconds > 0) {
        parts.push(compact ? `${timeRemaining.seconds}s` : `${timeRemaining.seconds} second${timeRemaining.seconds !== 1 ? 's' : ''}`)
    }

    if (parts.length === 0) return 'Less than 1 second'

    return parts.join(compact ? ' ' : ', ')
}

// ================================ 质押相关工具 ================================

/**
 * 计算质押奖励
 */
export function calculateStakeReward(
    stakeAmount: bigint,
    durationSeconds: number,
    rewardRate: number = STAKING_CONSTANTS.STAKE_REWARD_RATE,
    oftSharedDecimals: number = 18
): bigint {
    if (stakeAmount === 0n || durationSeconds <= 0) return 0n

    // 根据合约逻辑: stakeAmount * STAKE_REWARD_RATE * duration / sharedDecimals
    return (stakeAmount * BigInt(rewardRate) * BigInt(durationSeconds)) / BigInt(10 ** oftSharedDecimals)
}

/**
 * 计算当前总奖励
 */
export function calculateCurrentReward(stakeInfo: ContractStakeInfo, oftSharedDecimals: number = 18): bigint {
    const now = BigInt(Math.floor(Date.now() / 1000))
    const timeSinceLastStake = Number(now - stakeInfo.lastStakeTime)

    const newReward = calculateStakeReward(
        stakeInfo.stakeAmount,
        timeSinceLastStake,
        STAKING_CONSTANTS.STAKE_REWARD_RATE,
        oftSharedDecimals
    )

    return stakeInfo.stakeReward + newReward
}

/**
 * 获取质押状态 - 恢复时间依赖逻辑
 */
export function getStakingStatus(stakeInfo: ContractStakeInfo): StakingStatus {
    const hasStaked = stakeInfo.stakeAmount > 0n
    const hasUnstaked = stakeInfo.lastUnstakeTime > 0n

    if (!hasStaked) {
        return StakingStatus.NOT_STAKED
    }

    if (hasUnstaked) {
        // 检查是否可以withdraw来确定具体状态
        return StakingStatus.UNSTAKED
    }

    return StakingStatus.ACTIVE
}

/**
 * 检查是否可以取消unstake
 */
export function canCancelUnstake(stakeInfo: ContractStakeInfo): boolean {
    // 只有在unstaked状态且还在锁定期内才能取消
    return stakeInfo.lastUnstakeTime > 0n && stakeInfo.stakeAmount > 0n
}

/**
 * 检查是否可以withdraw - 需要等待15秒锁定期间
 */
export function canWithdraw(stakeInfo: ContractStakeInfo): boolean {
    if (stakeInfo.lastUnstakeTime === 0n) return false

    const now = Math.floor(Date.now() / 1000)
    const unstakeTime = Number(stakeInfo.lastUnstakeTime)

    return (now - unstakeTime) >= STAKING_CONSTANTS.UNSTAKE_PERIOD
}

/**
 * 计算APR
 */
export function calculateAPR(
    rewardRatePerSecond: number = STAKING_CONSTANTS.STAKE_REWARD_RATE
): number {
    // 假设OFT和USDC价值相等，计算年化收益率
    // rewardRate是每秒的BP (基点)，1 BP = 0.01%
    const secondsPerYear = 365 * 24 * 3600
    const annualRewardRate = rewardRatePerSecond * secondsPerYear

    // 转换为百分比 (BP to percentage)
    return (annualRewardRate / 10000) * 100
}

/**
 * 计算奖励预测
 */
export function calculateRewardProjection(
    stakeAmount: bigint,
    oftSharedDecimals: number = 18
): RewardCalculation {
    const dailySeconds = TIME_UTILS.SECONDS_PER_DAY
    const weeklySeconds = dailySeconds * 7
    const monthlySeconds = dailySeconds * 30

    const dailyReward = calculateStakeReward(stakeAmount, dailySeconds, STAKING_CONSTANTS.STAKE_REWARD_RATE, oftSharedDecimals)
    const weeklyReward = calculateStakeReward(stakeAmount, weeklySeconds, STAKING_CONSTANTS.STAKE_REWARD_RATE, oftSharedDecimals)
    const monthlyReward = calculateStakeReward(stakeAmount, monthlySeconds, STAKING_CONSTANTS.STAKE_REWARD_RATE, oftSharedDecimals)

    return {
        currentReward: '0', // 需要从外部传入
        projectedDailyReward: formatUSDCAmount(dailyReward),
        projectedWeeklyReward: formatUSDCAmount(weeklyReward),
        projectedMonthlyReward: formatUSDCAmount(monthlyReward),
        annualPercentageRate: calculateAPR()
    }
}

// ================================ 状态检查工具 ================================

/**
 * 检查网络是否支持
 */
export function isSupportedChain(chainId: number): boolean {
    return [11155111, 421614, 84532].includes(chainId)
}

/**
 * 检查地址是否有效
 */
export function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * 检查数量是否有效
 */
export function isValidAmount(amount: string): boolean {
    if (!amount || amount === '') return false

    try {
        const num = parseFloat(amount)
        return num > 0 && !isNaN(num) && isFinite(num)
    } catch {
        return false
    }
}

// ================================ 错误处理工具 ================================

/**
 * 格式化错误信息
 */
export function formatError(error: unknown): string {
    if (typeof error === 'string') return error

    if (error && typeof error === 'object' && 'reason' in error && typeof error.reason === 'string') return error.reason
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') return error.message
    if (error && typeof error === 'object' && 'shortMessage' in error && typeof error.shortMessage === 'string') return error.shortMessage

    return 'An unknown error occurred'
}

/**
 * 检查是否是用户拒绝交易错误
 */
export function isUserRejectedError(error: unknown): boolean {
    const message = formatError(error).toLowerCase()
    return message.includes('user rejected') ||
        message.includes('user denied') ||
        message.includes('user cancelled')
}

// ================================ 链相关工具 ================================

/**
 * 获取区块链浏览器URL
 */
export function getExplorerUrl(chainId: number): string {
    switch (chainId) {
        case 11155111: return 'https://sepolia.etherscan.io'
        case 421614: return 'https://sepolia.arbiscan.io'
        case 84532: return 'https://sepolia.basescan.org'
        default: return 'https://etherscan.io'
    }
}

/**
 * 获取交易链接
 */
export function getTxUrl(txHash: string, chainId: number): string {
    return `${getExplorerUrl(chainId)}/tx/${txHash}`
}

/**
 * 获取地址链接
 */
export function getAddressUrl(address: string, chainId: number): string {
    return `${getExplorerUrl(chainId)}/address/${address}`
}

// ================================ 调试工具 ================================

/**
 * 调试日志（仅在开发环境）
 */
export function debugLog(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Staking Debug] ${message}`, data || '')
    }
}

/**
 * 性能监控包装器
 */
export function withPerformance<T extends (...args: unknown[]) => unknown>(
    fn: T,
    name: string
): T {
    return ((...args: unknown[]) => {
        const start = performance.now()
        const result = fn(...args)
        const end = performance.now()

        debugLog(`${name} took ${end - start} milliseconds`)

        return result
    }) as T
}
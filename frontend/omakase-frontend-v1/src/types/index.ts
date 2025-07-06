import { Address } from 'viem'

// 支持的链ID类型
export type SupportedChainId = 11155111 | 421614 | 84532

// 合约地址类型
export type ContractAddress = Address | null

// 质押状态枚举 - 修复：确保既作为类型也作为值导出
export enum StakingStatus {
  NOT_STAKED = 'not_staked',
  ACTIVE = 'active',         // 已质押且活跃
  UNSTAKED = 'unstaked',     // 已发起unstake但未withdraw
  WITHDRAWN = 'withdrawn'    // 已完成withdraw
}

// 交易类型枚举
export enum TransactionType {
  STAKE = 'stake',
  UNSTAKE = 'unstake',
  WITHDRAW = 'withdraw',
  CLAIM = 'claim',
  CANCEL_UNSTAKE = 'cancel_unstake'  // 新增：取消unstake
}

// 交易状态枚举
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// 链配置接口
export interface ChainConfig {
  id: SupportedChainId
  name: string
  rpcUrl: string | undefined
  waiterAddress?: ContractAddress
  chefAddress?: ContractAddress
  oftAddress?: ContractAddress
  layerZeroEndpointId: number
}

// Chef合约中的StakeInfo结构体 - 精确匹配Solidity定义
export interface ContractStakeInfo {
  stakeAmount: bigint       // 用户质押的代币数量 (以wei为单位)
  stakeReward: bigint       // 累积的奖励 (以最小单位为单位, 6 decimals for USDC)
  lastStakeTime: bigint     // 最后一次质押的时间戳 (Unix timestamp in seconds)
  lastUnstakeTime: bigint   // 最后一次发起unstake的时间戳 (0表示未发起unstake)
}

// Chef合约数据状态枚举 - 基于合约逻辑
export enum ChefContractDataStatus {
  NO_DATA = 'no_data',           // 合约返回空数据 (用户从未质押)
  LOADING = 'loading',           // 正在加载数据
  ERROR = 'error',               // 合约调用错误
  SUCCESS = 'success'            // 成功获取数据
}

// Chef合约查询结果包装器
export interface ChefContractQueryResult<T> {
  data: T | null
  status: ChefContractDataStatus
  error?: Error | null
  isLoading: boolean
  isEmpty: boolean               // 数据为空但非错误状态
}

// 前端使用的质押信息 - 扩展合约数据
export interface UserStakingPosition {
  address: Address
  chainId: SupportedChainId

  // 基础信息
  stakedAmount: string          // 格式化的质押数量
  stakedAmountRaw: bigint      // 原始bigint值
  rewards: string              // 格式化的奖励数量
  rewardsRaw: bigint          // 原始bigint值

  // 状态信息
  status: StakingStatus
  hasStaked: boolean
  hasUnstaked: boolean
  canWithdraw: boolean

  // 时间信息
  lastStakeTime: Date | null
  lastUnstakeTime: Date | null
  unstakeUnlockTime: Date | null  // 可以withdraw的时间
  unstakeLockRemaining: number    // 剩余锁定时间（秒）

  // 计算字段
  stakingDuration: number         // 质押持续时间（秒）
  estimatedDailyReward: string    // 预估日奖励
  totalRewardAccrued: string      // 总累计奖励

  // 特殊状态标识
  isUnstakeCancellable: boolean   // 是否可以通过重新质押取消unstake

  // Chef合约元数据
  chefContractData: {
    queryStatus: ChefContractDataStatus    // 合约查询状态
    lastQueryTime: Date | null             // 最后一次查询时间
    isFirstTimeUser: boolean               // 是否为首次使用用户
    hasValidStakeData: boolean             // 是否有有效的质押数据
    contractAddress: string                // Chef合约地址
    blockNumber?: bigint                   // 查询时的区块号
  }
}

// 全局统计数据接口
export interface GlobalStats {
  totalStaked: string
  totalStakedRaw: bigint
  totalRewards: string
  totalUsers: number
  averageStakeAmount: string
  stakingAPR: number           // 年化收益率
  unstakePeriod: number        // unstake锁定期（秒）
  rewardRate: number           // 奖励率（BP per second）
}

// 交易记录接口 - 扩展
export interface TransactionRecord {
  hash: string
  type: TransactionType
  status: TransactionStatus
  amount?: string
  amountRaw?: bigint
  timestamp: Date
  chainId: SupportedChainId
  fromAddress?: Address
  toAddress?: Address
  gasUsed?: string
  gasPrice?: string

  // 新增字段
  rewardAmount?: string        // 对于claim交易
  previousStatus?: StakingStatus  // 交易前状态
  newStatus?: StakingStatus       // 交易后状态
}

// LayerZero消息类型
export interface LayerZeroMessage {
  srcEid: number
  dstEid: number
  sender: Address
  receiver: Address
  guid: string
  message: string
}

// CCTP消息接口
export interface CCTPMessage {
  version: number
  sourceDomain: number
  destinationDomain: number
  nonce: bigint
  sender: Address
  recipient: Address
  destinationCaller: Address
  messageBody: string
}

// Gas费用估算接口
export interface GasEstimate {
  gasLimit: bigint
  gasPrice: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
  totalCost: bigint
}

// LayerZero费用接口
export interface LayerZeroFee {
  nativeFee: bigint
  lzTokenFee: bigint
}

// 质押动作相关类型
export interface StakeAction {
  type: 'stake' | 'unstake' | 'withdraw' | 'claim' | 'cancel_unstake'
  amount?: string
  estimatedGas?: bigint
  estimatedReward?: string
}

// 时间工具类型
export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
  isExpired: boolean
}

// 奖励计算相关
export interface RewardCalculation {
  currentReward: string
  projectedDailyReward: string
  projectedWeeklyReward: string
  projectedMonthlyReward: string
  annualPercentageRate: number
}

// 合约方法参数类型
export interface StakeParams {
  amount: bigint
  dstEid?: number
  extraOptions?: string
}

export interface UnstakeParams {
  dstEid?: number
  extraOptions?: string
}

export interface WithdrawParams {
  dstEid?: number
  extraOptions?: string
}

export interface ClaimParams {
  dstEid?: number
  extraOptions?: string
}

// Hook返回类型 - 更新
export interface UseStakingReturn {
  isLoading: boolean

  // 操作函数
  stake: (amount: string) => Promise<void>
  unstake: () => Promise<void>
  withdraw: () => Promise<void>
  claimReward: () => Promise<void>
  cancelUnstake: (stakeAmount: string) => Promise<void>  // 新增

  // 数据获取
  getTokenBalance: () => string
  getStakingStatus: () => UserStakingPosition
  getGlobalStats: () => GlobalStats
  getRewardCalculation: () => RewardCalculation

  // 状态检查
  canStake: (amount: string) => boolean
  canUnstake: () => boolean
  canWithdraw: () => boolean
  canClaim: () => boolean

  // 数据刷新
  refetch: () => void
}

export interface UseContractReturn {
  address: ContractAddress
  isLoading: boolean
  error: Error | null
}

// 错误类型 - 扩展
export interface StakingError extends Error {
  code?: string | number
  type: 'NETWORK_ERROR' | 'CONTRACT_ERROR' | 'USER_REJECTED' | 'INSUFFICIENT_BALANCE' | 'UNSTAKE_PERIOD_NOT_PASSED' | 'NO_STAKE_FOUND' | 'ALREADY_UNSTAKED'
  details?: any
}

// 网络切换相关类型
export interface NetworkSwitchRequest {
  chainId: SupportedChainId
  chainName: string
  rpcUrls: string[]
  blockExplorerUrls: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
}

// 钱包连接状态
export interface WalletState {
  isConnected: boolean
  address: Address | null
  chainId: SupportedChainId | null
  balance: string
  isConnecting: boolean
  isReconnecting: boolean
}

// 组件Props类型 - 更新
export interface StakeFormProps {
  onStakeSuccess?: (txHash: string) => void
  onUnstakeCancel?: (txHash: string) => void  // 新增
  maxStakeAmount?: string
  showCancelUnstake?: boolean  // 新增
}

export interface StakingDashboardProps {
  refreshInterval?: number
  showTransactionHistory?: boolean
  showAdvancedMetrics?: boolean  // 新增
  showUnstakeCancelOption?: boolean  // 新增
}

export interface NetworkSelectorProps {
  selectedChainId?: SupportedChainId
  onChainChange?: (chainId: SupportedChainId) => void
}

// 表单验证类型
export interface StakeFormValidation {
  isValid: boolean
  errors: {
    amount?: string
    balance?: string
    network?: string
    approval?: string
  }
  warnings: {
    unstakeCancel?: string  // 新增：警告用户重新质押会取消unstake
    lowAmount?: string
  }
}

export interface StakeFormData {
  amount: string
  slippage?: number
  deadline?: number
}

// 合约常量类型
export interface StakingConstants {
  UNSTAKE_PERIOD: number       // 15 seconds
  STAKE_REWARD_RATE: number    // 100 BP per second
  USDC_DECIMALS: number        // 6
  REWARD_DISPLAY_DECIMALS: number  // 4
}

// 时间格式化工具
export interface TimeFormatOptions {
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  showSeconds?: boolean
  compact?: boolean
}

// 配置选项
export interface AppConfig {
  projectId: string
  defaultChainId: SupportedChainId
  supportedChains: SupportedChainId[]
  withdrawLockPeriod: number
  refreshInterval: number
  enableTestMode: boolean
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 链上事件类型
export interface StakeEvent {
  staker: Address
  amount: bigint
  chainId: SupportedChainId
  blockNumber: bigint
  transactionHash: string
  timestamp: number
}

export interface UnstakeEvent {
  staker: Address
  chainId: SupportedChainId
  blockNumber: bigint
  transactionHash: string
  timestamp: number
}

export interface WithdrawEvent {
  staker: Address
  amount: bigint
  chainId: SupportedChainId
  blockNumber: bigint
  transactionHash: string
  timestamp: number
}

export interface ClaimEvent {
  staker: Address
  amount: bigint
  chainId: SupportedChainId
  blockNumber: bigint
  transactionHash: string
  timestamp: number
}

// 表单验证类型
export interface FormValidation {
  isValid: boolean
  errors: Record<string, string>
}

// 实用工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredOnly<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

// 环境变量类型
export interface EnvVars {
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string
  NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC: string
  NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC: string
  NEXT_PUBLIC_BASE_SEPOLIA_RPC: string
  NEXT_PUBLIC_ETHEREUM_SEPOLIA_WAITER_ADDRESS: Address
  NEXT_PUBLIC_ARBITRUM_SEPOLIA_WAITER_ADDRESS: Address
  NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS: Address
  NEXT_PUBLIC_ETHEREUM_SEPOLIA_OFT_ADDRESS: Address
  NEXT_PUBLIC_ARBITRUM_SEPOLIA_OFT_ADDRESS: Address
  NEXT_PUBLIC_BASE_SEPOLIA_OFT_ADDRESS: Address
}

// 工具函数类型
export type FormatAmountFunction = (amount: bigint, decimals?: number, displayDecimals?: number) => string
export type ParseAmountFunction = (amount: string, decimals?: number) => bigint
export type CalculateRewardFunction = (stakeAmount: bigint, duration: number, rate: number) => bigint
export type FormatTimeFunction = (seconds: number, options?: TimeFormatOptions) => string

// 模块声明扩展
declare global {
  interface Window {
    ethereum?: any
  }
}

declare module 'wagmi' {
  interface Register {
    config: typeof import('../lib/wagmi').wagmiConfig
  }
}
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { useEffect } from 'react'
import { Address } from 'viem'
import { WAITER_ABI, CHEF_ABI, OFT_ABI, NATIVE_ERC20_ABI } from '@/lib/contracts'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import { wagmiConfig } from '@/lib/wagmi'
import { ContractStakeInfo, ChefContractDataStatus, ChefContractQueryResult } from '@/types'
import toast from 'react-hot-toast'

// 定义错误类型
interface ContractError extends Error {
  message: string
  code?: string | number
  data?: unknown
}

// Define supported chain IDs type
type SupportedChainId = 11155111 | 421614 | 84532

export function useWaiterContract(chainId: number) {
  const { address } = useAccount()

  const getWaiterAddress = (chainId: number): Address | null => {
    switch (chainId) {
      case SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id:
        return SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.waiterAddress as Address
      case SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id:
        return SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.waiterAddress as Address
      default:
        return null
    }
  }

  // 获取对应链的ERC20代币合约地址（用于approve）
  const getTokenAddress = (chainId: number): Address | null => {
    switch (chainId) {
      case SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id:
        return SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.oftAddress as Address // Omakase原生代币
      case SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id:
        return SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.oftAddress as Address // OFT代币
      default:
        return null
    }
  }

  const contractAddress = getWaiterAddress(chainId)
  const tokenAddress = getTokenAddress(chainId)

  const { writeContract } = useWriteContract()

  // 获取LayerZero费用 - 使用readContract直接调用
  const quoteStake = async (amount: bigint) => {
    if (!contractAddress || !address) throw new Error('No contract or address')
    
    try {
      const data = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'quoteStake',
        args: [address as Address, amount],
      })
      
      if (typeof data !== 'bigint') {
        if (typeof data === 'string') return BigInt(data)
        throw new Error('Failed to fetch LayerZero fee for stake')
      }
      return data
    } catch (error) {
      console.error('Error in quoteStake:', error)
      throw new Error('Failed to fetch LayerZero fee for stake')
    }
  }
  
  const quoteUnstake = async () => {
    if (!contractAddress || !address) throw new Error('No contract or address')
    
    try {
      const data = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'quoteUnstake',
        args: [address as Address],
      })
      
      if (typeof data !== 'bigint') {
        if (typeof data === 'string') return BigInt(data)
        throw new Error('Failed to fetch LayerZero fee for unstake')
      }
      return data
    } catch (error) {
      console.error('Error in quoteUnstake:', error)
      throw new Error('Failed to fetch LayerZero fee for unstake')
    }
  }
  
  const quoteWithdraw = async () => {
    if (!contractAddress || !address) throw new Error('No contract or address')
    
    try {
      const data = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'quoteWithdraw',
        args: [address as Address],
      })
      
      if (typeof data !== 'bigint') {
        if (typeof data === 'string') return BigInt(data)
        throw new Error('Failed to fetch LayerZero fee for withdraw')
      }
      return data
    } catch (error) {
      console.error('Error in quoteWithdraw:', error)
      throw new Error('Failed to fetch LayerZero fee for withdraw')
    }
  }
  
  const quoteClaim = async () => {
    if (!contractAddress || !address) throw new Error('No contract or address')
    
    try {
      const data = await readContract(wagmiConfig, {
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'quoteClaim',
        args: [address as Address],
      })
      
      if (typeof data !== 'bigint') {
        if (typeof data === 'string') return BigInt(data)
        throw new Error('Failed to fetch LayerZero fee for claim')
      }
      return data
    } catch (error) {
      console.error('Error in quoteClaim:', error)
      throw new Error('Failed to fetch LayerZero fee for claim')
    }
  }

  // 代币授权 - 授权Waiter合约使用代币
  const approve = async (amount: bigint) => {
    if (!contractAddress || !tokenAddress) {
      const error = 'Unsupported chain for token approval'
      toast.error(error)
      throw new Error(error)
    }
    try {
      toast.loading('Approving token spending...', { id: 'approve-tx' })
      
      // 获取对应的ABI
      const tokenABI = chainId === SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id ? NATIVE_ERC20_ABI : OFT_ABI
      
      const result = await writeContract({
        address: tokenAddress,
        abi: tokenABI,
        functionName: 'approve',
        args: [contractAddress, amount],
        chainId: chainId as SupportedChainId,
      })
      toast.success('Token approval submitted successfully!', { id: 'approve-tx' })
      return result
    } catch (error: unknown) {
      const contractError = error as ContractError
      const errorMessage = contractError?.message || 'Token approval failed'
      toast.error(errorMessage, { id: 'approve-tx' })
      throw contractError
    }
  }

  // 跨链stake - 更新为匹配Hardhat脚本模式
  const stake = async (amount: bigint) => {
    if (!contractAddress) {
      const error = 'Unsupported chain for staking'
      toast.error(error)
      throw new Error(error)
    }
    try {
      toast.loading('Initiating cross-chain stake transaction...', { id: 'stake-tx' })
      
      // 获取LayerZero费用，传入用户地址和质押数量
      const lzFee = await quoteStake(amount)
      
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'stake',
        args: [amount],
        chainId: chainId as SupportedChainId,
        value: lzFee, // 支付LayerZero费用
      })
      toast.success('Stake transaction submitted successfully!', { id: 'stake-tx' })
      return result
    } catch (error: unknown) {
      const contractError = error as ContractError
      const errorMessage = contractError?.message || 'Stake transaction failed'
      toast.error(errorMessage, { id: 'stake-tx' })
      throw contractError
    }
  }

  // 跨链unstake
  const unstake = async () => {
    if (!contractAddress) {
      const error = 'Unsupported chain for unstaking'
      toast.error(error)
      throw new Error(error)
    }
    try {
      toast.loading('Initiating cross-chain unstake transaction...', { id: 'unstake-tx' })
      const lzFee = await quoteUnstake()
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'unstake',
        args: [],
        chainId: chainId as SupportedChainId,
        value: lzFee,
      })
      toast.success('Unstake transaction submitted successfully!', { id: 'unstake-tx' })
      return result
    } catch (error: unknown) {
      const contractError = error as ContractError
      const errorMessage = contractError?.message || 'Unstake transaction failed'
      toast.error(errorMessage, { id: 'unstake-tx' })
      throw contractError
    }
  }

  // 跨链withdraw
  const withdraw = async () => {
    if (!contractAddress) {
      const error = 'Unsupported chain for withdrawal'
      toast.error(error)
      throw new Error(error)
    }
    try {
      toast.loading('Initiating cross-chain withdraw transaction...', { id: 'withdraw-tx' })
      const lzFee = await quoteWithdraw()
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'withdraw',
        args: [],
        chainId: chainId as SupportedChainId,
        value: lzFee,
      })
      toast.success('Withdraw transaction submitted successfully!', { id: 'withdraw-tx' })
      return result
    } catch (error: unknown) {
      const contractError = error as ContractError
      const errorMessage = contractError?.message || 'Withdraw transaction failed'
      toast.error(errorMessage, { id: 'withdraw-tx' })
      throw contractError
    }
  }

  // 跨链claim
  const claim = async () => {
    if (!contractAddress) {
      const error = 'Unsupported chain for claiming rewards'
      toast.error(error)
      throw new Error(error)
    }
    try {
      toast.loading('Initiating cross-chain claim transaction...', { id: 'claim-tx' })
      const lzFee = await quoteClaim()
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'claim',
        args: [],
        chainId: chainId as SupportedChainId,
        value: lzFee,
      })
      toast.success('Claim transaction submitted successfully!', { id: 'claim-tx' })
      return result
    } catch (error: unknown) {
      const contractError = error as ContractError
      const errorMessage = contractError?.message || 'Claim transaction failed'
      toast.error(errorMessage, { id: 'claim-tx' })
      throw contractError
    }
  }

  return {
    address: contractAddress,
    tokenAddress,
    approve,
    stake,
    unstake,
    withdraw,
    claim,
    quoteStake,
    quoteUnstake,
    quoteWithdraw,
    quoteClaim,
  }
}

export function useChefContract() {
  const contractAddress = SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress as Address

  // 调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('Chef Contract Address:', contractAddress)
    console.log('Environment Variable:', process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS)
    if (!contractAddress) {
      console.warn('⚠️ Chef contract address is not set! Please check NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS environment variable.')
    } else {
      console.log('✅ Chef contract address is configured')
    }
  }

  return {
    address: contractAddress,
    abi: CHEF_ABI,
  }
}

// Chef contract read functions - 修复toast调用问题
export function useChefReadContract() {
  const contractAddress = SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress as Address

  const getTotalStakedAmount = () => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getTotalStakedAmount',
    })

    // 移除渲染期间的toast调用
    useEffect(() => {
      if (result.error) {
        console.error('Failed to fetch total staked amount:', result.error)
      }
    }, [result.error])

    return result
  }

  // Enhanced Chef contract getUserStakeInfo with proper status handling
  const getUserStakeInfo = (staker: Address): ChefContractQueryResult<ContractStakeInfo> => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getUserStakeInfo',
      args: [staker],
      query: {
        enabled: !!staker,
        retry: (failureCount, error) => {
          // Don't retry if it's a "no data" error (user has no stake)
          if (error?.message?.includes('returned no data')) {
            return false
          }
          return failureCount < 3
        }
      }
    })

    // 使用useEffect来处理错误，避免渲染期间的状态更新
    useEffect(() => {
      if (result.error && staker) {
        if (result.error.message?.includes('returned no data')) {
          console.log(`📊 Chef Contract: No staking data for ${staker} - first time user`)
        } else {
          console.error('❌ Chef Contract: Failed to fetch stake info for:', staker, result.error)
        }
      }
    }, [result.error, staker])

    // Enhanced transformation with Chef contract specific status handling
    const isNoDataError = result.error?.message?.includes('returned no data')
    const isEmpty = !result.data || (
      result.data &&
      (result.data as ContractStakeInfo).stakeAmount === 0n &&
      (result.data as ContractStakeInfo).stakeReward === 0n &&
      (result.data as ContractStakeInfo).lastStakeTime === 0n &&
      (result.data as ContractStakeInfo).lastUnstakeTime === 0n
    )

    const status: ChefContractDataStatus = result.isLoading 
      ? ChefContractDataStatus.LOADING
      : isNoDataError
      ? ChefContractDataStatus.NO_DATA
      : result.error 
      ? ChefContractDataStatus.ERROR
      : ChefContractDataStatus.SUCCESS

    const stakeInfo: ContractStakeInfo = result.data ? {
      stakeAmount: (result.data as ContractStakeInfo).stakeAmount || 0n,
      stakeReward: (result.data as ContractStakeInfo).stakeReward || 0n,
      lastStakeTime: (result.data as ContractStakeInfo).lastStakeTime || 0n,
      lastUnstakeTime: (result.data as ContractStakeInfo).lastUnstakeTime || 0n,
    } : {
      stakeAmount: 0n,
      stakeReward: 0n,
      lastStakeTime: 0n,
      lastUnstakeTime: 0n,
    }

    const chefQueryResult: ChefContractQueryResult<ContractStakeInfo> = {
      data: stakeInfo,
      status,
      error: result.error || null,
      isLoading: Boolean(result.isLoading),
      isEmpty: Boolean(isEmpty || isNoDataError)
    }

    return chefQueryResult
  }

  // 获取实时奖励
  const getUserReward = (staker: Address) => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getUserReward',
      args: [staker],
      query: {
        enabled: !!staker && !!contractAddress,
        retry: (failureCount, error) => {
          // Don't retry if it's a "no data" error (user has no stake)
          if (error?.message?.includes('returned no data')) {
            return false
          }
          return failureCount < 3
        }
      }
    })

    useEffect(() => {
      if (result.error && staker && contractAddress) {
        if (result.error.message?.includes('returned no data')) {
          console.log(`💰 No rewards found for ${staker} - user has not staked yet`)
        } else {
          console.error('❌ Failed to fetch rewards for:', staker)
          console.error('Contract Address:', contractAddress)
          console.error('Environment Variable:', process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS)
          console.error('Error Details:', result.error)
        }
      }
    }, [result.error, staker, contractAddress])

    return result
  }

  // 获取unstake锁定剩余时间
  const getUserUnstakeLockTime = (staker: Address) => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getUserUnstakeLockTime',
      args: [staker],
      query: {
        enabled: !!staker,
        retry: (failureCount, error) => {
          // Don't retry if it's a "no data" error or revert (user has no unstake)
          if (error?.message?.includes('returned no data') || error?.message?.includes('reverted')) {
            return false
          }
          return failureCount < 3
        }
      }
    })

    useEffect(() => {
      if (result.error && staker) {
        if (result.error.message?.includes('returned no data') || result.error.message?.includes('reverted')) {
          console.log(`⏳ No unstake lock time for ${staker} - user has not initiated unstake`)
        } else {
          console.error('Failed to fetch unstake lock time:', result.error)
        }
      }
    }, [result.error, staker])

    return result
  }

  // 获取合约常量
  const getUnstakePeriod = () => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'UNSTAKE_PERIOD',
    })

    return result
  }

  const getStakeRewardRate = () => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'STAKE_REWARD_RATE',
    })

    return result
  }

  // 验证合约是否正确部署
  const verifyContract = () => {
    if (!contractAddress) {
      console.warn('⚠️ Contract address is not set')
      return false
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Verifying Chef contract at:', contractAddress)
      console.log('Expected functions: getTotalStakedAmount, getUserReward, getUserStakeInfo')
    }

    return true
  }

  // 获取总质押金额（新ABI版本）
  const getTotalStakedAmountNew = () => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'totalStakedAmount',
    })

    useEffect(() => {
      if (result.error) {
        console.error('Failed to fetch total staked amount (new):', result.error)
      }
    }, [result.error])

    return result
  }

  return {
    getTotalStakedAmount,
    getTotalStakedAmountNew,
    getUserStakeInfo,
    getUserReward,
    getUserUnstakeLockTime,
    getUnstakePeriod,
    getStakeRewardRate,
    verifyContract,
  }
}

// Chef contract write functions with toast notifications
export function useChefWriteContract() {
  const contractAddress = SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress as Address
  const { writeContract } = useWriteContract()

  const sendReward = async (domainId: number, message: string, attestation: string) => {
    try {
      toast.loading('Initiating reward transfer...', { id: 'send-reward-tx' })

      // According to ABI: sendReward(uint32 _domainId, bytes _message, bytes _attestation)
      const result = await writeContract({
        address: contractAddress,
        abi: CHEF_ABI,
        functionName: 'sendReward',
        args: [domainId, message as `0x${string}`, attestation as `0x${string}`],
        chainId: 84532 as SupportedChainId,
      })

      toast.success('Reward transfer initiated successfully!', { id: 'send-reward-tx' })
      return result
    } catch (error: unknown) {
      const contractError = error as ContractError
      const errorMessage = contractError?.message || 'Reward transfer failed'
      toast.error(errorMessage, { id: 'send-reward-tx' })
      throw contractError
    }
  }

  return {
    sendReward,
  }
}

export function useOFTContract(chainId: number) {
  const { writeContract } = useWriteContract()

  const getOFTAddress = (chainId: number): Address | null => {
    switch (chainId) {
      case SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id:
        // 在Ethereum Sepolia上，使用Omakase原生代币地址
        return SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.oftAddress as Address
      case SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id:
        // 在Arbitrum Sepolia上，使用OFT地址
        return SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.oftAddress as Address
      case SUPPORTED_CHAINS.BASE_SEPOLIA.id:
        // 在Base Sepolia上，使用OFT地址
        return SUPPORTED_CHAINS.BASE_SEPOLIA.oftAddress as Address
      default:
        return null
    }
  }

  // 根据链ID选择合适的ABI
  const getContractABI = (chainId: number) => {
    switch (chainId) {
      case SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.id:
        // Ethereum Sepolia使用原生ERC20合约ABI
        return NATIVE_ERC20_ABI
      case SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id:
      case SUPPORTED_CHAINS.BASE_SEPOLIA.id:
        // Arbitrum和Base Sepolia使用OFT合约ABI
        return OFT_ABI
      default:
        return OFT_ABI
    }
  }

  const contractAddress = getOFTAddress(chainId)
  const contractABI = getContractABI(chainId)

  const approve = async (spender: Address, amount: bigint) => {
    if (!contractAddress) {
      const error = 'Unsupported chain for token approval'
      toast.error(error)
      throw new Error(error)
    }

    try {
      toast.loading('Requesting token approval...', { id: 'approve-tx' })

      const result = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'approve',
        args: [spender, amount],
        chainId: chainId as SupportedChainId,
      })

      toast.success('Token approval submitted successfully!', { id: 'approve-tx' })
      return result
    } catch (error: unknown) {
      const contractError = error as ContractError
      const errorMessage = contractError?.message || 'Token approval failed'
      toast.error(errorMessage, { id: 'approve-tx' })
      throw contractError
    }
  }

  // Get token balance with error handling
  const getTokenBalance = (account: Address) => {
    const result = useReadContract({
      address: (contractAddress ?? undefined) as `0x${string}` | undefined,
      abi: contractABI,
      functionName: 'balanceOf',
      args: [account],
      query: {
        enabled: !!account && !!contractAddress,
      }
    })

    useEffect(() => {
      if (result.error && account && contractAddress) {
        console.error('Failed to fetch token balance for:', account, result.error)
      }
    }, [result.error, account, contractAddress])

    return result
  }

  // 获取token allowance - 修复为Hook
  const useTokenAllowance = (owner: Address, spender: Address) => {
    const result = useReadContract({
      address: (contractAddress ?? undefined) as `0x${string}` | undefined,
      abi: contractABI,
      functionName: 'allowance',
      args: [owner, spender],
      query: {
        enabled: !!owner && !!spender && !!contractAddress,
      }
    })

    return result
  }

  // 获取token信息 - 修复为Hook
  const useTokenInfo = () => {
    const name = useReadContract({
      address: (contractAddress ?? undefined) as `0x${string}` | undefined,
      abi: contractABI,
      functionName: 'name',
      query: {
        enabled: !!contractAddress,
      }
    })

    const symbol = useReadContract({
      address: (contractAddress ?? undefined) as `0x${string}` | undefined,
      abi: contractABI,
      functionName: 'symbol',
      query: {
        enabled: !!contractAddress,
      }
    })

    const decimals = useReadContract({
      address: (contractAddress ?? undefined) as `0x${string}` | undefined,
      abi: contractABI,
      functionName: 'decimals',
      query: {
        enabled: !!contractAddress,
      }
    })

    // 只有OFT合约才有sharedDecimals，原生ERC20没有
    const isOFTContract = chainId === SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id || chainId === SUPPORTED_CHAINS.BASE_SEPOLIA.id

    const sharedDecimals = useReadContract({
      address: (contractAddress ?? undefined) as `0x${string}` | undefined,
      abi: contractABI,
      functionName: 'sharedDecimals',
      query: {
        enabled: !!contractAddress && isOFTContract,
      }
    })

    return {
      name: name.data as string | undefined,
      symbol: symbol.data as string | undefined,
      decimals: decimals.data as number | undefined,
      sharedDecimals: isOFTContract ? (sharedDecimals.data as number | undefined) : (decimals.data as number | undefined),
      isLoading: name.isLoading || symbol.isLoading || decimals.isLoading || (isOFTContract && sharedDecimals.isLoading),
      error: name.error || symbol.error || decimals.error || (isOFTContract && sharedDecimals.error)
    }
  }

  return {
    address: contractAddress,
    approve,
    getTokenBalance,
    useTokenAllowance,
    useTokenInfo,
  }
}

// Helper function to validate chain ID
export function isSupportedChainId(chainId: number): chainId is SupportedChainId {
  return [11155111, 421614, 84532].includes(chainId)
}

// Alternative approach: Use chain validation with toast notification
export function useWaiterContractSafe(chainId: number) {
  if (!isSupportedChainId(chainId)) {
    const error = `Unsupported chain ID: ${chainId}. Please switch to a supported network.`
    toast.error(error)
    throw new Error(error)
  }

  return useWaiterContract(chainId)
}

// Utility function to show transaction success with explorer link
export function showTransactionSuccess(txHash: string, chainId: number) {
  const getExplorerUrl = (chainId: number) => {
    switch (chainId) {
      case 11155111: return 'https://sepolia.etherscan.io'
      case 421614: return 'https://sepolia.arbiscan.io'
      case 84532: return 'https://sepolia.basescan.org'
      default: return 'https://etherscan.io'
    }
  }

  const explorerUrl = `${getExplorerUrl(chainId)}/tx/${txHash}`

  toast.success(
    `Transaction confirmed! View on Explorer: ${explorerUrl}`,
    { duration: 5000 }
  )
}

// 合约事件监听Hook
export function useStakingEvents(_userAddress?: Address) {
  // 这里可以添加事件监听逻辑
  // 目前先返回空实现，后续可以扩展
  return {
    // TODO: 实现事件监听
    stakingEvents: [],
    isListening: false,
    startListening: () => { },
    stopListening: () => { },
  }
}
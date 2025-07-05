import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { Address } from 'viem'
import { WAITER_ABI, CHEF_ABI, OFT_ABI } from '@/lib/contracts'
import { SUPPORTED_CHAINS } from '@/lib/constants'
import toast from 'react-hot-toast'

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

  const contractAddress = getWaiterAddress(chainId)
  
  const { writeContract } = useWriteContract()

  const stake = async (amount: bigint) => {
    if (!contractAddress) {
      const error = 'Unsupported chain for staking'
      toast.error(error)
      throw new Error(error)
    }
    
    try {
      toast.loading('Initiating stake transaction...', { id: 'stake-tx' })
      
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'stake',
        args: [amount],
        chainId: chainId as SupportedChainId,
      })
      
      toast.success('Stake transaction submitted successfully!', { id: 'stake-tx' })
      return result
    } catch (error: any) {
      const errorMessage = error.message || 'Stake transaction failed'
      toast.error(errorMessage, { id: 'stake-tx' })
      throw error
    }
  }

  const unstake = async () => {
    if (!contractAddress) {
      const error = 'Unsupported chain for unstaking'
      toast.error(error)
      throw new Error(error)
    }
    
    try {
      toast.loading('Initiating unstake transaction...', { id: 'unstake-tx' })
      
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'unstake',
        args: [],
        chainId: chainId as SupportedChainId,
      })
      
      toast.success('Unstake transaction submitted successfully!', { id: 'unstake-tx' })
      return result
    } catch (error: any) {
      const errorMessage = error.message || 'Unstake transaction failed'
      toast.error(errorMessage, { id: 'unstake-tx' })
      throw error
    }
  }

  const withdraw = async () => {
    if (!contractAddress) {
      const error = 'Unsupported chain for withdrawal'
      toast.error(error)
      throw new Error(error)
    }
    
    try {
      toast.loading('Initiating withdraw transaction...', { id: 'withdraw-tx' })
      
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'withdraw',
        args: [],
        chainId: chainId as SupportedChainId,
      })
      
      toast.success('Withdraw transaction submitted successfully!', { id: 'withdraw-tx' })
      return result
    } catch (error: any) {
      const errorMessage = error.message || 'Withdraw transaction failed'
      toast.error(errorMessage, { id: 'withdraw-tx' })
      throw error
    }
  }

  const claim = async () => {
    if (!contractAddress) {
      const error = 'Unsupported chain for claiming rewards'
      toast.error(error)
      throw new Error(error)
    }
    
    try {
      toast.loading('Initiating claim transaction...', { id: 'claim-tx' })
      
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'claim',
        args: [],
        chainId: chainId as SupportedChainId,
      })
      
      toast.success('Claim transaction submitted successfully!', { id: 'claim-tx' })
      return result
    } catch (error: any) {
      const errorMessage = error.message || 'Claim transaction failed'
      toast.error(errorMessage, { id: 'claim-tx' })
      throw error
    }
  }

  const receiveReward = async (message: string, attestation: string) => {
    if (!contractAddress) {
      const error = 'Unsupported chain for receiving rewards'
      toast.error(error)
      throw new Error(error)
    }
    
    try {
      toast.loading('Processing reward reception...', { id: 'receive-reward-tx' })
      
      const result = await writeContract({
        address: contractAddress,
        abi: WAITER_ABI,
        functionName: 'receiveReward',
        args: [message, attestation],
        chainId: chainId as SupportedChainId,
      })
      
      toast.success('Reward reception processed successfully!', { id: 'receive-reward-tx' })
      return result
    } catch (error: any) {
      const errorMessage = error.message || 'Reward reception failed'
      toast.error(errorMessage, { id: 'receive-reward-tx' })
      throw error
    }
  }

  return {
    address: contractAddress,
    stake,
    unstake,
    withdraw,
    claim,
    receiveReward,
  }
}

export function useChefContract() {
  const contractAddress = SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress as Address
  
  return {
    address: contractAddress,
    abi: CHEF_ABI,
  }
}

// Chef contract read functions with error handling
export function useChefReadContract() {
  const contractAddress = SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress as Address

  const getTotalStakedAmount = () => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getTotalStakedAmount',
    })
    
    // Show error toast if read fails
    if (result.error) {
      toast.error('Failed to fetch total staked amount')
    }
    
    return result
  }

  const getStakedAmount = (staker: Address) => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getStakedAmount',
      args: [staker],
      query: {
        enabled: !!staker,
      }
    })
    
    // Show error toast if read fails
    if (result.error && staker) {
      toast.error('Failed to fetch your staked amount')
    }
    
    return result
  }

  const getUnstakePeriod = (staker: Address) => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getUnstakePeriod',
      args: [staker],
      query: {
        enabled: !!staker,
      }
    })
    
    // Show error toast if read fails
    if (result.error && staker) {
      toast.error('Failed to fetch unstake period')
    }
    
    return result
  }

  const getReward = (staker: Address) => {
    const result = useReadContract({
      address: contractAddress,
      abi: CHEF_ABI,
      functionName: 'getReward',
      args: [staker],
      query: {
        enabled: !!staker,
      }
    })
    
    // Show error toast if read fails
    if (result.error && staker) {
      toast.error('Failed to fetch your rewards')
    }
    
    return result
  }

  return {
    getTotalStakedAmount,
    getStakedAmount,
    getUnstakePeriod,
    getReward,
  }
}

// Chef contract write functions with toast notifications
export function useChefWriteContract() {
  const contractAddress = SUPPORTED_CHAINS.BASE_SEPOLIA.chefAddress as Address
  const { writeContract } = useWriteContract()

  const sendReward = async (chainId: bigint, message: string, attestation: string) => {
    try {
      toast.loading('Initiating reward transfer...', { id: 'send-reward-tx' })
      
      const result = await writeContract({
        address: contractAddress,
        abi: CHEF_ABI,
        functionName: 'sendReward',
        args: [chainId, message, attestation],
        chainId: 84532 as SupportedChainId,
      })
      
      toast.success('Reward transfer initiated successfully!', { id: 'send-reward-tx' })
      return result
    } catch (error: any) {
      const errorMessage = error.message || 'Reward transfer failed'
      toast.error(errorMessage, { id: 'send-reward-tx' })
      throw error
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
        return SUPPORTED_CHAINS.ETHEREUM_SEPOLIA.oftAddress as Address
      case SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.id:
        return SUPPORTED_CHAINS.ARBITRUM_SEPOLIA.oftAddress as Address
      case SUPPORTED_CHAINS.BASE_SEPOLIA.id:
        return SUPPORTED_CHAINS.BASE_SEPOLIA.oftAddress as Address
      default:
        return null
    }
  }

  const contractAddress = getOFTAddress(chainId)

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
        abi: OFT_ABI,
        functionName: 'approve',
        args: [spender, amount],
        chainId: chainId as SupportedChainId,
      })
      
      toast.success('Token approval submitted successfully!', { id: 'approve-tx' })
      return result
    } catch (error: any) {
      const errorMessage = error.message || 'Token approval failed'
      toast.error(errorMessage, { id: 'approve-tx' })
      throw error
    }
  }

  // Get token balance with error handling
  const getTokenBalance = (account: Address) => {
    const result = useReadContract({
      address: contractAddress || undefined, // Fix: convert null to undefined
      abi: OFT_ABI,
      functionName: 'balanceOf',
      args: [account],
      query: {
        enabled: !!account && !!contractAddress,
      }
    })
    
    // Show error toast if read fails
    if (result.error && account && contractAddress) {
      toast.error('Failed to fetch token balance')
    }
    
    return result
  }

  return {
    address: contractAddress,
    approve,
    getTokenBalance,
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
  
  // Fix: Use string message instead of JSX element
  toast.success(
    `Transaction confirmed! View on Explorer: ${explorerUrl}`,
    { duration: 5000 }
  )
}
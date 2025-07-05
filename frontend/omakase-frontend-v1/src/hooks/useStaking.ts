import { useState, useCallback } from 'react'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useWaiterContract, useChefReadContract, useOFTContract } from './useContract'
import toast from 'react-hot-toast'

export function useStaking() {
  const { address } = useAccount()
  const chainId = useChainId()
  const [isLoading, setIsLoading] = useState(false)

  const waiterContract = useWaiterContract(chainId || 0)
  const chefQueries = useChefReadContract()
  const oftContract = useOFTContract(chainId || 0)

  const { data: stakedAmount, refetch: refetchStakedAmount } = chefQueries.getStakedAmount(address ?? '0x0000000000000000000000000000000000000000')
  const { data: userRewards, refetch: refetchRewards } = chefQueries.getReward(address ?? '0x0000000000000000000000000000000000000000')
  const { data: unstakePeriod, refetch: refetchUnstakePeriod } = chefQueries.getUnstakePeriod(address ?? '0x0000000000000000000000000000000000000000')
  const { data: totalStaked } = chefQueries.getTotalStakedAmount()

  const stake = useCallback(async (amount: string) => {
    if (!waiterContract.address || !oftContract.address || !chainId) return
    setIsLoading(true)
    try {
      const amountWei = parseEther(amount)
      await oftContract.approve(waiterContract.address, amountWei)
      toast.success('Token approval successful')

      await waiterContract.stake(amountWei)
      toast.success('Stake successful!')

      await Promise.all([refetchStakedAmount(), refetchRewards()])
    } catch (error: any) {
      console.error('Stake failed:', error)
      toast.error(error.message || 'Stake failed')
    } finally {
      setIsLoading(false)
    }
  }, [waiterContract, oftContract, chainId, refetchStakedAmount, refetchRewards])

  const unstake = useCallback(async () => {
    if (!waiterContract.address || !chainId) return
    setIsLoading(true)
    try {
      await waiterContract.unstake()
      toast.success('Unstake successful! Please wait for the lock period to end before withdrawing')

      await Promise.all([refetchStakedAmount(), refetchUnstakePeriod()])
    } catch (error: any) {
      console.error('Unstake failed:', error)
      toast.error(error.message || 'Unstake failed')
    } finally {
      setIsLoading(false)
    }
  }, [waiterContract, chainId, refetchStakedAmount, refetchUnstakePeriod])

  const withdraw = useCallback(async () => {
    if (!waiterContract.address || !chainId) return
    setIsLoading(true)
    try {
      await waiterContract.withdraw()
      toast.success('Withdraw successful!')
      await Promise.all([refetchStakedAmount(), refetchUnstakePeriod()])
    } catch (error: any) {
      console.error('Withdraw failed:', error)
      toast.error(error.message || 'Withdraw failed')
    } finally {
      setIsLoading(false)
    }
  }, [waiterContract, chainId, refetchStakedAmount, refetchUnstakePeriod])

  const claimReward = useCallback(async () => {
    if (!waiterContract.address || !chainId || !address) return
    setIsLoading(true)
    try {
      await waiterContract.claim()
      toast.success('Reward claim successful!')
      await refetchRewards()
    } catch (error: any) {
      console.error('Claim reward failed:', error)
      toast.error(error.message || 'Claim reward failed')
    } finally {
      setIsLoading(false)
    }
  }, [waiterContract, chainId, address, refetchRewards])

  const { data: tokenBalance } = useReadContract({
    address: oftContract.address ? (oftContract.address as `0x${string}`) : undefined,
    abi: [
      {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!oftContract.address,
    }
  })

  const getTokenBalance = useCallback(() => {
    return tokenBalance ? formatEther(tokenBalance) : '0'
  }, [tokenBalance])

  const canWithdraw = useCallback(() => {
    return typeof unstakePeriod === 'bigint' && unstakePeriod > 0n && Date.now() / 1000 > Number(unstakePeriod)
  }, [unstakePeriod])

  const getStakingStatus = useCallback(() => {
    const staked = stakedAmount ? formatEther(stakedAmount as bigint) : '0'
    const rewards = userRewards ? formatEther(userRewards as bigint) : '0'
    const hasStaked = typeof stakedAmount === 'bigint' && stakedAmount > 0n
    const hasUnstaked = typeof unstakePeriod === 'bigint' && unstakePeriod > 0n

    return {
      stakedAmount: staked,
      rewards,
      hasStaked,
      hasUnstaked,
      canWithdraw: canWithdraw(),
      unstakePeriod: unstakePeriod ? new Date(Number(unstakePeriod) * 1000) : null,
      totalStaked: totalStaked ? formatEther(totalStaked as bigint) : '0'
    }
  }, [stakedAmount, userRewards, unstakePeriod, totalStaked, canWithdraw])

  return {
    isLoading,
    stake,
    unstake,
    withdraw,
    claimReward,
    getTokenBalance,
    getStakingStatus,
    refetch: () => Promise.all([
      refetchStakedAmount(),
      refetchRewards(),
      refetchUnstakePeriod()
    ]),
  }
}
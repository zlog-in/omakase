'use client'

import { useState } from 'react'
import { useStaking } from '@/hooks/useStaking'
import { useAccount, useChainId } from 'wagmi'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function StakeForm() {
  const [amount, setAmount] = useState('')
  const { address } = useAccount()
  const chainId = useChainId()
  const { stake, isLoading, getTokenBalance } = useStaking()
  const [balance, setBalance] = useState('0')

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return
    }
    await stake(amount)
    setAmount('')
  }

  const loadBalance = async () => {
    const bal = await getTokenBalance()
    setBalance(bal)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Stake Tokens</CardTitle>
        <CardDescription>
          Stake your OFT tokens to Hub chain to earn USDC rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Stake Amount</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter stake amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Current Balance: {balance} OFT</span>
            <button
              onClick={loadBalance}
              className="text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>
        </div>
        
        <Button 
          onClick={handleStake}
          disabled={isLoading || !address || !amount}
          className="w-full"
        >
          {isLoading ? 'Staking...' : 'Stake'}
        </Button>
        
        {!address && (
          <p className="text-sm text-red-600 text-center">
            Please connect your wallet first
          </p>
        )}
      </CardContent>
    </Card>
  )
}
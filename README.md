# ⛩️ Omakase Protocol

A cross-chain staking protocol MVP built on LayerZero and Circle CCTP, supporting Ethereum Sepolia, Base Sepolia, and Arbitrum Sepolia testnets with Base Sepolia serving as our hub chain.

## 🌟 Features

- **Cross-Chain Staking**: Stake tokens across Ethereum Sepolia, Base Sepolia, and Arbitrum Sepolia
- **USDC Rewards**: Unified reward system using Circle's CCTP for cross-chain USDC distribution
- **Gas-Free Experience**: Pay transaction fees in USDC using Circle's Gas Master
- **Hub-Chain Architecture**: All core staking logic, reward calculations, and cross-chain message orchestration on Base Sepolia
- **Flexible Claiming**: Claim rewards on any supported chain, regardless of staking origin

## 🏗️ Architecture

### Supported Networks
- **Ethereum Sepolia** - Staking chain
- **Base Sepolia** - Hub chain for centralized processing
- **Arbitrum Sepolia** - Staking chain

### Smart Contract Architecture

The project consists of three main contract groups:

#### 1. OFT-related Contracts
- Native ERC20 contracts deployed on Ethereum Sepolia
- Corresponding Adapter contracts
- OFT contracts distributed across Ethereum Sepolia, Arbitrum Sepolia, and Base Sepolia

#### 2. Staking-related Contracts
- **Waiter Contracts**: Staking EntryPoint contracts deployed on Ethereum Sepolia and Arbitrum Sepolia
- **Chef Contract**: Staking Pool contract deployed on Base Sepolia (hub chain)

#### 3. USDC-related Contracts
- Pre-deployed by Circle
- Provide CCTP cross-chain services for staking rewards distribution

## 🔄 Staking Business Flows

### 1. Stake Flow
Users call the Stake interface on Waiter contracts through the frontend, sending staking OFT tokens to the hub chain (Base Sepolia) with an attached cross-chain StakeMessage to the Chef contract. This triggers token locking and begins reward calculation for the staking position (no fixed staking periods).

### 2. Unstake Flow
Users call the Unstake interface on Waiter contracts, sending UnstakeMessage cross-chain to the Chef contract on the hub chain. This triggers a fixed withdrawal lock period (7 days in production, 30-60 seconds for demo purposes) while the Chef contract stops calculating rewards.

### 3. Withdraw Flow
After the withdrawal lock period expires, users can call the Withdraw interface on Waiter contracts, sending WithdrawMessage cross-chain to the Chef contract. This triggers the Chef contract's ABA-Flow to return the previously staked OFT tokens to the user.

### 4. Claim Reward Flow
Users call the ClaimReward interface on Waiter contracts, sending ClaimRewardMessage to the Chef contract on the hub chain. The Chef contract triggers a BurnUSDC Event, burning USDC from the hub chain's USDC Reserve allocated for that staking position's rewards. Through the USDC contract's CCTP functionality, user USDC rewards are minted to the user's wallet address on the chain where they submitted the ClaimReward request (doesn't need to be the same chain where they initiated staking).

## 🛠️ Tech Stack

### Frontend
- **Next.js** - Hosted on Vercel
- **Web3.js/Ethers.js** - Contract interaction
- **RainbowKit/ThirdWeb** - Wallet connection suite

### Backend
- **Node.js**

### Smart Contracts
- **Hardhat** - Smart contract development framework
- **Foundry** - Test script development
- **LayerZero SDK** - OFT contract development

## 🔗 Sponsor Technologies

### LayerZero
- **OFT Standard and SDK**: Cross-chain token standard
- **Message Compose**: Cross-chain staking unlock and reward distribution infrastructure
- **Cross-Chain Messaging**: Secure message passing between testnets

### Circle
- **CCTP**: Cross-chain transfer protocol for USDC staking rewards
- **Gas Master**: Allow users to pay gas fees in USDC
- **USDC Infrastructure**: Staking rewards in Circle's USDC

### Base Sepolia
- **Hub Chain**: All message processing unified on Base Sepolia
- **Centralized Processing**: Efficient cross-chain operations

### Future Integration
- **1inch**: Cross-chain swap integration as a convenient channel for users to exchange staking tokens (if time and resources permit)

## 📊 Demo Features

- **Testnet-Optimized**: Designed for testnet environments with shortened withdrawal periods for demonstration
- **Cross-Chain Synchronization**: LayerZero ensures reliable cross-chain operations
- **USDC-Centric Rewards**: Unified reward system across all supported testnets
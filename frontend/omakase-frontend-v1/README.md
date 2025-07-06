# Omakase Protocol Frontend

A modern React-based frontend for the Omakase cross-chain staking protocol, built with Next.js 14, TypeScript, and Tailwind CSS. This interface enables seamless staking operations across Ethereum Sepolia, Base Sepolia, and Arbitrum Sepolia testnets using LayerZero and Circle CCTP technologies.

## 🌟 Project Overview

Omakase Protocol is an MVP demonstration of a cross-chain staking protocol that leverages LayerZero's OFT (Omnichain Fungible Token) standard and Circle's Cross-Chain Transfer Protocol (CCTP) to enable unified staking experiences across multiple blockchain networks. The protocol uses Base Sepolia as its hub chain for centralized processing while supporting staking operations on Ethereum Sepolia and Arbitrum Sepolia.

## 🏗️ Architecture

### Core Technologies

- **LayerZero Integration**: 
  - OFT (Omnichain Fungible Token) Standard for cross-chain token transfers
  - Message Compose for reliable cross-chain communication
  - Secure message passing between testnets for staking operations

- **Circle CCTP & Gas Master**:
  - USDC reward distribution across all supported testnets
  - Gas Master integration for USDC-based transaction fees
  - Unified reward system regardless of staking origin chain

- **Hub-Chain Architecture**:
  - Base Sepolia serves as the central hub for all staking logic
  - Cross-chain state management across all supported networks
  - Efficient reward calculations and message orchestration

## 🚀 Features

### Multi-Chain Staking
- **Supported Networks**: Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia
- **Flexible Staking**: No fixed staking periods, stake and unstake anytime
- **Cross-Chain Rewards**: Claim USDC rewards on any supported network

### User Experience
- **Real-Time Updates**: Live reward calculations and balance updates
- **Network Switching**: Seamless switching between supported testnets
- **Responsive Design**: Mobile-first approach with modern UI components
- **Transaction Tracking**: LayerZero Scan integration for cross-chain message monitoring

### Staking Operations
- **Stake**: Lock OMA tokens to earn continuous USDC rewards
- **Unstake**: Initiate withdrawal with configurable lock period (15 seconds for demo)
- **Withdraw**: Retrieve staked tokens after lock period expires
- **Claim Rewards**: Collect accumulated USDC rewards on any supported chain
- **Cancel Unstake**: Option to cancel unstake requests by staking additional tokens

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 14**: App Router with React Server Components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling

### Blockchain Integration
- **Wagmi v2**: React hooks for Ethereum interactions
- **Viem**: TypeScript interface for Ethereum
- **RainbowKit**: Wallet connection and management
- **React Query**: Data fetching and caching for blockchain data

### UI Components
- **Radix UI**: Headless component primitives
- **Lucide React**: Beautiful SVG icons
- **React Hot Toast**: Toast notifications
- **Custom Components**: Purpose-built UI components for staking operations

### State Management
- **React Hooks**: Custom hooks for staking operations and contract interactions
- **Wagmi State**: Blockchain state management and caching
- **Local State**: Component-level state for UI interactions

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Ethereum wallet
- Access to supported testnets:
  - Ethereum Sepolia
  - Base Sepolia  
  - Arbitrum Sepolia

## ⚡ Getting Started

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd omakase-frontend-v1

# Install dependencies
npm install
# or
yarn install

# Set up environment variables
cp .env.example .env.local
```

### Environment Configuration

Create a `.env.local` file with the following variables:

```bash
# RPC URLs
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=your_ethereum_sepolia_rpc
NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=your_arbitrum_sepolia_rpc  
NEXT_PUBLIC_BASE_SEPOLIA_RPC=your_base_sepolia_rpc

# Contract Addresses
NEXT_PUBLIC_ETHEREUM_SEPOLIA_WAITER_ADDRESS=your_waiter_contract_address
NEXT_PUBLIC_ARBITRUM_SEPOLIA_WAITER_ADDRESS=your_waiter_contract_address
NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS=your_chef_contract_address
```

### Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Production Build

```bash
# Build for production
npm run build
# or  
yarn build

# Start production server
npm start
# or
yarn start
```

## 🔧 Contract Addresses

The frontend interacts with the following smart contracts:

### Ethereum Sepolia (Source Chain)
- **Omakase Token (ERC20)**: `0x2dA943A5E008b9A85aA0E80F0d7d8d53a4945b2D` - Native token
- **LayerZero Adapter**: `0x5132f64f01140C4EfCdEbfcFe769c69E023cd694` - Cross-chain bridge adapter
- **Waiter Contract**: `0xCccBc8e303E254c854bC132A5c9e4d477b6288c8` - Cross-chain message handler

### Arbitrum Sepolia (Destination Chain)
- **Omakase OFT**: `0x3b6Be820c586B7235e19c7956e9408879A0F6065` - LayerZero OFT token
- **Waiter Contract**: `0xCccBc8e303E254c854bC132A5c9e4d477b6288c8` - Cross-chain message handler

### Base Sepolia (Hub Chain)
- **Omakase OFT**: `0x3b6Be820c586B7235e19c7956e9408879A0F6065` - LayerZero OFT token
- **Chef Contract**: `0xcaa8340AA4a760cF83D9e712597AD045fA1b3C50` - **Main staking logic contract**

## 🏗️ Architecture Overview

### Contract Deployment Strategy:
- **Ethereum Sepolia**: Native ERC20 token + Waiter for cross-chain operations
- **Arbitrum Sepolia**: OFT token + Waiter for cross-chain operations  
- **Base Sepolia**: OFT token + Chef contract (central staking hub)

### Frontend Query Logic:
- **Staking Data**: Always queries Chef contract on Base Sepolia (regardless of current chain)
- **Token Balances**: Queries native ERC20 on Ethereum Sepolia, OFT contracts on other chains
- **Cross-chain Operations**: Uses appropriate Waiter contracts on source chains

### LayerZero Endpoint IDs
- Ethereum Sepolia: `40161`
- Arbitrum Sepolia: `40231`
- Base Sepolia: `40245` (Hub Chain)

## 📱 Key Components

### Core Hooks

- **`useStaking`** (`src/hooks/useStaking.ts`): Main staking operations and state management
- **`useContract`** (`src/hooks/useContract.ts`): Contract interaction utilities
- **`useUnstakeCountdown`**: Real-time countdown for unstake lock periods
- **`useRealtimeRewards`**: Live reward calculations

### UI Components

- **`StakeForm`** (`src/components/stakeForm.tsx`): Staking interface with amount input and validation
- **`StakingDashboard`** (`src/components/stakingDashboard.tsx`): Current position and reward display
- **`NetworkSelector`** (`src/components/networkSelector.tsx`): Network switching functionality
- **`LayerZeroScanButton`** (`src/components/LayerZeroScanButton.tsx`): Cross-chain message tracking

### Utility Libraries

- **Token Utils** (`src/lib/tokenUtils.ts`): Token amount formatting and parsing
- **Constants** (`src/lib/constants.ts`): Network configurations and staking parameters
- **Error Handling** (`src/lib/error.ts`): Comprehensive error management

## 🔄 Cross-Chain Flow

### Staking Process
1. User connects wallet and selects network
2. Approves OMA token spending (if needed)
3. Calls stake function on Waiter contract
4. LayerZero message sent to Chef contract on Base Sepolia
5. Tokens locked and reward calculation begins

### Unstaking Process
1. User initiates unstake on any supported network
2. Unstake message sent to Chef contract via LayerZero
3. 15-second lock period begins (configurable)
4. Reward calculation stops for the position

### Reward Claiming
1. User claims rewards on any supported network
2. Claim message sent to Chef contract
3. USDC rewards distributed via Circle CCTP
4. USDC minted to user's wallet on claim network

## 🎯 Staking Features

### Flexible Operations
- **No Lock Periods**: Stake and unstake anytime
- **Cross-Chain Claims**: Claim rewards on any supported network
- **Unstake Cancellation**: Cancel unstake requests by staking additional tokens
- **Real-Time Rewards**: Continuous reward calculation (100 BP/second)

### Reward System
- **USDC Rewards**: All rewards paid in stable USDC
- **APR Calculation**: Dynamic APR based on current staking parameters
- **Compound Growth**: Rewards automatically compound over time
- **Instant Claims**: Claim accumulated rewards without affecting stake

## 🔍 Monitoring & Debug

### LayerZero Integration
- **Cross-Chain Messages**: View all LayerZero messages via integrated scanner
- **Transaction Tracking**: Real-time status updates for cross-chain operations
- **Error Handling**: Comprehensive error messages and recovery options

### Development Tools
- **Console Logging**: Detailed logs for debugging contract interactions
- **Type Safety**: Full TypeScript coverage for better development experience
- **Hot Reload**: Instant updates during development

## 🌐 Network Support

### Supported Testnets
- **Ethereum Sepolia**: Native OMA token with LayerZero adapter
- **Arbitrum Sepolia**: OFT implementation for cross-chain functionality  
- **Base Sepolia**: Hub chain with central Chef contract

### Network Switching
- Automatic network detection and switching prompts
- Network-specific token information and contract addresses
- Cross-chain operation support regardless of current network

## 🔐 Security Features

### Smart Contract Integration
- **Type-Safe Contracts**: Full TypeScript interfaces for all contract interactions
- **Error Boundaries**: Comprehensive error handling for failed transactions
- **Transaction Validation**: Pre-flight checks for all operations

### User Safety
- **Amount Validation**: Input validation for all staking amounts
- **Balance Checks**: Automatic balance verification before operations
- **Confirmation Dialogs**: User confirmation for critical operations
- **Gas Estimation**: Automatic gas estimation for transactions

## 🚀 Future Enhancements

### Planned Features
- **1inch Integration**: Direct token swapping within the interface
- **Advanced Analytics**: Detailed staking history and performance metrics
- **Mobile App**: React Native application for mobile users
- **Governance**: Token holder voting and protocol governance

### Technical Improvements
- **Performance Optimization**: Advanced caching and state management
- **Additional Networks**: Support for more blockchain networks
- **Enhanced UI**: Advanced charting and visualization components

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Wagmi Documentation](https://wagmi.sh/) - React hooks for Ethereum
- [LayerZero Docs](https://layerzero.gitbook.io/) - Cross-chain infrastructure
- [Circle CCTP](https://developers.circle.com/stablecoins/docs) - Cross-chain USDC transfers

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Step-by-Step Vercel Deployment Guide

#### Prerequisites
- A GitHub, GitLab, or Bitbucket account with your repository
- A Vercel account (free tier available at [vercel.com](https://vercel.com))
- Your environment variables ready

#### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Import Your Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize Vercel to access your repositories
   - Find and select your Omakase frontend repository

2. **Configure Your Project**
   - **Framework Preset**: Vercel will auto-detect Next.js
   - **Root Directory**: Select `frontend/omakase-frontend-v1` if your repo includes backend
   - **Build Command**: Leave as default (`next build`) or use `npm run build`
   - **Output Directory**: Leave as default (`.next`)
   - **Install Command**: Leave as default or specify `npm install`

3. **Set Environment Variables**
   - Click on "Environment Variables"
   - Add each variable from your `.env.local` file:
     ```
     NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=your_ethereum_sepolia_rpc
     NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC=your_arbitrum_sepolia_rpc
     NEXT_PUBLIC_BASE_SEPOLIA_RPC=your_base_sepolia_rpc
     NEXT_PUBLIC_ETHEREUM_SEPOLIA_WAITER_ADDRESS=your_waiter_address
     NEXT_PUBLIC_ARBITRUM_SEPOLIA_WAITER_ADDRESS=your_waiter_address
     NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS=your_chef_address
     ```
   - Ensure all variables starting with `NEXT_PUBLIC_` are added
   - You can add variables for Production, Preview, and Development environments

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Monitor the build logs for any errors
   - Once complete, you'll receive a production URL (e.g., `your-app.vercel.app`)

#### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   # or
   yarn global add vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Directory**
   ```bash
   cd frontend/omakase-frontend-v1
   vercel
   ```

4. **Follow the Prompts**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N` (for first deployment)
   - Project name: Enter your desired name
   - Directory: `./` (current directory)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Development Command: `npm run dev`

5. **Set Environment Variables**
   ```bash
   # Set each environment variable
   vercel env add NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC
   vercel env add NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC
   vercel env add NEXT_PUBLIC_BASE_SEPOLIA_RPC
   vercel env add NEXT_PUBLIC_ETHEREUM_SEPOLIA_WAITER_ADDRESS
   vercel env add NEXT_PUBLIC_ARBITRUM_SEPOLIA_WAITER_ADDRESS
   vercel env add NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Post-Deployment Configuration

1. **Custom Domain (Optional)**
   - Navigate to your project settings on Vercel Dashboard
   - Go to "Domains" section
   - Add your custom domain (e.g., `app.omakase.io`)
   - Follow DNS configuration instructions
   - Vercel automatically provisions SSL certificates

2. **Environment-Specific Deployments**
   - **Production**: Automatically deployed from main/master branch
   - **Preview**: Automatically deployed for each pull request
   - **Development**: Can be set up for specific branches

3. **Build & Function Settings**
   - **Node.js Version**: Ensure it matches your local version (18.x recommended)
   - **Build Cache**: Enabled by default for faster subsequent deployments
   - **Function Region**: Select closest to your users (default: Washington, D.C., USA)

#### Deployment Checklist

- [ ] All environment variables are correctly set in Vercel
- [ ] RPC endpoints are valid and have sufficient rate limits
- [ ] Contract addresses are correct for each network
- [ ] Build completes without errors
- [ ] Application loads correctly on the deployment URL
- [ ] Wallet connection works properly
- [ ] Network switching functions correctly
- [ ] Staking operations work on all supported networks

#### Troubleshooting Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility
   - Check for TypeScript errors: `npm run type-check`

2. **Environment Variables Not Working**
   - Ensure all variables start with `NEXT_PUBLIC_` for client-side access
   - Redeploy after adding/changing environment variables
   - Check variable names match exactly (case-sensitive)

3. **404 Errors on Routes**
   - Verify `next.config.js` settings
   - Ensure dynamic routes are properly configured
   - Check for case sensitivity in file names

4. **Performance Issues**
   - Enable Vercel Analytics (free tier available)
   - Optimize images using Next.js Image component
   - Review bundle size with `npm run analyze`

5. **CORS or API Issues**
   - Add allowed origins to your RPC providers
   - Configure headers in `next.config.js` if needed
   - Use Vercel Edge Functions for API routes

#### Monitoring & Analytics

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor Core Web Vitals
   - Track user interactions and performance

2. **Runtime Logs**
   - Access via Vercel Dashboard → Functions tab
   - Use for debugging production issues
   - Set up log drains for external monitoring

3. **Speed Insights**
   - Automatic performance monitoring
   - Real user metrics (RUM)
   - Performance recommendations

#### Continuous Deployment

1. **GitHub Integration**
   ```yaml
   # .github/workflows/preview.yml
   name: Vercel Preview Deployment
   env:
     VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
     VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
   on:
     push:
       branches-ignore:
         - main
   jobs:
     Deploy-Preview:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Install Vercel CLI
           run: npm install --global vercel@latest
         - name: Pull Vercel Environment
           run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
         - name: Build Project
           run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
         - name: Deploy to Vercel
           run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
   ```

2. **Production Deployment Protection**
   - Enable "Protection" in Vercel project settings
   - Require approval for production deployments
   - Set up deployment notifications

#### Best Practices

1. **Security**
   - Never commit `.env.local` files
   - Use Vercel's encrypted environment variables
   - Rotate API keys regularly
   - Enable 2FA on your Vercel account

2. **Performance**
   - Use ISR (Incremental Static Regeneration) where applicable
   - Optimize images and assets
   - Enable compression
   - Use Edge Runtime for API routes when possible

3. **Scalability**
   - Monitor usage in Vercel dashboard
   - Set up alerts for high traffic
   - Consider Vercel Pro for higher limits
   - Use caching strategies effectively

For more detailed information, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) and [Vercel documentation](https://vercel.com/docs).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LayerZero Labs**: For the innovative cross-chain infrastructure
- **Circle**: For CCTP and Gas Master technologies
- **Base**: For efficient hub chain infrastructure
- **Open Source Community**: For the amazing tools and libraries

---

**Built with ❤️ by the Omakase Team in Cannes**

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/zlog-in/omakase) or contact our team.
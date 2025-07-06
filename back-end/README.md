# Omakase Backend

A Node.js backend service for monitoring and processing USDC cross-chain transfers using Circle's CCTP (Cross-Chain Transfer Protocol).

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Ethereum wallet with private key for transaction signing

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Authentication
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# Server Configuration (optional)
PORT=3000
NODE_ENV=development
```

## Project Structure

```
back-end/
├── src/
│   ├── config.js           # Configuration constants and contract addresses
│   ├── monitor.js          # Event monitoring and automatic minting
│   └── transfer.js         # Manual USDC transfer functions
├── package.json            # Project dependencies and scripts
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Available Scripts

- `npm start` - Start the event monitor in production mode
- `npm run dev` - Start the event monitor in development mode with auto-reload
- `npm run transfer` - Run manual USDC transfer between networks
- `npm test` - Run tests (not configured yet)

## Features

### 🔍 **Event Monitoring (`monitor.js`)**

- Monitors DepositForBurn events on specified networks
- Automatically retrieves Circle attestations
- Performs automatic minting on destination networks
- Supports multiple networks: Sepolia, Base Sepolia, Arbitrum Sepolia

### 💸 **Manual Transfers (`transfer.js`)**

- Manual USDC approval and burn operations
- Cross-chain transfers between supported networks
- Configurable transfer amounts and fees

### ⚙️ **Configuration (`config.js`)**

- Centralized configuration for all networks
- Contract addresses and domain mappings
- RPC endpoints and API configurations

## Supported Networks

- **Ethereum Sepolia** (Domain ID: 0)
- **Base Sepolia** (Domain ID: 6)
- **Arbitrum Sepolia** (Domain ID: 3)

## Dependencies

### Core Dependencies

- **ethers** - Ethereum library for blockchain interactions
- **viem** - TypeScript interface for Ethereum
- **axios** - HTTP client for API requests
- **dotenv** - Environment variable management

### Development Dependencies

- **nodemon** - Auto-restart server during development

## Usage Examples

### Start Event Monitoring

```bash
# Monitor Sepolia network for DepositForBurn events
npm start
```

### Manual Transfer

```bash
# Transfer USDC from Sepolia to Base Sepolia
npm run transfer
```

## Configuration

The application uses a centralized configuration system in `src/config.js`:

- **RPC_URL**: Network RPC endpoints
- **USDC_ADDRESS**: USDC token addresses by network
- **DOMAIN_ID**: Domain ID mappings for networks
- **ABI**: Contract ABIs for event monitoring

## Security Notes

- ⚠️ **Never commit your private key to version control**
- 🔒 Store private keys securely in environment variables
- 🛡️ Use test networks for development and testing
- 📝 Keep your `.env` file in `.gitignore`

## Deployment

For cloud deployment, recommended platforms:

- **Railway** - Simple deployment with free tier
- **Render** - Easy setup with automatic deployments
- **Heroku** - Traditional choice with good documentation

### Deployment Requirements

- Set `PRIVATE_KEY` environment variable
- Set `NODE_ENV=production`
- Ensure 24/7 uptime for monitoring

## License

MIT

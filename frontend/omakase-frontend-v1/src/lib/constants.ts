export const SUPPORTED_CHAINS = {
  ETHEREUM_SEPOLIA: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC,
    waiterAddress: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_WAITER_ADDRESS,
    oftAddress: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_OFT_ADDRESS,
    layerZeroEndpointId: 40161,
  },
  ARBITRUM_SEPOLIA: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC,
    waiterAddress: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_WAITER_ADDRESS,
    oftAddress: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_OFT_ADDRESS,
    layerZeroEndpointId: 40231,
  },
  BASE_SEPOLIA: {
    id: 84532,
    name: 'Base Sepolia',
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC,
    chefAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS,
    oftAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_OFT_ADDRESS,
    layerZeroEndpointId: 40245,
  },
};

export const HUB_CHAIN_ID = SUPPORTED_CHAINS.BASE_SEPOLIA.id;

// Staking constants
export const STAKING_CONSTANTS = {
  UNSTAKE_PERIOD: 15, // 15 seconds as defined in contract
  STAKE_REWARD_RATE: 100, // 100 BP per second
  USDC_DECIMALS: 6, // USDC has 6 decimals
  REWARD_DISPLAY_DECIMALS: 4, // Display precision for rewards
};

// Staking status
export const STAKING_STATUS = {
  NOT_STAKED: 'not_staked',
  ACTIVE: 'active',
  UNSTAKED: 'unstaked',
  WITHDRAWN: 'withdrawn'
} as const;

// Time Utils
export const TIME_UTILS = {
  SECONDS_PER_MINUTE: 60,
  SECONDS_PER_HOUR: 3600,
  SECONDS_PER_DAY: 86400,
  MS_PER_SECOND: 1000,
};
export const SUPPORTED_CHAINS = {
    ETHEREUM_SEPOLIA: {
        id: 11155111,
        name: 'Ethereum Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC,
        waiterAddress: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_WAITER_ADDRESS,
        // Ethereum Sepolia: 原生 ERC20 Token (Omakase)
        oftAddress: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_OFT_ADDRESS, // Omakase (原生ERC20代币)
        adapterAddress: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_ADAPTER_ADDRESS, // Adapter合约
        layerZeroEndpointId: 40161,
    },
    ARBITRUM_SEPOLIA: {
        id: 421614,
        name: 'Arbitrum Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC,
        waiterAddress: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_WAITER_ADDRESS,
        // Arbitrum Sepolia: OFT 合约
        oftAddress: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_OFT_ADDRESS, // OFT合约
        layerZeroEndpointId: 40231,
    },
    BASE_SEPOLIA: {
        id: 84532,
        name: 'Base Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC,
        chefAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS, // Chef合约 (质押逻辑主合约)
        // Base Sepolia: OFT 合约
        oftAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_OFT_ADDRESS, // OFT合约
        layerZeroEndpointId: 40245,
    },
};

export const HUB_CHAIN_ID = SUPPORTED_CHAINS.BASE_SEPOLIA.id;

// 更新质押常量 - 匹配合约实现
export const STAKING_CONSTANTS = {
    UNSTAKE_PERIOD: 15, // 15 seconds as defined in contract
    STAKE_REWARD_RATE: 1, // 1 BP per second (correct rate from contract)
    USDC_DECIMALS: 6, // USDC has 6 decimals
    REWARD_DISPLAY_DECIMALS: 4, // Display precision for rewards
};

// 合约地址映射 - 便于访问
export const CONTRACT_ADDRESSES = {
    ETHEREUM_SEPOLIA: {
        OMAKASE: '0x2dA943A5E008b9A85aA0E80F0d7d8d53a4945b2D',
        ADAPTER: '0x5132f64f01140C4EfCdEbfcFe769c69E023cd694',
        WAITER: '0xCccBc8e303E254c854bC132A5c9e4d477b6288c8',
    },
    ARBITRUM_SEPOLIA: {
        OFT: '0x3b6Be820c586B7235e19c7956e9408879A0F6065',
        WAITER: '0xCccBc8e303E254c854bC132A5c9e4d477b6288c8',
    },
    BASE_SEPOLIA: {
        OFT: '0x3b6Be820c586B7235e19c7956e9408879A0F6065',
        CHEF: '0xcaa8340AA4a760cF83D9e712597AD045fA1b3C50',
    },
} as const;

// 质押状态枚举
export const STAKING_STATUS = {
    NOT_STAKED: 'not_staked',
    ACTIVE: 'active',
    UNSTAKED: 'unstaked',
    WITHDRAWN: 'withdrawn'
} as const;

// 时间工具
export const TIME_UTILS = {
    SECONDS_PER_MINUTE: 60,
    SECONDS_PER_HOUR: 3600,
    SECONDS_PER_DAY: 86400,
    MS_PER_SECOND: 1000,
};
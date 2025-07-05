export const SUPPORTED_CHAINS = {
    ETHEREUM_SEPOLIA: {
        id: 11155111,
        name: 'Ethereum Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC,
        waiterAddress: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_WAITER_ADDRESS,
        // 使用环境变量配置的合约地址
        oftAddress: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_OFT_ADDRESS, // Omakase (原生代币)
        adapterAddress: '0x5132f64f01140C4EfCdEbfcFe769c69E023cd694', // Adapter合约
        layerZeroEndpointId: 40161,
    },
    ARBITRUM_SEPOLIA: {
        id: 421614,
        name: 'Arbitrum Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_RPC,
        waiterAddress: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_WAITER_ADDRESS,
        // 使用环境变量配置的OFT地址
        oftAddress: process.env.NEXT_PUBLIC_ARBITRUM_SEPOLIA_OFT_ADDRESS, // OFT合约
        layerZeroEndpointId: 40231,
    },
    BASE_SEPOLIA: {
        id: 84532,
        name: 'Base Sepolia',
        rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC,
        chefAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHEF_ADDRESS,
        // 使用环境变量配置的OFT地址
        oftAddress: process.env.NEXT_PUBLIC_BASE_SEPOLIA_OFT_ADDRESS, // OFT合约
        layerZeroEndpointId: 40245,
    },
};

export const HUB_CHAIN_ID = SUPPORTED_CHAINS.BASE_SEPOLIA.id;

// 更新质押常量 - 匹配合约实现
export const STAKING_CONSTANTS = {
    UNSTAKE_PERIOD: 15, // 15 seconds as defined in contract
    STAKE_REWARD_RATE: 100, // 100 BP per second
    USDC_DECIMALS: 6, // USDC has 6 decimals
    REWARD_DISPLAY_DECIMALS: 4, // Display precision for rewards
};

// 合约地址映射 - 便于访问
export const CONTRACT_ADDRESSES = {
    ETHEREUM_SEPOLIA: {
        OMAKASE: '0x2dA943A5E008b9A85aA0E80F0d7d8d53a4945b2D',
        ADAPTER: '0x5132f64f01140C4EfCdEbfcFe769c69E023cd694',
    },
    ARBITRUM_SEPOLIA: {
        OFT: '0x3b6Be820c586B7235e19c7956e9408879A0F6065',
    },
    BASE_SEPOLIA: {
        OFT: '0x3b6Be820c586B7235e19c7956e9408879A0F6065',
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
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
export const WITHDRAW_LOCK_PERIOD = 30; // 30s waiting time after unstaking to withdraw for demo
import { MainnetV2EndpointId, TestnetV2EndpointId, Chain, ENVIRONMENT} from '@layerzerolabs/lz-definitions'

export type address = string
export type name = string
export type network = string
export type env = string
export type dvns = address[]

export interface OFTData {
    [key: env]: {
        [key: network]: {
            [key: name]: address
        }
    }
}
interface LZData {
    [key: string]: string;

}
export interface LZConfig {
    [key: network]: LZData
}

export type EnvType = 'testnet'
export type TestNetworkType = 'sepolia' | 'arbitrumsepolia' | 'basesepolia'
export type ContractType = 'Omakase' | 'Adapter' | 'OFT' | 'Waiter' | 'Chef'

export const TEST_NETWORKS = ['sepolia', 'arbitrumsepolia', 'basesepolia'] 

export const BACK_END_ADDRESS = '0x8EAaa6731dc142CBb8Fb89E5Cc0e8c73F77BB685'

export const CCTP_ADDRESS = {
    'sepolia': {
        'domain': 0,
        'TokenMessager': '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
        'MessageTransmitter': '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
        'USDC': '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238'
    },
    'arbitrumsepolia': {
        'domain': 3,
        'TokenMessager': '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
        'MessageTransmitter': '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
        'USDC': '0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d'
    },
    'basesepolia': {
        'domain': 6,
        'TokenMessager': '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA',
        'MessageTransmitter': '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275',
        'USDC': '0x036cbd53842c5426634e7929541ec2318f3dcf7e'
    }
}


export const LZ_OPTIONS = {

        1: {
            "gas": 200000,
            "value": 0
        },
        2: {
            "gas": 500000,
            "value": 0
        }
    
}


export const RPC: { [key: network]: string } = {
    // testnets
    "sepolia": "https://ethereum-sepolia.rpc.subquery.network/public",
    "arbitrumsepolia": "https://arbitrum-sepolia.gateway.tenderly.co",
    "basesepolia": "https://base-sepolia.drpc.org",
}

export function getRPC(network: network) {
    if (!supportedNetwork(network)) {
        throw new Error(`Network ${network} is not supported`)
    }
    return RPC[network]
}


type LzConfig = {
    endpointAddress: address,
    endpointId: number,
    chainId: number,
    sendLibConfig?: {
        sendLibAddress: address,
        executorConfig: {
            executorAddress: address,
            maxMessageSize?: number,
        },
        ulnConfig: {
            confirmations?: number, 
            requiredDVNCount?: number, 
            optionalDVNCount?: number, 
            optionalDVNThreshold?: number, 
            requiredDVNs: address[],
            optionalDVNs?: address[],
        }
    },
    receiveLibConfig?: {
        receiveLibAddress: address,
        gracePeriod?: number,
        ulnConfig: {
            confirmations?: number, 
            requiredDVNCount?: number, 
            optionalDVNCount?: number, 
            optionalDVNThreshold?: number, 
            requiredDVNs: address[],
            optionalDVNs?: address[],
        }
    }
}


// For most testnets/mainnets, the endpoint is the follow one, but need to check the actual endpoint under this doc https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts
export const TEST_LZ_ENDPOINT = "0x6EDCE65403992e310A62460808c4b910D972f10f"

export const LZ_CONFIG: { [key: network]: LzConfig} = {
    // lz config for testnets
    "sepolia": {
        endpointAddress: TEST_LZ_ENDPOINT,
        endpointId: TestnetV2EndpointId.SEPOLIA_V2_TESTNET,
        chainId: 11155111,
        sendLibConfig: {
            sendLibAddress: "0xcc1ae8Cf5D3904Cef3360A9532B477529b177cCE",
            executorConfig: {
                executorAddress: "0x718B92b5CB0a5552039B593faF724D182A881eDA",
            },
            ulnConfig: {
                requiredDVNs: ["0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193"], //, 
            }
        },
        receiveLibConfig: {
            receiveLibAddress: "0xdAf00F5eE2158dD58E0d3857851c432E34A3A851",
            ulnConfig: {
                requiredDVNs: ["0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193"], // 
            }
        }
    },
    "arbitrumsepolia": {
        endpointAddress: TEST_LZ_ENDPOINT,
        endpointId: TestnetV2EndpointId.ARBSEP_V2_TESTNET,
        chainId: 421614,
        sendLibConfig: {
            sendLibAddress: "0x4f7cd4DA19ABB31b0eC98b9066B9e857B1bf9C0E",
            executorConfig: {
                executorAddress: "0x5Df3a1cEbBD9c8BA7F8dF51Fd632A9aef8308897",
            },
            ulnConfig: {
                requiredDVNs: ["0x53f488E93b4f1b60E8E83aa374dBe1780A1EE8a8"],
            }
        },
        receiveLibConfig: {
            receiveLibAddress: "0x75Db67CDab2824970131D5aa9CECfC9F69c69636",
            ulnConfig: {
                requiredDVNs: ["0x53f488E93b4f1b60E8E83aa374dBe1780A1EE8a8"],
            }
        }
    },
    "basesepolia": {
        endpointAddress: TEST_LZ_ENDPOINT,
        endpointId: TestnetV2EndpointId.BASESEP_V2_TESTNET,
        chainId: 84532,
        sendLibConfig: {
            sendLibAddress: "0xC1868e054425D378095A003EcbA3823a5D0135C9",
            executorConfig: {
                executorAddress: "0x8A3D588D9f6AC041476b094f97FF94ec30169d3D",
            },
            ulnConfig: {
                requiredDVNs: ["0xe1a12515F9AB2764b887bF60B923Ca494EBbB2d6"],
            }
        },
        receiveLibConfig: {
            receiveLibAddress: "0x12523de19dc41c91F7d2093E0CFbB76b17012C8d",
            ulnConfig: {
                requiredDVNs: ["0xe1a12515F9AB2764b887bF60B923Ca494EBbB2d6"],
            }
        }
    },
    
}
export function getLzConfig(network: network): LzConfig {
    return LZ_CONFIG[network]
}

export function getLzLibConfig(newtwork: network): LzConfig {
    checkNetwork(newtwork)
    if (!LZ_CONFIG[newtwork].sendLibConfig || !LZ_CONFIG[newtwork].receiveLibConfig ) {
       throw new Error(`LZ config for ${newtwork} does not have sendLibConfig or receiveLibConfig`)
    }
    return LZ_CONFIG[newtwork]
}

export function tokenContractName(network: network) {
    if (isERC20Network(network)) {
        return 'Omakase'
    } else {
        return 'OFT'
    }
}

export function oftContractName(network: network) {
    if (isERC20Network(network)) {
        return 'Adapter'
    } else {
        return 'OFT'
    }
}

// Check if the network is where the ERC20 token is deployed to
// The ERC20 token is deployed to the sepolia and ethereum network
export function isERC20Network(network: network) {
    return network === "sepolia"
}

// Check if the network is where the OFT token is deployed to
export function supportedNetwork(network: network) {
    return TEST_NETWORKS.includes(network)
}

export function checkNetwork(network: string) {
    if (TEST_NETWORKS.includes(network)) {
        return true
    } else {
        throw new Error(`Network ${network} is not supported`)
    }
}






import { EndpointId } from '@layerzerolabs/lz-definitions'

import type { OAppOmniGraphHardhat, OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const sepoliaContract: OmniPointHardhat = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'Adapter',
}

const arbitrumsepoliaContract: OmniPointHardhat = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'OFT',
}

const basesepoliaContract: OmniPointHardhat = {
    eid: EndpointId.BASESEP_V2_TESTNET,
    contractName: 'OFT',
}


const config: OAppOmniGraphHardhat = {
    contracts: [
        {
            contract: sepoliaContract,
        },
        {
            contract: arbitrumsepoliaContract,
        },
        {
            contract: basesepoliaContract,
        },
    ],
    connections: [
        // from sepolia to others
        {
            from: sepoliaContract,
            to: arbitrumsepoliaContract,
        },
       
        
        {
            from: sepoliaContract,
            to: basesepoliaContract,
        },
        
        // from arbitrumsepolia to others
        {
            from: arbitrumsepoliaContract,
            to: sepoliaContract,
        },
        
        {
            from: arbitrumsepoliaContract,
            to: basesepoliaContract,
        },        
        // from basesepolia to others
        {
            from: basesepoliaContract,
            to: sepoliaContract,
        },
        {
            from: basesepoliaContract,
            to: arbitrumsepoliaContract,
        },      
    ],
}

export default config

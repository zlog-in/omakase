import { task, types } from 'hardhat/config'
import path from 'path'
import fs from 'fs'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import {
    EnvType,
    ContractType,
    TEST_NETWORKS,
    tokenContractName,
    oftContractName,
    getLzConfig,
    checkNetwork,
    LZ_CONFIG, 
    LZ_OPTIONS,
    getLzLibConfig,
    CCTP_ADDRESS,
    BACK_END_ADDRESS
} from './const'
import { loadContractAddress, saveContractAddress, getLayerZeroScanLink } from './utils'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { DeployResult } from 'hardhat-deploy/dist/types'
import { base58 } from 'ethers/lib/utils'

let fromNetwork: string = ''
let toNetwork: string = ''

let localContractAddress: string = ''
let localContractName: string = ''

let remoteContractAddress: string = ''
let remoteContractName: string = ''

task(
    'hack:deploy',
    'Deploys the contract to a specific network: Omakase, Adapter, OFT, Waiter, Chef'
)
    .addParam('env', 'The environment to deploy the OFT contract', undefined, types.string)
    .addParam('contract', 'The contract to deploy', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        checkNetwork(hre.network.name)
        try {
            const contractName: ContractType  = taskArgs.contract as ContractType
            const env: EnvType = taskArgs.env as EnvType
            console.log(`Running on ${hre.network.name}`)
            const { deploy } = hre.deployments
            const [signer] = await hre.ethers.getSigners()

            // let variables for deployment and initialization
            let contractAddress: string = ''
            let proxy: boolean = false
            let tokenAddress: string | undefined = ''
            let lzEndpointAddress: string | undefined = ''
            let initArgs: any[] = []
            const initTokenHolder = signer.address
            const owner = signer.address
            if (contractName === 'Omakase') {
                initArgs = [initTokenHolder]
                console.log(`Token Holder address: ${initTokenHolder}`)
            } else if (contractName === 'Adapter') {
                proxy = true
                tokenAddress = await loadContractAddress(env, hre.network.name, 'Omakase')
                lzEndpointAddress = getLzConfig(hre.network.name).endpointAddress
                initArgs = [tokenAddress, lzEndpointAddress, owner]
            } else if (contractName === 'OFT') {
                proxy = true
                lzEndpointAddress = getLzConfig(hre.network.name).endpointAddress
                initArgs = [lzEndpointAddress, owner]
            } else if (
                contractName === 'Waiter' ||
                contractName === 'Chef'
            ) {
                proxy = true
                initArgs = [owner]
            } else {
                throw new Error(`Contract ${contractName} not found`)
            }

            const salt = hre.ethers.utils.id(process.env.DEPLOYMENT_SALT + `${env}` || "deterministicDeployment")

            const baseDeployArgs = {
                from: signer.address,
                log: true,
                deterministicDeployment: salt,
                strict: true,
            }
            // deterministic deployment
            let deployedContract: DeployResult
            if (proxy) {
                deployedContract = await deploy(contractName, {
                    ...baseDeployArgs,
                    proxy: {
                        owner: owner,
                        proxyContract: 'UUPS',
                        execute: {
                            methodName: 'initialize',
                            args: initArgs,
                        },
                    },
                    // gasLimit: 800000
                })
            } else {
                deployedContract = await deploy(contractName, {
                    ...baseDeployArgs,
                    args: initArgs,
                })
            }
            console.log(
                `${contractName} contract deployed to ${deployedContract.address} with tx hash ${deployedContract.transactionHash}`
            )
            contractAddress = deployedContract.address
            await saveContractAddress(env, hre.network.name, contractName, contractAddress)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })


task(
    'hack:init',
    'Initializes the contract for Waiter and Chef contracts'
)
    .addParam('env', 'The environment to deploy the OFT contract', undefined, types.string)
    .addParam('contract', 'The contract to deploy', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        const contractName: ContractType = taskArgs.contract as ContractType
        const env: EnvType = taskArgs.env as EnvType
        console.log(`Running on ${hre.network.name}`)
        const { deploy } = hre.deployments
        const [signer] = await hre.ethers.getSigners()
        try {
            const contractAddress = (await loadContractAddress(env, hre.network.name, contractName)) as string
            const contract = await hre.ethers.getContractAt(contractName, contractAddress, signer)
            const lzConfig = getLzConfig(hre.network.name)
            const oftName = oftContractName(hre.network.name)
            const oftAddress = (await loadContractAddress(env, hre.network.name, oftName)) as string

            const oftAddressOnContract = await contract.oft()
            if (oftAddressOnContract !== oftAddress) {
                const txSetOft = await contract.setOft(oftAddress)
                await txSetOft.wait()
                const txSetLocalSender = await contract.setLocalComposeMsgSender(oftAddress, true)
                await txSetLocalSender.wait()
                console.log(`OFT set to ${oftAddress} on ${contractName} and set as local composeMsgSender`)
            } else {
                console.log(`OFT address on ${contractName} already set to ${oftAddress} and set as local composeMsgSender`)
            }
            
            if (contractName === 'Waiter') {
                const hubChainLzConfig = getLzConfig('basesepolia')

                const eidOnContract = await contract.chainId2Eid(hubChainLzConfig.chainId)
                const chainIdOnContract = await contract.eid2ChainId(hubChainLzConfig.endpointId)

                if (Number(eidOnContract) !== hubChainLzConfig.endpointId || Number(chainIdOnContract) !== hubChainLzConfig.chainId) {
                    const txSetEid = await contract.setEid(hubChainLzConfig.chainId, hubChainLzConfig.endpointId)
                    await txSetEid.wait()
                    console.log(`Set eid ${lzConfig.endpointId} and chainId ${lzConfig.chainId} on ${contractName}`)
                } else {
                    console.log(
                        `Eid ${lzConfig.endpointId} and chainId ${lzConfig.chainId} already set on ${contractName}`
                    )
                }

                const chefAddress = await loadContractAddress(env, 'basesepolia', 'Chef')
                const chefAddressOnContract = await contract.chef()
                if (chefAddressOnContract !== chefAddress) {
                    const txSetChef = await contract.setChef(chefAddress)
                    await txSetChef.wait()
                    console.log(`Set chef address ${chefAddress} on ${contractName}`)
                } else {
                    console.log(`Chef address already set to ${chefAddress} on ${contractName}`)
                }

                const remoteSenderOnContractStatus = await contract.remoteComposeMsgSender(hubChainLzConfig.endpointId, chefAddress)
                if (remoteSenderOnContractStatus !== true) {
                    const txSetRemoteSender = await contract.setRemoteComposeMsgSender(
                        hubChainLzConfig.endpointId,
                        chefAddress,
                        true
                    )
                    await txSetRemoteSender.wait()
                    console.log(`Set chef as remote composeMsgSender`)
                } else {
                    console.log(`Chef already set as remote composeMsgSender`)
                }
                const hubChainIdOnContract = await contract.hubChainId()
                if (Number(hubChainIdOnContract) !== Number(hubChainLzConfig.chainId)) {
                    const txSetHubChainId = await contract.setHubChainId(hubChainLzConfig.chainId)
                    await txSetHubChainId.wait()
                    console.log(`Set hub chain id to ${hubChainLzConfig.chainId} on ${contractName}`)
                } else {
                    console.log(`Hub chain id already set to ${hubChainLzConfig.chainId} on ${contractName}`)
                }

                // const cctpAddress = CCTP_ADDRESS[hre.network.name as keyof typeof CCTP_ADDRESS]
                // const usdcAddressOnContract = await contract.usdc()
                // if (usdcAddressOnContract.toLowerCase() !== cctpAddress.USDC.toLowerCase()) {
                //     const txSetUSDC = await contract.setUSDC(cctpAddress.USDC)
                //     await txSetUSDC.wait()
                //     console.log(`Set usdc to ${cctpAddress.USDC} on ${contractName}`)
                // } else {
                //     console.log(`USDC already set to ${cctpAddress.USDC} on ${contractName}`)
                // }

                const cctpAddress = CCTP_ADDRESS['basesepolia']
                const baseDomainId = await contract.chainId2DomainId(hubChainLzConfig.chainId)
                if (Number(baseDomainId) !== cctpAddress.domain) {
                    const txSetBaseDomainId = await contract.setCCTPDomainId(hubChainLzConfig.chainId, cctpAddress.domain)
                    await txSetBaseDomainId.wait()
                    console.log(`Set base domain id to ${cctpAddress.domain} on ${contractName}`)
                } else {
                    console.log(`Base domain id already set to ${cctpAddress.domain} on ${contractName}`)
                }
                
            } else if (contractName === 'Chef') {
                const NETWORKS = TEST_NETWORKS
                for (const network of NETWORKS) {
                    if (network !== hre.network.name) {
                        const lzConfig = getLzConfig(network)
                        const cctpAddress = CCTP_ADDRESS[network as keyof typeof CCTP_ADDRESS]
                        const eidOnContract = await contract.chainId2Eid(lzConfig.chainId)
                        const chainIdOnContract = await contract.eid2ChainId(lzConfig.endpointId)
                        const waiterOnContract = await contract.waiters(lzConfig.chainId)
                        
                        if (Number(eidOnContract) !== lzConfig.endpointId || Number(chainIdOnContract) !== lzConfig.chainId) {
                            const txSetEid = await contract.setEid(lzConfig.chainId, lzConfig.endpointId)
                            await txSetEid.wait()
                            console.log(`Set eid ${lzConfig.endpointId} and chainId ${lzConfig.chainId} on ${contractName}`)
                        } else {
                            console.log(
                                `Eid ${lzConfig.endpointId} and chainId ${lzConfig.chainId} already set on ${contractName}`
                            )
                        }

                        const waiterAddress = await loadContractAddress(env, network, 'Waiter')
                        if (waiterOnContract !== waiterAddress) {
                            const txSetWaiter = await contract.setWaiter(lzConfig.chainId, waiterAddress)
                            await txSetWaiter.wait()
                            console.log(`Set waiter address ${waiterAddress} on ${contractName}`)
                            const txSetRemoteSender = await contract.setRemoteComposeMsgSender(
                                lzConfig.endpointId,
                                waiterAddress,
                                true
                            )
                            await txSetRemoteSender.wait()
                            console.log(`Set waiter as remote composeMsgSender`)
                        } else {
                            console.log(`Waiter address already set to ${waiterAddress} on ${contractName}`)
                        }

                        const chainIdOnContractForDomain = await contract.domainId2ChainId(cctpAddress.domain)
                        if (Number(chainIdOnContractForDomain) !== lzConfig.chainId) {
                            const txSetBaseDomainId = await contract.setCCTPDomainId(lzConfig.chainId, cctpAddress.domain)
                            await txSetBaseDomainId.wait()
                            console.log(`Set base domain id to ${cctpAddress.domain} on ${contractName}`)
                        } else {
                            console.log(`Domain id for ${network} already set to ${cctpAddress.domain} on ${contractName}`)
                        }
                        
                }
                 
                } 

                const backendAddress = BACK_END_ADDRESS
                const backendOnContract = await contract.backend()
                if (backendOnContract.toLowerCase() !== backendAddress.toLowerCase()) {
                    const txSetBackend = await contract.setBackend(backendAddress)
                    await txSetBackend.wait()
                    console.log(`Set backend to ${backendAddress} on ${contractName}`)
                } else {
                    console.log(`Backend already set to ${backendAddress} on ${contractName}`)
                }
            }else {
                throw new Error(`Contract ${contractName} not found`)
            }

            const cctpAddress = CCTP_ADDRESS['basesepolia']
            const tokenMessagerOnContract = await contract.tokenMessager()
            if (tokenMessagerOnContract.toLowerCase() !== cctpAddress.TokenMessager.toLowerCase() ) {
                const txSetTokenMessager = await contract.setTokenMessager(cctpAddress.TokenMessager)
                await txSetTokenMessager.wait()
                console.log(`Set token messager to ${cctpAddress.TokenMessager} on ${contractName}`)
            } else {
                console.log(`Token messager already set to ${cctpAddress.TokenMessager} on ${contractName}`)
            }

            const messageTransmitterOnContract = await contract.messageTransmitter()
            if (messageTransmitterOnContract.toLowerCase() !== cctpAddress.MessageTransmitter.toLowerCase() ) {
                const txSetMessageTransmitter = await contract.setMessageTransmitter(cctpAddress.MessageTransmitter)
                await txSetMessageTransmitter.wait()
                console.log(`Set message transmitter to ${cctpAddress.MessageTransmitter} on ${contractName}`)
            } else {
                console.log(`Message transmitter already set to ${cctpAddress.MessageTransmitter} on ${contractName}`)
            }

            const usdcAddressOnContract = await contract.usdc()
            if (usdcAddressOnContract.toLowerCase() !== cctpAddress.USDC.toLowerCase()) {
                const txSetUSDC = await contract.setUSDC(cctpAddress.USDC)
                await txSetUSDC.wait()
                console.log(`Set usdc to ${cctpAddress.USDC} on ${contractName}`)
            } else {
                console.log(`USDC already set to ${cctpAddress.USDC} on ${contractName}`)
            }

            console.log(`Initialized ${contractName} on ${hre.network.name} for ${env}`)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })

task(
    'hack:upgrade',
    'Upgrades the contract to a specific network: OrderSafe, OrderSafeRelayer, OrderBox, OrderBoxRelayer'
)
    .addParam('env', 'The environment to upgrade the OFT contract', undefined, types.string)
    .addParam('contract', 'The contract to upgrade', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        const network = hre.network.name
        checkNetwork(network)
        try {
            const contractName: ContractType = taskArgs.contract as ContractType
            const env: EnvType = taskArgs.env as EnvType
            console.log(`Running on ${hre.network.name}`)
            const { deploy } = hre.deployments
            const [signer] = await hre.ethers.getSigners()
            let implAddress = ''
            const salt = hre.ethers.utils.id(process.env.ORDER_DEPLOYMENT_SALT + `${env}` || "deterministicDeployment")
            
            if (
                contractName === 'Adapter' ||
                contractName === 'OFT' ||
                contractName === 'Chef' ||
                contractName === 'Waiter'
            ) {
                const baseDeployArgs = {
                    from: signer.address,
                    log: true,
                    deterministicDeployment: salt,
                }
                const contract = await deploy(contractName, {
                    ...baseDeployArgs,
                })
                implAddress = contract.address
                console.log(
                    `${contractName} implementation deployed to ${implAddress} with tx hash ${contract.transactionHash}`
                )
            } else {
                throw new Error(`Contract ${contractName} not found`)
            }
            const contractAddress = (await loadContractAddress(env, network, contractName)) as string
            const contract = await hre.ethers.getContractAt(contractName, contractAddress, signer)

            // encoded data for function call during upgrade
            const data = '0x'
            const upgradeTx = await contract.upgradeToAndCall(implAddress, data)
            console.log(`Upgrading contract ${contractName} to ${implAddress} with tx hash ${upgradeTx.hash}`)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })

task('hack:oft:set', 'Connect OFT contracs on different networks: OrderOFT, OrderAdapter')
    .addParam('env', 'The environment to connect the OFT contracts', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        checkNetwork(hre.network.name)
        try {
            const fromNetwork = hre.network.name
            const NETWORKS = TEST_NETWORKS
            console.log(`Running on ${fromNetwork}`)
            const [signer] = await hre.ethers.getSigners()
            let nonce = await signer.getTransactionCount()
            let enforcedOptions = []
            
            const localContractName = oftContractName(fromNetwork)
            const localContractAddress = (await loadContractAddress(
                taskArgs.env,
                fromNetwork,
                localContractName
            )) as string
            const localContract = await hre.ethers.getContractAt(localContractName, localContractAddress, signer)

            const owner = await localContract.owner()

            for (const toNetwork of NETWORKS) {
                if (fromNetwork !== toNetwork) {
                    remoteContractName = oftContractName(toNetwork)
                    remoteContractAddress = (await loadContractAddress(
                        taskArgs.env,
                        toNetwork,
                        remoteContractName
                    )) as string

                    const lzConfig = getLzConfig(toNetwork)
                    const paddedPeerAddress = hre.ethers.utils.hexZeroPad(remoteContractAddress, 32)
                    const isPeer = await localContract.isPeer(lzConfig['endpointId'], paddedPeerAddress)

                    if (!isPeer) {
                        const txSetPeer = await localContract.setPeer(lzConfig["endpointId"], paddedPeerAddress, {
                            nonce: nonce++
                        })
                        await txSetPeer.wait()
                        console.log(`Setting peer from ${fromNetwork} to ${toNetwork} with tx hash ${txSetPeer.hash}`)
                       
                    } else {
                        console.log(`Already peered from ${fromNetwork} to ${toNetwork}`)
                    }
                    const types = [1, 2]
                    for (const type of types) {
                        const typeOptionOnContract = await localContract.enforcedOptions(lzConfig['endpointId'], type)
                        let enforcedOrderedOption = ''
                        let gas, value, composeGas, composeValue
                        if (type === 1) {
                            gas = LZ_OPTIONS[1].gas
                            value = LZ_OPTIONS[1].value

                            enforcedOrderedOption = Options.newOptions().addExecutorLzReceiveOption(gas, value).toHex() // .addExecutorOrderedExecutionOption()
                        } else if (type === 2) {
                            gas = LZ_OPTIONS[1].gas
                            value = LZ_OPTIONS[1].value
                            composeGas = LZ_OPTIONS[2].gas
                            composeValue = LZ_OPTIONS[2].value
                            enforcedOrderedOption = Options.newOptions()
                                .addExecutorLzReceiveOption(gas, value)
                                .addExecutorComposeOption(0, composeGas, composeValue)
                                .toHex() // .addExecutorOrderedExecutionOption()
                        }
                        if (typeOptionOnContract !== enforcedOrderedOption) {
                            const optionsToAdd = {
                                eid: lzConfig['endpointId'],
                                msgType: type,
                                options: enforcedOrderedOption,
                            }

                            enforcedOptions.push(optionsToAdd)

                            
                        }
                        if (typeOptionOnContract !== enforcedOrderedOption) {
                            const optionsToAdd = {
                                eid: lzConfig['endpointId'],
                                msgType: type,
                                options: enforcedOrderedOption,
                            }
                            enforcedOptions.push(optionsToAdd)
                        }
                    }
                    
                    
                }

                
            }

            if (enforcedOptions.length > 0) {
                if (signer.address === owner) {
                    const txSetEnforcedOptions = await localContract.setEnforcedOptions(enforcedOptions, {
                        nonce: nonce++,
                    })
                    await txSetEnforcedOptions.wait()
                    console.log(`Enforced options set with tx hash ${txSetEnforcedOptions.hash}`)
                } else {
                    throw new Error(`Signer is not owner`)
                }
            } else {
                console.log(`Enforced options already set`)
            }
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })



task('hack:oft:distribute', 'Distribute tokens to all OFT contracts on different networks')
    .addParam('env', 'The environment to send the tokens', undefined, types.string)
    .addParam('receiver', 'The address to receive the tokens', undefined, types.string)
    .addParam('amount', 'The amount of tokens to send', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        checkNetwork(hre.network.name)
        try {
            fromNetwork = hre.network.name
            const receiver = taskArgs.receiver
            const [signer] = await hre.ethers.getSigners()
            const NETWORKS = TEST_NETWORKS
            console.log(`Running on ${fromNetwork}`)
            let nonce = await signer.getTransactionCount()
            for (const toNetwork of NETWORKS) {
                if (fromNetwork !== toNetwork) {
                    localContractName = oftContractName(fromNetwork)
                    remoteContractName = oftContractName(toNetwork)
                    localContractAddress = (await loadContractAddress(
                        taskArgs.env,
                        fromNetwork,
                        localContractName
                    )) as string
                    remoteContractAddress = (await loadContractAddress(
                        taskArgs.env,
                        toNetwork,
                        remoteContractName
                    )) as string

                    const erc20ContractName = tokenContractName(fromNetwork)
                    const erc20ContractAddress = (await loadContractAddress(
                        taskArgs.env,
                        fromNetwork,
                        erc20ContractName
                    )) as string

                    const localContract = await hre.ethers.getContractAt(
                        localContractName,
                        localContractAddress,
                        signer
                    )
                    const erc20Contract = await hre.ethers.getContractAt(
                        erc20ContractName,
                        erc20ContractAddress,
                        signer
                    )

                    const deciamls = await erc20Contract.decimals()
                    const tokenAmount = hre.ethers.utils.parseUnits(taskArgs.amount, deciamls)
                    if (
                        (await localContract.approvalRequired()) &&
                        tokenAmount > (await erc20Contract.allowance(signer.address, localContractAddress))
                    ) {
                        const estimateGas = await erc20Contract.estimateGas.approve(localContractAddress, tokenAmount, {
                            nonce: nonce,
                        })
                        // console.log(`Estimated gas: ${estimateGas}`)
                        const approveTx = await erc20Contract.approve(localContractAddress, tokenAmount, {
                            gasLimit: 10 * Number(estimateGas),
                            nonce: nonce++,
                        })
                        await approveTx.wait()
                        console.log(
                            `Approving ${localContractName} to spend ${taskArgs.amount} on ${erc20ContractName} with tx hash ${approveTx.hash}`
                        )
                    }

                    const param = {
                        dstEid: getLzConfig(toNetwork)['endpointId'],
                        to: hre.ethers.utils.hexZeroPad(receiver, 32),
                        amountLD: tokenAmount,
                        minAmountLD: tokenAmount,
                        extraOptions: '0x',
                        composeMsg: '0x',
                        oftCmd: '0x',
                    }
                    const payLzToken = false
                    let fee = await localContract.quoteSend(param, payLzToken)
                    const estimateGas = await localContract.estimateGas.send(param, fee, signer.address, {
                        // gasPrice: 1000000000,
                        value: fee.nativeFee,
                        nonce: nonce,
                    })
                    const sendTx = await localContract.send(param, fee, signer.address, {
                        gasLimit: 10 * Number(estimateGas),
                        value: fee.nativeFee,
                        nonce: nonce++,
                    })
                    await sendTx.wait()
                    console.log(`Sending tokens from ${fromNetwork} to ${toNetwork} with tx hash ${sendTx.hash}`)
                }
            }
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })

task('hack:oft:bridge', 'Bridge tokens to a specific address on a specific network through OFT contracts')
    .addParam('env', 'The environment to send the tokens', undefined, types.string)
    .addParam('dstNetwork', 'The network to receive the tokens', undefined, types.string)
    .addParam('receiver', 'The address to receive the tokens', undefined, types.string)
    .addParam('amount', 'The amount of tokens to send', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        checkNetwork(hre.network.name)
        checkNetwork(taskArgs.dstNetwork)
        const network = hre.network.name
        try {
            fromNetwork = hre.network.name
            console.log(`Running on ${fromNetwork}`)

            const receiver = taskArgs.receiver
            toNetwork = taskArgs.dstNetwork

            if (fromNetwork === toNetwork) {
                throw new Error(`Cannot bridge tokens to the same network`)
            } else {
                localContractName = oftContractName(fromNetwork)
            }

            localContractAddress = (await loadContractAddress(taskArgs.env, fromNetwork, localContractName)) as string

            const erc20ContractName = tokenContractName(fromNetwork)
            const erc20ContractAddress = (await loadContractAddress(
                taskArgs.env,
                fromNetwork,
                erc20ContractName
            )) as string

            const [signer] = await hre.ethers.getSigners()
            const localContract = await hre.ethers.getContractAt(localContractName, localContractAddress, signer)
            const erc20Contract = await hre.ethers.getContractAt(erc20ContractName, erc20ContractAddress, signer)

            const deciamls = await erc20Contract.decimals()
            const tokenAmount = hre.ethers.utils.parseUnits(taskArgs.amount, deciamls)
            // const tokenAmount = 1_0123456789_01234567n

            let nonce = await signer.getTransactionCount()
            if (
                (await localContract.approvalRequired()) &&
                tokenAmount > (await erc20Contract.allowance(signer.address, localContractAddress))
            ) {
                const approveTx = await erc20Contract.approve(localContractAddress, tokenAmount, { nonce: nonce++ })
                await approveTx.wait()
                console.log(
                    `Approving ${localContractName} to spend ${taskArgs.amount} on ${erc20ContractName} with tx hash ${approveTx.hash}`
                )
            }
            let toAddress
            if (toNetwork === 'solana' || toNetwork === 'soldev') {
                // encode to base58
                toAddress = '0x' + Buffer.from(base58.decode(receiver)).toString('hex')
                console.log(`Decoded address: ${toAddress}`)
            } else {
                toAddress = hre.ethers.utils.hexZeroPad(receiver, 32)
            }
            const param = {
                dstEid: getLzConfig(toNetwork)['endpointId'],
                to: toAddress,
                amountLD: tokenAmount,
                minAmountLD: tokenAmount,
                extraOptions:'0x', 
                composeMsg: '0x',
                oftCmd: '0x',
            }
            const payLzToken = false
            let fee = await localContract.quoteSend(param, payLzToken)
            console.log(`Fee in native: ${fee.nativeFee}`)
            const sendTx = await localContract.send(param, fee, signer.address, {
                value: fee.nativeFee,
                nonce: nonce++,
            })
            await sendTx.wait()
            console.log(`Sending tokens from ${fromNetwork} to ${toNetwork} with tx hash ${sendTx.hash}`)
            getLayerZeroScanLink(sendTx.hash)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })


task('hack:oft:transfer', 'Transfer tokens to a specific address on a specific network')
    .addParam('env', 'The environment to send the tokens', undefined, types.string)
    .addParam('receiver', 'The address to receive the tokens', undefined, types.string)
    .addParam('amount', 'The amount of tokens to send', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        checkNetwork(hre.network.name)
        try {
            fromNetwork = hre.network.name
            console.log(`Running on ${fromNetwork}`)

            const receiver = taskArgs.receiver

            const erc20ContractName = tokenContractName(fromNetwork)
            const erc20ContractAddress = (await loadContractAddress(
                taskArgs.env,
                fromNetwork,
                erc20ContractName
            )) as string

            const [signer] = await hre.ethers.getSigners()
            const erc20Contract = await hre.ethers.getContractAt(erc20ContractName, erc20ContractAddress, signer)

            const deciamls = await erc20Contract.decimals()
            const tokenAmount = hre.ethers.utils.parseUnits(taskArgs.amount, deciamls)
            const transferTx = await erc20Contract.transfer(receiver, tokenAmount)
            await transferTx.wait()
            console.log(`Transferring tokens to ${receiver} with tx hash ${transferTx.hash}`)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })

task('hack:stake', 'Send stakes to a specific address on a specific network')
    .addParam('env', 'The environment to send the stakes', undefined, types.string)
    .addParam('amount', 'The amount of stakes to send', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        checkNetwork(hre.network.name)
        try {
            fromNetwork = hre.network.name
            console.log(`Running on ${fromNetwork}`)

            toNetwork = 'basesepolia'

            if (fromNetwork === toNetwork) {
                throw new Error(`Cannot bridge tokens to the same network`)
            } else {
                localContractName = 'Waiter'
                remoteContractName = oftContractName(toNetwork)
            }

            localContractAddress = (await loadContractAddress(taskArgs.env, fromNetwork, localContractName)) as string

            const erc20ContractName = tokenContractName(fromNetwork)
            const erc20ContractAddress = (await loadContractAddress(
                taskArgs.env,
                fromNetwork,
                erc20ContractName
            )) as string

            const [signer] = await hre.ethers.getSigners()
            const waiterContract = await hre.ethers.getContractAt(localContractName, localContractAddress, signer)
            const erc20Contract = await hre.ethers.getContractAt(erc20ContractName, erc20ContractAddress, signer)

            const deciamls = await erc20Contract.decimals()
            const tokenAmount = hre.ethers.utils.parseUnits(taskArgs.amount, deciamls)
            let nonce = await signer.getTransactionCount()

            const approveTx = await erc20Contract.approve(localContractAddress, tokenAmount, {
                nonce: nonce++,
                gasPrice: 25000000000,
            })
            await approveTx.wait()
            console.log(
                `Approving ${localContractName} to spend ${taskArgs.amount} on ${erc20ContractName} with tx hash ${approveTx.hash}`
            )

            console.log(`Signer address: ${signer.address}`)
            console.log(`Token amount: ${tokenAmount}`)

            const lzFee = await waiterContract.quoteStake(signer.address, tokenAmount)

            console.log(`LZ fee: ${lzFee}`)

            const stakeTx = await waiterContract.stake(tokenAmount, {
                value: lzFee,
                nonce: nonce++,
            })
            console.log(`Staking tokens from ${fromNetwork} to ${toNetwork} with tx hash ${stakeTx.hash}`)
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })

task('hack:request', 'Send unstakes to a specific address on a specific network')
    .addParam('env', 'The environment to send the stakes', undefined, types.string)
    .addParam('requestType', 'The type of request', undefined, types.string)
    .setAction(async (taskArgs, hre) => {
        checkNetwork(hre.network.name)
        try {
            fromNetwork = hre.network.name
            console.log(`Running on ${fromNetwork}`)

            toNetwork = 'basesepolia'

            if (fromNetwork === toNetwork) {
                throw new Error(`Cannot bridge tokens to the same network`)
            } else {
                localContractName = 'Waiter'
                remoteContractName = oftContractName(toNetwork)
            }

            localContractAddress = (await loadContractAddress(taskArgs.env, fromNetwork, localContractName)) as string    

            const [signer] = await hre.ethers.getSigners()
            const waiterContract = await hre.ethers.getContractAt(localContractName, localContractAddress, signer)

            let nonce = await signer.getTransactionCount()

            if (taskArgs.requestType === 'unstake') {
                const lzFee = await waiterContract.quoteUnstake(signer.address)
                const unstakeTx = await waiterContract.unstake( {
                value: lzFee,
                nonce: nonce++,
                gasPrice: 25000000000,
                })
                console.log(`Unstaking tokens from ${fromNetwork} to ${toNetwork} with tx hash ${unstakeTx.hash}`)
            } else if (taskArgs.requestType === 'withdraw') {
                const lzFee = await waiterContract.quoteWithdraw(signer.address)
                const withdrawTx = await waiterContract.withdraw( {
                    value: lzFee,
                    nonce: nonce++,
                    gasPrice: 25000000000,
                })
                console.log(`Withdrawing tokens from ${fromNetwork} to ${toNetwork} with tx hash ${withdrawTx.hash}`)
            } else if (taskArgs.requestType === 'claim') {
                const lzFee = await waiterContract.quoteClaim(signer.address)
                const claimTx = await waiterContract.claim( {
                    value: lzFee,
                    nonce: nonce++,
                    gasPrice: 25000000000,
                })
                console.log(`Claiming tokens from ${fromNetwork} to ${toNetwork} with tx hash ${claimTx.hash}`)
            } else {
                throw new Error(`Invalid request type: ${taskArgs.requestType}`)
            }

            
        } catch (e) {
            console.log(`Error: ${e}`)
        }
    })


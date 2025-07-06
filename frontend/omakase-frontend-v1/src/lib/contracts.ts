export const WAITER_ABI = [{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"AddressInsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"}],"name":"ERC1967InvalidImplementation","type":"error"},{"inputs":[],"name":"ERC1967NonPayable","type":"error"},{"inputs":[],"name":"EnforcedPause","type":"error"},{"inputs":[],"name":"ExpectedPause","type":"error"},{"inputs":[],"name":"FailedInnerCall","type":"error"},{"inputs":[{"internalType":"address","name":"savedEndpoint","type":"address"},{"internalType":"address","name":"realEndpoint","type":"address"}],"name":"InvalidEnpoint","type":"error"},{"inputs":[],"name":"InvalidInitialization","type":"error"},{"inputs":[],"name":"NotInitializing","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"NotLocalComposeMsgSender","type":"error"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"address","name":"sender","type":"address"}],"name":"NotRemoteComposeMsgSender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"inputs":[],"name":"UUPSUnauthorizedCallContext","type":"error"},{"inputs":[{"internalType":"bytes32","name":"slot","type":"bytes32"}],"name":"UUPSUnsupportedProxiableUUID","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":true,"internalType":"uint32","name":"domainId","type":"uint32"},{"indexed":true,"internalType":"address","name":"mintRecipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BurnUSDC","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ClaimSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"composeMsgSender","type":"address"},{"indexed":false,"internalType":"bool","name":"allowed","type":"bool"}],"name":"ComposeMsgSenderSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"chainId","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"eid","type":"uint32"}],"name":"EidSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"endpoint","type":"address"}],"name":"EndpointSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"version","type":"uint64"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[],"name":"MintUSDC","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oft","type":"address"}],"name":"OftSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"StakeSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"}],"name":"UnstakeSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WithdrawFinished","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"}],"name":"WithdrawSent","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"UPGRADE_INTERFACE_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"backend","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"chainId2DomainId","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"chainId2Eid","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"chef","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint32","name":"","type":"uint32"}],"name":"domainId2ChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"","type":"uint32"}],"name":"eid2ChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"hubChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"localComposeMsgSender","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"address","name":"","type":"address"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"lzCompose","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"enum LzMessageLib.PayloadTypes","name":"","type":"uint8"}],"name":"lzOptions","outputs":[{"internalType":"uint128","name":"gas","type":"uint128"},{"internalType":"uint128","name":"value","type":"uint128"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"messageTransmitter","outputs":[{"internalType":"contract IMessageTransmitter","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oft","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_claimer","type":"address"}],"name":"quoteClaim","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_staker","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"quoteStake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_unstaker","type":"address"}],"name":"quoteUnstake","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_withdrawer","type":"address"}],"name":"quoteWithdraw","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"address","name":"","type":"address"}],"name":"remoteComposeMsgSender","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_backend","type":"address"}],"name":"setBackend","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_chainId","type":"uint256"},{"internalType":"uint32","name":"_domainId","type":"uint32"}],"name":"setCCTPDomainId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_chef","type":"address"}],"name":"setChef","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_chainId","type":"uint256"},{"internalType":"uint32","name":"_eid","type":"uint32"}],"name":"setEid","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_hubChainId","type":"uint256"}],"name":"setHubChainId","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"},{"internalType":"bool","name":"_allowed","type":"bool"}],"name":"setLocalComposeMsgSender","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_messageTransmitter","type":"address"}],"name":"setMessageTransmitter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_oft","type":"address"}],"name":"setOft","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint8","name":"_payloadType","type":"uint8"},{"internalType":"uint128","name":"_gas","type":"uint128"},{"internalType":"uint128","name":"_value","type":"uint128"}],"name":"setPayloadOptions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_eid","type":"uint32"},{"internalType":"address","name":"_addr","type":"address"},{"internalType":"bool","name":"_allowed","type":"bool"}],"name":"setRemoteComposeMsgSender","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_tokenMessager","type":"address"}],"name":"setTokenMessager","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_usdc","type":"address"}],"name":"setUSDC","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"stake","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"tokenMessager","outputs":[{"internalType":"contract ITokenMessenger","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unstake","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"usdc","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}] as const;

export const CHEF_ABI = [{ "inputs": [{ "internalType": "address", "name": "target", "type": "address" }], "name": "AddressEmptyCode", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "implementation", "type": "address" }], "name": "ERC1967InvalidImplementation", "type": "error" }, { "inputs": [], "name": "ERC1967NonPayable", "type": "error" }, { "inputs": [], "name": "EnforcedPause", "type": "error" }, { "inputs": [], "name": "ExpectedPause", "type": "error" }, { "inputs": [], "name": "FailedInnerCall", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "savedEndpoint", "type": "address" }, { "internalType": "address", "name": "realEndpoint", "type": "address" }], "name": "InvalidEnpoint", "type": "error" }, { "inputs": [], "name": "InvalidInitialization", "type": "error" }, { "inputs": [], "name": "NotInitializing", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "NotLocalComposeMsgSender", "type": "error" }, { "inputs": [{ "internalType": "uint32", "name": "eid", "type": "uint32" }, { "internalType": "address", "name": "sender", "type": "address" }], "name": "NotRemoteComposeMsgSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "inputs": [], "name": "UUPSUnauthorizedCallContext", "type": "error" }, { "inputs": [{ "internalType": "bytes32", "name": "slot", "type": "bytes32" }], "name": "UUPSUnsupportedProxiableUUID", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "uint32", "name": "domainId", "type": "uint32" }, { "indexed": true, "internalType": "address", "name": "mintRecipient", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "BurnUSDC", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Claimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "composeMsgSender", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "allowed", "type": "bool" }], "name": "ComposeMsgSenderSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": false, "internalType": "uint32", "name": "eid", "type": "uint32" }], "name": "EidSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "endpoint", "type": "address" }], "name": "EndpointSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint64", "name": "version", "type": "uint64" }], "name": "Initialized", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintUSDC", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "oft", "type": "address" }], "name": "OftSet", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardClaimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "RewardSent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Staked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenStaked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenUnstaked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TokenWithdrawn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Unstaked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }], "name": "Upgraded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "chainId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "staker", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Withdrawn", "type": "event" }, { "stateMutability": "payable", "type": "fallback" }, { "inputs": [], "name": "STAKE_REWARD_RATE", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UNSTAKE_PERIOD", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "UPGRADE_INTERFACE_VERSION", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "backend", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_chainId", "type": "uint256" }, { "internalType": "address", "name": "_mintRecipient", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "burnUSDC", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "chainId2DomainId", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "chainId2Eid", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "name": "domainId2ChainId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "name": "eid2ChainId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getTotalStakedAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_staker", "type": "address" }], "name": "getUserReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_staker", "type": "address" }], "name": "getUserStakeInfo", "outputs": [{ "components": [{ "internalType": "uint256", "name": "stakeAmount", "type": "uint256" }, { "internalType": "uint256", "name": "stakeReward", "type": "uint256" }, { "internalType": "uint256", "name": "lastStakeTime", "type": "uint256" }, { "internalType": "uint256", "name": "lastUnstakeTime", "type": "uint256" }], "internalType": "struct StakeUpgradeable.StakeInfo", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_staker", "type": "address" }], "name": "getUserUnstakeLockTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "localComposeMsgSender", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_from", "type": "address" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "bytes", "name": "_message", "type": "bytes" }, { "internalType": "address", "name": "", "type": "address" }, { "internalType": "bytes", "name": "", "type": "bytes" }], "name": "lzCompose", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "enum LzMessageLib.PayloadTypes", "name": "", "type": "uint8" }], "name": "lzOptions", "outputs": [{ "internalType": "uint128", "name": "gas", "type": "uint128" }, { "internalType": "uint128", "name": "value", "type": "uint128" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "messageTransmitter", "outputs": [{ "internalType": "contract IMessageTransmitter", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "oft", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "proxiableUUID", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }, { "internalType": "address", "name": "", "type": "address" }], "name": "remoteComposeMsgSender", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_domainId", "type": "uint32" }, { "internalType": "bytes", "name": "_message", "type": "bytes" }, { "internalType": "bytes", "name": "_attestation", "type": "bytes" }], "name": "sendReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_backend", "type": "address" }], "name": "setBackend", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_chainId", "type": "uint256" }, { "internalType": "uint32", "name": "_domainId", "type": "uint32" }], "name": "setCCTPDomainId", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_chainId", "type": "uint256" }, { "internalType": "uint32", "name": "_eid", "type": "uint32" }], "name": "setEid", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "bool", "name": "_allowed", "type": "bool" }], "name": "setLocalComposeMsgSender", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_messageTransmitter", "type": "address" }], "name": "setMessageTransmitter", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_oft", "type": "address" }], "name": "setOft", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "_payloadType", "type": "uint8" }, { "internalType": "uint128", "name": "_gas", "type": "uint128" }, { "internalType": "uint128", "name": "_value", "type": "uint128" }], "name": "setPayloadOptions", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "_eid", "type": "uint32" }, { "internalType": "address", "name": "_addr", "type": "address" }, { "internalType": "bool", "name": "_allowed", "type": "bool" }], "name": "setRemoteComposeMsgSender", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_tokenMessager", "type": "address" }], "name": "setTokenMessager", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_usdc", "type": "address" }], "name": "setUSDC", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_chainId", "type": "uint256" }, { "internalType": "address", "name": "_waiter", "type": "address" }], "name": "setWaiter", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "tokenMessager", "outputs": [{ "internalType": "contract ITokenMessenger", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalStakedAmount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newImplementation", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "upgradeToAndCall", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "usdc", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userStakeInfo", "outputs": [{ "internalType": "uint256", "name": "stakeAmount", "type": "uint256" }, { "internalType": "uint256", "name": "stakeReward", "type": "uint256" }, { "internalType": "uint256", "name": "lastStakeTime", "type": "uint256" }, { "internalType": "uint256", "name": "lastUnstakeTime", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "waiters", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "stateMutability": "payable", "type": "receive" }] as const;

export const NATIVE_ERC20_ABI = [{ "inputs": [{ "internalType": "address", "name": "_initDistributor", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" }], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "approver", "type": "address" }], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "receiver", "type": "address" }], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }], "name": "ERC20InvalidSpender", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }] as const;

export const ADAPTER_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"target","type":"address"}],"name":"AddressEmptyCode","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"AddressInsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"implementation","type":"address"}],"name":"ERC1967InvalidImplementation","type":"error"},{"inputs":[],"name":"ERC1967NonPayable","type":"error"},{"inputs":[],"name":"EnforcedPause","type":"error"},{"inputs":[],"name":"ExpectedPause","type":"error"},{"inputs":[],"name":"FailedInnerCall","type":"error"},{"inputs":[],"name":"InvalidDelegate","type":"error"},{"inputs":[],"name":"InvalidEndpointCall","type":"error"},{"inputs":[],"name":"InvalidInitialization","type":"error"},{"inputs":[],"name":"InvalidLocalDecimals","type":"error"},{"inputs":[{"internalType":"bytes","name":"options","type":"bytes"}],"name":"InvalidOptions","type":"error"},{"inputs":[],"name":"LzTokenUnavailable","type":"error"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"}],"name":"NoPeer","type":"error"},{"inputs":[{"internalType":"uint256","name":"msgValue","type":"uint256"}],"name":"NotEnoughNative","type":"error"},{"inputs":[],"name":"NotInitializing","type":"error"},{"inputs":[{"internalType":"address","name":"addr","type":"address"}],"name":"OnlyEndpoint","type":"error"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"}],"name":"OnlyPeer","type":"error"},{"inputs":[],"name":"OnlySelf","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"inputs":[{"internalType":"bytes","name":"result","type":"bytes"}],"name":"SimulationResult","type":"error"},{"inputs":[{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"}],"name":"SlippageExceeded","type":"error"},{"inputs":[],"name":"UUPSUnauthorizedCallContext","type":"error"},{"inputs":[{"internalType":"bytes32","name":"slot","type":"bytes32"}],"name":"UUPSUnsupportedProxiableUUID","type":"error"},{"anonymous":false,"inputs":[{"components":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"uint16","name":"msgType","type":"uint16"},{"internalType":"bytes","name":"options","type":"bytes"}],"indexed":false,"internalType":"struct EnforcedOptionParam[]","name":"_enforcedOptions","type":"tuple[]"}],"name":"EnforcedOptionSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"version","type":"uint64"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"inspector","type":"address"}],"name":"MsgInspectorSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"guid","type":"bytes32"},{"indexed":false,"internalType":"uint32","name":"srcEid","type":"uint32"},{"indexed":true,"internalType":"address","name":"toAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountReceivedLD","type":"uint256"}],"name":"OFTReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"guid","type":"bytes32"},{"indexed":false,"internalType":"uint32","name":"dstEid","type":"uint32"},{"indexed":true,"internalType":"address","name":"fromAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountSentLD","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountReceivedLD","type":"uint256"}],"name":"OFTSent","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint32","name":"eid","type":"uint32"},{"indexed":false,"internalType":"bytes32","name":"peer","type":"bytes32"}],"name":"PeerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"preCrimeAddress","type":"address"}],"name":"PreCrimeSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"inputs":[],"name":"SEND","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SEND_AND_CALL","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"UPGRADE_INTERFACE_VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"origin","type":"tuple"}],"name":"allowInitializePath","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"approvalRequired","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint32","name":"_eid","type":"uint32"},{"internalType":"uint16","name":"_msgType","type":"uint16"},{"internalType":"bytes","name":"_extraOptions","type":"bytes"}],"name":"combineOptions","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimalConversionRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"endpoint","outputs":[{"internalType":"contract ILayerZeroEndpointV2","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"uint16","name":"msgType","type":"uint16"}],"name":"enforcedOptions","outputs":[{"internalType":"bytes","name":"enforcedOption","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"address","name":"_lzEndpoint","type":"address"},{"internalType":"address","name":"_delegate","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"","type":"tuple"},{"internalType":"bytes","name":"","type":"bytes"},{"internalType":"address","name":"_sender","type":"address"}],"name":"isComposeMsgSender","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"_eid","type":"uint32"},{"internalType":"bytes32","name":"_peer","type":"bytes32"}],"name":"isPeer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"_origin","type":"tuple"},{"internalType":"bytes32","name":"_guid","type":"bytes32"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"address","name":"_executor","type":"address"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"lzReceive","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"origin","type":"tuple"},{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"address","name":"receiver","type":"address"},{"internalType":"bytes32","name":"guid","type":"bytes32"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"address","name":"executor","type":"address"},{"internalType":"bytes","name":"message","type":"bytes"},{"internalType":"bytes","name":"extraData","type":"bytes"}],"internalType":"struct InboundPacket[]","name":"_packets","type":"tuple[]"}],"name":"lzReceiveAndRevert","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"srcEid","type":"uint32"},{"internalType":"bytes32","name":"sender","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"}],"internalType":"struct Origin","name":"_origin","type":"tuple"},{"internalType":"bytes32","name":"_guid","type":"bytes32"},{"internalType":"bytes","name":"_message","type":"bytes"},{"internalType":"address","name":"_executor","type":"address"},{"internalType":"bytes","name":"_extraData","type":"bytes"}],"name":"lzReceiveSimulate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"msgInspector","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"nextNonce","outputs":[{"internalType":"uint64","name":"nonce","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oApp","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"oAppVersion","outputs":[{"internalType":"uint64","name":"senderVersion","type":"uint64"},{"internalType":"uint64","name":"receiverVersion","type":"uint64"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"oftVersion","outputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"},{"internalType":"uint64","name":"version","type":"uint64"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint32","name":"eid","type":"uint32"}],"name":"peers","outputs":[{"internalType":"bytes32","name":"peer","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"preCrime","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"proxiableUUID","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"bytes32","name":"to","type":"bytes32"},{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"bytes","name":"extraOptions","type":"bytes"},{"internalType":"bytes","name":"composeMsg","type":"bytes"},{"internalType":"bytes","name":"oftCmd","type":"bytes"}],"internalType":"struct SendParam","name":"_sendParam","type":"tuple"}],"name":"quoteOFT","outputs":[{"components":[{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"uint256","name":"maxAmountLD","type":"uint256"}],"internalType":"struct OFTLimit","name":"oftLimit","type":"tuple"},{"components":[{"internalType":"int256","name":"feeAmountLD","type":"int256"},{"internalType":"string","name":"description","type":"string"}],"internalType":"struct OFTFeeDetail[]","name":"oftFeeDetails","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"amountSentLD","type":"uint256"},{"internalType":"uint256","name":"amountReceivedLD","type":"uint256"}],"internalType":"struct OFTReceipt","name":"oftReceipt","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"bytes32","name":"to","type":"bytes32"},{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"bytes","name":"extraOptions","type":"bytes"},{"internalType":"bytes","name":"composeMsg","type":"bytes"},{"internalType":"bytes","name":"oftCmd","type":"bytes"}],"internalType":"struct SendParam","name":"_sendParam","type":"tuple"},{"internalType":"bool","name":"_payInLzToken","type":"bool"}],"name":"quoteSend","outputs":[{"components":[{"internalType":"uint256","name":"nativeFee","type":"uint256"},{"internalType":"uint256","name":"lzTokenFee","type":"uint256"}],"internalType":"struct MessagingFee","name":"msgFee","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"dstEid","type":"uint32"},{"internalType":"bytes32","name":"to","type":"bytes32"},{"internalType":"uint256","name":"amountLD","type":"uint256"},{"internalType":"uint256","name":"minAmountLD","type":"uint256"},{"internalType":"bytes","name":"extraOptions","type":"bytes"},{"internalType":"bytes","name":"composeMsg","type":"bytes"},{"internalType":"bytes","name":"oftCmd","type":"bytes"}],"internalType":"struct SendParam","name":"_sendParam","type":"tuple"},{"components":[{"internalType":"uint256","name":"nativeFee","type":"uint256"},{"internalType":"uint256","name":"lzTokenFee","type":"uint256"}],"internalType":"struct MessagingFee","name":"_fee","type":"tuple"},{"internalType":"address","name":"_refundAddress","type":"address"}],"name":"send","outputs":[{"components":[{"internalType":"bytes32","name":"guid","type":"bytes32"},{"internalType":"uint64","name":"nonce","type":"uint64"},{"components":[{"internalType":"uint256","name":"nativeFee","type":"uint256"},{"internalType":"uint256","name":"lzTokenFee","type":"uint256"}],"internalType":"struct MessagingFee","name":"fee","type":"tuple"}],"internalType":"struct MessagingReceipt","name":"msgReceipt","type":"tuple"},{"components":[{"internalType":"uint256","name":"amountSentLD","type":"uint256"},{"internalType":"uint256","name":"amountReceivedLD","type":"uint256"}],"internalType":"struct OFTReceipt","name":"oftReceipt","type":"tuple"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_delegate","type":"address"}],"name":"setDelegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint32","name":"eid","type":"uint32"},{"internalType":"uint16","name":"msgType","type":"uint16"},{"internalType":"bytes","name":"options","type":"bytes"}],"internalType":"struct EnforcedOptionParam[]","name":"_enforcedOptions","type":"tuple[]"}],"name":"setEnforcedOptions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_msgInspector","type":"address"}],"name":"setMsgInspector","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint32","name":"_eid","type":"uint32"},{"internalType":"bytes32","name":"_peer","type":"bytes32"}],"name":"setPeer","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_preCrime","type":"address"}],"name":"setPreCrime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sharedDecimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"}] as const;

// OFT Contract ABI (for Arbitrum Sepolia and Base Sepolia)
export const OFT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "implementation",
                "type": "address"
            }
        ],
        "name": "ERC1967InvalidImplementation",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ERC1967NonPayable",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "allowance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientAllowance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "needed",
                "type": "uint256"
            }
        ],
        "name": "ERC20InsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "approver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidApprover",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "receiver",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidReceiver",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSender",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "ERC20InvalidSpender",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidDelegate",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidEndpointCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidInitialization",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidLocalDecimals",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "options",
                "type": "bytes"
            }
        ],
        "name": "InvalidOptions",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "LzTokenUnavailable",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "eid",
                "type": "uint32"
            }
        ],
        "name": "NoPeer",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "msgValue",
                "type": "uint256"
            }
        ],
        "name": "NotEnoughNative",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotInitializing",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "OnlyEndpoint",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "eid",
                "type": "uint32"
            },
            {
                "internalType": "bytes32",
                "name": "sender",
                "type": "bytes32"
            }
        ],
        "name": "OnlyPeer",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "OnlySelf",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "result",
                "type": "bytes"
            }
        ],
        "name": "SimulationResult",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amountLD",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minAmountLD",
                "type": "uint256"
            }
        ],
        "name": "SlippageExceeded",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "UUPSUnauthorizedCallContext",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "slot",
                "type": "bytes32"
            }
        ],
        "name": "UUPSUnsupportedProxiableUUID",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "eid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint16",
                        "name": "msgType",
                        "type": "uint16"
                    },
                    {
                        "internalType": "bytes",
                        "name": "options",
                        "type": "bytes"
                    }
                ],
                "indexed": false,
                "internalType": "struct EnforcedOptionParam[]",
                "name": "_enforcedOptions",
                "type": "tuple[]"
            }
        ],
        "name": "EnforcedOptionSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint64",
                "name": "version",
                "type": "uint64"
            }
        ],
        "name": "Initialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "inspector",
                "type": "address"
            }
        ],
        "name": "MsgInspectorSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "guid",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "srcEid",
                "type": "uint32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "toAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountReceivedLD",
                "type": "uint256"
            }
        ],
        "name": "OFTReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "guid",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "dstEid",
                "type": "uint32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "fromAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountSentLD",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountReceivedLD",
                "type": "uint256"
            }
        ],
        "name": "OFTSent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint32",
                "name": "eid",
                "type": "uint32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "peer",
                "type": "bytes32"
            }
        ],
        "name": "PeerSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "preCrimeAddress",
                "type": "address"
            }
        ],
        "name": "PreCrimeSet",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "implementation",
                "type": "address"
            }
        ],
        "name": "Upgraded",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "SEND",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "SEND_AND_CALL",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "UPGRADE_INTERFACE_VERSION",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "srcEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "sender",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nonce",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Origin",
                "name": "origin",
                "type": "tuple"
            }
        ],
        "name": "allowInitializePath",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "approvalRequired",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_eid",
                "type": "uint32"
            },
            {
                "internalType": "uint16",
                "name": "_msgType",
                "type": "uint16"
            },
            {
                "internalType": "bytes",
                "name": "_extraOptions",
                "type": "bytes"
            }
        ],
        "name": "combineOptions",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimalConversionRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endpoint",
        "outputs": [
            {
                "internalType": "contract ILayerZeroEndpointV2",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "eid",
                "type": "uint32"
            },
            {
                "internalType": "uint16",
                "name": "msgType",
                "type": "uint16"
            }
        ],
        "name": "enforcedOptions",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "enforcedOption",
                "type": "bytes"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_lzEndpoint",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_delegate",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "srcEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "sender",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nonce",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Origin",
                "name": "",
                "type": "tuple"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            },
            {
                "internalType": "address",
                "name": "_sender",
                "type": "address"
            }
        ],
        "name": "isComposeMsgSender",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_eid",
                "type": "uint32"
            },
            {
                "internalType": "bytes32",
                "name": "_peer",
                "type": "bytes32"
            }
        ],
        "name": "isPeer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "srcEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "sender",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nonce",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Origin",
                "name": "_origin",
                "type": "tuple"
            },
            {
                "internalType": "bytes32",
                "name": "_guid",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "_message",
                "type": "bytes"
            },
            {
                "internalType": "address",
                "name": "_executor",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "_extraData",
                "type": "bytes"
            }
        ],
        "name": "lzReceive",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint32",
                                "name": "srcEid",
                                "type": "uint32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "sender",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint64",
                                "name": "nonce",
                                "type": "uint64"
                            }
                        ],
                        "internalType": "struct Origin",
                        "name": "origin",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint32",
                        "name": "dstEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "guid",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "value",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "executor",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "message",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "extraData",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct InboundPacket[]",
                "name": "_packets",
                "type": "tuple[]"
            }
        ],
        "name": "lzReceiveAndRevert",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "srcEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "sender",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nonce",
                        "type": "uint64"
                    }
                ],
                "internalType": "struct Origin",
                "name": "_origin",
                "type": "tuple"
            },
            {
                "internalType": "bytes32",
                "name": "_guid",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "_message",
                "type": "bytes"
            },
            {
                "internalType": "address",
                "name": "_executor",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "_extraData",
                "type": "bytes"
            }
        ],
        "name": "lzReceiveSimulate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "msgInspector",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            },
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "nextNonce",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "nonce",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "oApp",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "oAppVersion",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "senderVersion",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "receiverVersion",
                "type": "uint64"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "oftVersion",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            },
            {
                "internalType": "uint64",
                "name": "version",
                "type": "uint64"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "eid",
                "type": "uint32"
            }
        ],
        "name": "peers",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "peer",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "preCrime",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "proxiableUUID",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "dstEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "to",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minAmountLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "extraOptions",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "composeMsg",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "oftCmd",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct SendParam",
                "name": "_sendParam",
                "type": "tuple"
            }
        ],
        "name": "quoteOFT",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "minAmountLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxAmountLD",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct OFTLimit",
                "name": "oftLimit",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "int256",
                        "name": "feeAmountLD",
                        "type": "int256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    }
                ],
                "internalType": "struct OFTFeeDetail[]",
                "name": "oftFeeDetails",
                "type": "tuple[]"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amountSentLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountReceivedLD",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct OFTReceipt",
                "name": "oftReceipt",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "dstEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "to",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minAmountLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "extraOptions",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "composeMsg",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "oftCmd",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct SendParam",
                "name": "_sendParam",
                "type": "tuple"
            },
            {
                "internalType": "bool",
                "name": "_payInLzToken",
                "type": "bool"
            }
        ],
        "name": "quoteSend",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "nativeFee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lzTokenFee",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct MessagingFee",
                "name": "msgFee",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "dstEid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "to",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minAmountLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "extraOptions",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "composeMsg",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "oftCmd",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct SendParam",
                "name": "_sendParam",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "nativeFee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "lzTokenFee",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct MessagingFee",
                "name": "_fee",
                "type": "tuple"
            },
            {
                "internalType": "address",
                "name": "_refundAddress",
                "type": "address"
            }
        ],
        "name": "send",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "guid",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "nonce",
                        "type": "uint64"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "nativeFee",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lzTokenFee",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct MessagingFee",
                        "name": "fee",
                        "type": "tuple"
                    }
                ],
                "internalType": "struct MessagingReceipt",
                "name": "msgReceipt",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "amountSentLD",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amountReceivedLD",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct OFTReceipt",
                "name": "oftReceipt",
                "type": "tuple"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_delegate",
                "type": "address"
            }
        ],
        "name": "setDelegate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint32",
                        "name": "eid",
                        "type": "uint32"
                    },
                    {
                        "internalType": "uint16",
                        "name": "msgType",
                        "type": "uint16"
                    },
                    {
                        "internalType": "bytes",
                        "name": "options",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct EnforcedOptionParam[]",
                "name": "_enforcedOptions",
                "type": "tuple[]"
            }
        ],
        "name": "setEnforcedOptions",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_msgInspector",
                "type": "address"
            }
        ],
        "name": "setMsgInspector",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_eid",
                "type": "uint32"
            },
            {
                "internalType": "bytes32",
                "name": "_peer",
                "type": "bytes32"
            }
        ],
        "name": "setPeer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_preCrime",
                "type": "address"
            }
        ],
        "name": "setPreCrime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sharedDecimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newImplementation",
                "type": "address"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "upgradeToAndCall",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
] as const;

// Payload Types
export const PayloadTypes = {
    LZ_RECEIVE: 0,
    STAKE_ORDER: 1,
    UNSTAKE_ORDER: 2,
    WITHDRAW_ORDER: 3,
    CLAIM_REWARD: 4
} as const;
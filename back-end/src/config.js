// Configuration constants for the Omakase backend

// RPC Configuration
const RPC_URL = {
  mainnet: "https://mainnet.gateway.tenderly.co",
  base: "https://base.gateway.tenderly.co",
  arbitrum: "https://arbitrum.gateway.tenderly.co",
  sepolia: "https://sepolia.gateway.tenderly.co",
  baseSepolia: "https://base-sepolia.gateway.tenderly.co",
  arbitrumSepolia: "https://arbitrum-sepolia.gateway.tenderly.co",
};
// Contract Configuration
const CONTRACT_ADDRESS = {
  mainnet: "0xbd3fa81b58ba92a82136038b25adec7066af3155",
  base: "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
  arbitrum: "0x19330d10D9Cc8751218eaf51E8885D058642E08A",
  sepolia: "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
  baseSepolia: "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
  arbitrumSepolia: "0x1682Ae6375C4E4A97e4B583BC394c861A46D8962",
};
const EVENT_NAME = "DepositForBurn";

// Contract ABI - Minimal ABI for Token Messenger
const ABI = [
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "message", type: "bytes" }],
    name: "MessageSent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "nonce", type: "uint64" },
      { indexed: true, name: "burnToken", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: true, name: "depositor", type: "address" },
      { indexed: false, name: "mintRecipient", type: "bytes32" },
      { indexed: false, name: "destinationDomain", type: "uint32" },
      { indexed: false, name: "destinationTokenMessenger", type: "bytes32" },
      { indexed: false, name: "destinationCaller", type: "bytes32" },
    ],
    name: "DepositForBurn",
    type: "event",
  },
];

module.exports = {
  RPC_URL,
  CONTRACT_ADDRESS,
  EVENT_NAME,
  ABI,
};

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

const USDC_ADDRESS = {
  sepolia: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238",
  baseSepolia: "0x036cbd53842c5426634e7929541ec2318f3dcf7e",
  arbitrumSepolia: "0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d",
};

const DOMAIN_ID = {
  sepolia: 0,
  baseSepolia: 6,
  arbitrumSepolia: 3,
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
  USDC_ADDRESS,
  DOMAIN_ID,
  EVENT_NAME,
  ABI,
};

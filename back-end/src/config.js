// Configuration constants for the Omakase backend

// RPC Configuration
const RPC_URL = {
  sepolia: "https://sepolia.gateway.tenderly.co",
  baseSepolia: "https://base-sepolia.gateway.tenderly.co",
  arbitrumSepolia: "https://arbitrum-sepolia.gateway.tenderly.co",
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

const DOMAIN_ID_MAP = {
  0: "sepolia",
  6: "baseSepolia",
  3: "arbitrumSepolia",
};

const EVENT_NAME = "BurnUSDC";

// Contract ABI - Minimal ABI for Token Messenger
const ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "chainId", type: "uint256" },
      { indexed: true, name: "domainId", type: "uint32" },
      { indexed: true, name: "mintRecipient", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "BurnUSDC",
    type: "event",
  },
];

module.exports = {
  RPC_URL,
  USDC_ADDRESS,
  DOMAIN_ID,
  DOMAIN_ID_MAP,
  EVENT_NAME,
  ABI,
};

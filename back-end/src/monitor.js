// Import environment variables
require("dotenv").config();
const { ethers } = require("ethers");
const { createWalletClient, http, encodeFunctionData } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { sepolia, baseSepolia, arbitrumSepolia } = require("viem/chains");
const axios = require("axios");
const {
  DOMAIN_ID,
  DOMAIN_ID_MAP,
  RPC_URL,
  EVENT_NAME,
  ABI,
  EXPLORER_URL,
} = require("./config");

// ============ Configuration Constants ============

// Authentication
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
// Set up wallet clients
const sepoliaClient = createWalletClient({
  chain: sepolia,
  transport: http(),
  account,
});
const baseSepoliaClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
  account,
});
const arbitrumSepoliaClient = createWalletClient({
  chain: arbitrumSepolia,
  transport: http(),
  account,
});

const CLIENTS = {
  sepolia: sepoliaClient,
  baseSepolia: baseSepoliaClient,
  arbitrumSepolia: arbitrumSepoliaClient,
};

// Contract Addresses
const SEPOLIA_TOKEN_MESSENGER = "0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa";
const SEPOLIA_MESSAGE_TRANSMITTER =
  "0xe737e5cebeeba77efe34d4aa090756590b1ce275";
const SEPOLIA_CHEF = "0xcaa8340AA4a760cF83D9e712597AD045fA1b3C50";

async function retrieveAttestation(srcNetwork, transactionHash) {
  console.log("Retrieving attestation...");
  const domain = DOMAIN_ID[srcNetwork];
  const url = `https://iris-api-sandbox.circle.com/v2/messages/${domain}?transactionHash=${transactionHash}`;
  console.log("iris url: ", url);
  while (true) {
    try {
      const response = await axios.get(url);
      if (response.status === 404) {
        console.log("Waiting for attestation...");
      }
      if (response.data?.messages?.[0]?.status === "complete") {
        console.log("Attestation retrieved successfully!");
        return response.data.messages[0];
      }
      console.log("Waiting for attestation...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } catch (error) {
      console.error("Error fetching attestation:", error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

async function mintUSDC(srcNetwork, domainId, attestation) {
  console.log(`Minting USDC on ${srcNetwork}...`);
  const srcClient = CLIENTS[srcNetwork];
  const mintTx = await srcClient.sendTransaction({
    to: SEPOLIA_CHEF,
    data: encodeFunctionData({
      abi: [
        {
          type: "function",
          name: "sendReward",
          stateMutability: "nonpayable",
          inputs: [
            { name: "_domainId", type: "uint32" },
            { name: "_message", type: "bytes" },
            { name: "_attestation", type: "bytes" },
          ],
          outputs: [],
        },
      ],
      functionName: "sendReward",
      args: [domainId, attestation.message, attestation.attestation],
    }),
  });
  console.log(`Mint Tx: ${EXPLORER_URL[srcNetwork]}/tx/${mintTx}`);
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

async function monitorEvents(network) {
  try {
    console.log(`🔗 Connecting to ${network}...`);
    const provider = new ethers.JsonRpcProvider(RPC_URL[network]);
    const contract = new ethers.Contract(SEPOLIA_CHEF, ABI, provider);

    console.log("✅ Connected! Monitoring for BurnUSDC events...");
    console.log("📊 Contract:", SEPOLIA_CHEF);
    console.log("🛑 Press Ctrl+C to stop\n");

    // Listen for BurnUSDC events
    contract.on(
      EVENT_NAME,
      async (chainId, domainId, mintRecipient, amount, event) => {
        console.log(`💸 BurnUSDC event detected!! `);

        console.log(
          `event txHash: ${event.log.transactionHash}, blockNumber: ${event.log.blockNumber}`
        );
        console.log(
          `event Tx: ${EXPLORER_URL[network]}/tx/${event.log.transactionHash}`
        );
        console.log(`Chain ID: ${chainId}`);
        console.log(`Domain ID: ${domainId}`);
        console.log(`Mint Recipient: ${mintRecipient}`);
        console.log(`Amount: ${amount}`);

        const attestation = await retrieveAttestation(
          network,
          event.log.transactionHash
        );
        const dstNetwork = DOMAIN_ID_MAP[domainId];
        console.log("dstNetwork: ", dstNetwork);
        await mintUSDC(network, domainId, attestation);
        console.log("\n");
      }
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Start monitoring
monitorEvents("baseSepolia");

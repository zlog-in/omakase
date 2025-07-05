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

async function retrieveAttestation(srcNetwork, transactionHash) {
  console.log("Retrieving attestation...");
  const domain = DOMAIN_ID[srcNetwork];
  const url = `https://iris-api-sandbox.circle.com/v2/messages/${domain}?transactionHash=${transactionHash}`;
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

async function mintUSDC(dstNetwork, attestation) {
  console.log(`Minting USDC on ${dstNetwork}...`);
  const dstClient = CLIENTS[dstNetwork];
  const mintTx = await dstClient.sendTransaction({
    to: SEPOLIA_MESSAGE_TRANSMITTER,
    data: encodeFunctionData({
      abi: [
        {
          type: "function",
          name: "receiveMessage",
          stateMutability: "nonpayable",
          inputs: [
            { name: "message", type: "bytes" },
            { name: "attestation", type: "bytes" },
          ],
          outputs: [],
        },
      ],
      functionName: "receiveMessage",
      args: [attestation.message, attestation.attestation],
    }),
  });
  console.log(`Mint Tx: ${mintTx}`);
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

async function monitorEvents(network) {
  try {
    console.log(`🔗 Connecting to ${network}...`);
    const provider = new ethers.JsonRpcProvider(RPC_URL[network]);
    const contract = new ethers.Contract(
      SEPOLIA_TOKEN_MESSENGER,
      ABI,
      provider
    );

    console.log("✅ Connected! Monitoring for DepositForBurn events...");
    console.log("📊 Contract:", SEPOLIA_TOKEN_MESSENGER);
    console.log("🛑 Press Ctrl+C to stop\n");

    // Listen for DepositForBurn events
    contract.on(
      EVENT_NAME,
      async (
        burnToken,
        amount,
        depositor,
        mintRecipient,
        destinationDomain,
        destinationTokenMessenger,
        destinationCaller,
        maxFee,
        minFinalityThreshold,
        hookData,
        event
      ) => {
        console.log(`💸 DepositForBurn event detected!! `);

        console.log(
          `event txHash: ${event.log.transactionHash}, blockNumber: ${event.log.blockNumber}`
        );
        console.log(`Burn Token: ${burnToken}`);
        console.log(`Amount: ${amount}`);
        console.log(`Depositor: ${depositor}`);
        console.log(`Mint Recipient: ${mintRecipient}`);
        console.log(`Destination Domain: ${destinationDomain}`);
        console.log(
          `Destination Token Messenger: ${destinationTokenMessenger}`
        );
        console.log(`Destination Caller: ${destinationCaller}`);
        console.log(`Max Fee: ${maxFee}`);
        console.log(`Min Finality Threshold: ${minFinalityThreshold}`);
        console.log(`Hook Data: ${hookData}`);

        const attestation = await retrieveAttestation(
          network,
          event.log.transactionHash
        );
        const dstNetwork = DOMAIN_ID_MAP[destinationDomain];
        console.log("dstNetwork: ", dstNetwork);
        await mintUSDC(dstNetwork, attestation);
        console.log("\n");
      }
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Start monitoring
monitorEvents("sepolia");

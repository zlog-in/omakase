// Import environment variables
import "dotenv/config";
import { createWalletClient, http, encodeFunctionData, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  sepolia,
  baseSepolia,
  avalancheFuji,
  arbitrumSepolia,
} from "viem/chains";
import axios from "axios";

// ============ Configuration Constants ============

// Authentication
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);

// Contract Addresses
const ETHEREUM_SEPOLIA_USDC = "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238";
const BASE_SEPOLIA_USDC = "0x036cbd53842c5426634e7929541ec2318f3dcf7e";
const ARBITRUM_SEPOLIA_USDC = "0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d";
const SEPOLIA_TOKEN_MESSENGER = "0x8fe6b999dc680ccfdd5bf7eb0974218be2542daa";
const SEPOLIA_MESSAGE_TRANSMITTER =
  "0xe737e5cebeeba77efe34d4aa090756590b1ce275";

// Transfer Parameters
const DESTINATION_ADDRESS = "0x8EAaa6731dc142CBb8Fb89E5Cc0e8c73F77BB685"; // Address to receive minted tokens on destination chain
const AMOUNT = 1_000_000n; // Set transfer amount in 10^6 subunits (1 USDC; change as needed)
const maxFee = 500n; // Set fast transfer max fee in 10^6 subunits (0.0005 USDC; change as needed)

// Bytes32 Formatted Parameters
const DESTINATION_ADDRESS_BYTES32 = `0x000000000000000000000000${DESTINATION_ADDRESS.slice(
  2
)}`; // Destination address in bytes32 format
const DESTINATION_CALLER_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000"; // Empty bytes32 allows any address to call MessageTransmitterV2.receiveMessage()

// Chain-specific Parameters
const ETHEREUM_SEPOLIA_DOMAIN = 0; // Source domain ID for Ethereum Sepolia testnet
const AVALANCHE_FUJI_DOMAIN = 1; // Destination domain ID for Avalanche Fuji testnet
const ARBITRUM_SEPOLIA_DOMAIN = 3; // Destination domain ID for Arbitrum Sepolia testnet
const BASE_SEPOLIA_DOMAIN = 6; // Destination domain ID for Base Sepolia testnet

// Set up wallet clients
const sepoliaClient = createWalletClient({
  chain: sepolia,
  transport: http(),
  account,
});
const avalancheClient = createWalletClient({
  chain: avalancheFuji,
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

// Helper function to get current nonce
async function getCurrentNonce(client) {
  return await client.getTransactionCount({ address: account.address });
}

// Helper function to wait for transaction confirmation
async function waitForTransaction(client, hash) {
  console.log(`Waiting for transaction ${hash} to be confirmed...`);
  const receipt = await client.waitForTransactionReceipt({ hash });
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  return receipt;
}

async function approveUSDC() {
  console.log("Approving USDC transfer...");

  const approveTx = await arbitrumSepoliaClient.sendTransaction({
    to: ARBITRUM_SEPOLIA_USDC,
    data: encodeFunctionData({
      abi: [
        {
          type: "function",
          name: "approve",
          stateMutability: "nonpayable",
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          outputs: [{ name: "", type: "bool" }],
        },
      ],
      functionName: "approve",
      args: [SEPOLIA_TOKEN_MESSENGER, 10_000_000_000n], // Set max allowance in 10^6 subunits (10,000 USDC; change as needed)
    }),
  });
  console.log(`USDC Approval Tx: ${approveTx}`);

  await new Promise((resolve) => setTimeout(resolve, 5000));
}

async function burnUSDC() {
  console.log("Burning USDC on Arbitrum Sepolia...");

  // const nonce = await getCurrentNonce(baseSepoliaClient);
  // console.log(`Using nonce: ${nonce}`);

  const burnTx = await arbitrumSepoliaClient.sendTransaction({
    to: SEPOLIA_TOKEN_MESSENGER,
    data: encodeFunctionData({
      abi: [
        {
          type: "function",
          name: "depositForBurn",
          stateMutability: "nonpayable",
          inputs: [
            { name: "amount", type: "uint256" },
            { name: "destinationDomain", type: "uint32" },
            { name: "mintRecipient", type: "bytes32" },
            { name: "burnToken", type: "address" },
            { name: "destinationCaller", type: "bytes32" },
            { name: "maxFee", type: "uint256" },
            { name: "minFinalityThreshold", type: "uint32" },
          ],
          outputs: [],
        },
      ],
      functionName: "depositForBurn",
      args: [
        AMOUNT,
        ETHEREUM_SEPOLIA_DOMAIN,
        DESTINATION_ADDRESS_BYTES32,
        ARBITRUM_SEPOLIA_USDC,
        DESTINATION_CALLER_BYTES32,
        maxFee,
        1000, // minFinalityThreshold (1000 or less for Fast Transfer)
      ],
    }),
  });

  console.log(`Burn Tx: ${burnTx}`);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return burnTx;
}

async function retrieveAttestation(transactionHash) {
  console.log("Retrieving attestation...");
  const url = `https://iris-api-sandbox.circle.com/v2/messages/${ARBITRUM_SEPOLIA_DOMAIN}?transactionHash=${transactionHash}`;
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

async function mintUSDC(attestation) {
  console.log("Minting USDC on Sepolia...");
  const mintTx = await sepoliaClient.sendTransaction({
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

async function main() {
  await approveUSDC();
  const burnTx = await burnUSDC();
  const attestation = await retrieveAttestation(burnTx);
  await mintUSDC(attestation);
  console.log("USDC transfer completed!");
}

main().catch(console.error);

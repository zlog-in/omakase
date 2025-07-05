// Import environment variables
require("dotenv").config();
const { createWalletClient, http, encodeFunctionData } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const { sepolia, baseSepolia, arbitrumSepolia } = require("viem/chains");
const { USDC_ADDRESS, DOMAIN_ID } = require("./config");

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

async function approveUSDC(srcNetwork) {
  console.log(`Approving USDC transfer on ${srcNetwork}...`);
  const srcClient = CLIENTS[srcNetwork];
  const approveTx = await srcClient.sendTransaction({
    to: USDC_ADDRESS[srcNetwork],
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

async function burnUSDC(srcNetwork, dstNetwork) {
  console.log(`Burning USDC on ${srcNetwork}...`);
  const srcClient = CLIENTS[srcNetwork];
  const burnTx = await srcClient.sendTransaction({
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
        DOMAIN_ID[dstNetwork],
        DESTINATION_ADDRESS_BYTES32,
        USDC_ADDRESS[srcNetwork],
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

async function main(srcNetwork, dstNetwork) {
  await approveUSDC(srcNetwork);
  const burnTx = await burnUSDC(srcNetwork, dstNetwork);
  console.log("USDC transfer completed!");
}

main("baseSepolia", "sepolia").catch(console.error);

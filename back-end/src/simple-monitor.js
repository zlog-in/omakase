const { ethers } = require("ethers");

// Configuration - edit these values
const RPC_URL =
  "https://eth-mainnet.g.alchemy.com/v2/-Z5IK5ZknQgG4obvaW3fCSA92G8-5CPE"; // Replace with your RPC URL
const CONTRACT_ADDRESS = "0xbd3fa81b58ba92a82136038b25adec7066af3155"; // Token Messenger
const EVENT_NAME = "DepositForBurn";

// Minimal ABI for Transfer events
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

async function monitorEvents() {
  try {
    console.log("🔗 Connecting to Ethereum...");
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    console.log("✅ Connected! Monitoring for DepositForBurn events...");
    console.log("📊 Contract:", CONTRACT_ADDRESS);
    console.log("🛑 Press Ctrl+C to stop\n");

    // Listen for DepositForBurn events
    contract.on(
      EVENT_NAME,
      (
        nonce,
        burnToken,
        amount,
        depositor,
        mintRecipient,
        destinationDomain,
        destinationTokenMessenger,
        destinationCaller,
        event
      ) => {
        console.log(
          `💸 DepositForBurn: ${nonce}`,
          `Burn Token: ${burnToken}`,
          `Amount: ${amount}`,
          `Depositor: ${depositor}`,
          `Mint Recipient: ${mintRecipient}`,
          `Destination Domain: ${destinationDomain}`,
          `Destination Token Messenger: ${destinationTokenMessenger}`,
          `Destination Caller: ${destinationCaller}`
        );
        console.log("event txHash: ", event.log.transactionHash);
        console.log("event blockNumber: ", event.log.blockNumber);
      }
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping monitor...");
  process.exit(0);
});

// Start monitoring
monitorEvents();

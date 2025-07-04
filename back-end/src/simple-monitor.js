const { ethers } = require("ethers");
const { RPC_URL, CONTRACT_ADDRESS, EVENT_NAME, ABI } = require("./config");

async function getBurnMsgHash(network, burnHash) {
  const provider = new ethers.JsonRpcProvider(RPC_URL[network]);
  const burnReceipt = await provider.getTransactionReceipt(burnHash);
  const burnEventSignature = "MessageSent(bytes)";
  const burnEventTopic = ethers.id(burnEventSignature);
  const log = burnReceipt.logs.find((l) => l.topics[0] === burnEventTopic);

  const iface = new ethers.Interface([`event ${burnEventSignature}`]);
  const event = iface.parseLog(log);
  const messageBytes = event.args[0];

  // 计算消息的哈希值
  const messageHash = ethers.keccak256(messageBytes);
  console.log(`Burn Message hash: ${messageHash}`);
  console.log(`Burn Message bytes: ${messageBytes}`);
  return {
    bytes: messageBytes,
    hash: messageHash,
  };
}

async function getAttestation(msgHash) {
  let attestationResponse = { status: "pending" };
  while (attestationResponse.status != "complete") {
    const response = await fetch(
      `https://iris-api-sandbox.circle.com/attestations/${msgHash}`
    );
    attestationResponse = await response.json();
    console.log("Waiting for attestation...");
    await new Promise((r) => setTimeout(r, 5000));
  }
  console.log(`Attestation: ${attestationResponse.attestation}`);
  return attestationResponse.attestation;
}

async function mintUSDC(dstNetwork, msgBytes, attestation) {
  const provider = new ethers.JsonRpcProvider(rpc[dstNetwork]);
  const wallet = new ethers.Wallet(process.env.PK, provider);
  const nonce = await provider.getTransactionCount(wallet.address, "latest");
  const MessageTransmitter = new ethers.Contract(
    cctp[dstNetwork]["MessageTransmitter"]["address"],
    cctp[dstNetwork]["MessageTransmitter"]["abi"],
    wallet
  );
  const mintTx = await MessageTransmitter.receiveMessage(msgBytes, attestation);
  console.log(`Minted USDC on ${dstNetwork}: ${mintTx.hash}`);
  return mintTx.hash;
}

async function monitorEvents(network) {
  try {
    console.log(`🔗 Connecting to ${network}...`);
    const provider = new ethers.JsonRpcProvider(RPC_URL[network]);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS[network],
      ABI,
      provider
    );

    console.log("✅ Connected! Monitoring for DepositForBurn events...");
    console.log("📊 Contract:", CONTRACT_ADDRESS[network]);
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

        const message = getBurnMsgHash(network, event.log.transactionHash);
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
monitorEvents("arbitrum");

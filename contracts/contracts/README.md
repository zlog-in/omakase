## Contracts

The Omakase protocol is a cross-chain staking protocol that allows users to stake their tokens from different chains to the same chain.

The Omakase protocol is built on top of the OFT protocol. It employs the OFT Compose Pattern to relay messages between chains, meanwhile the OFT token is bridged as well.

```
+--------+        +-----+                                  
| Waiter +--------+ OFT +------------+                     
+--------+        +-----+            |                     
                                     |                     
                                  +--+--+          +------+
                                  | OFT +----------+ Chef |
                                  +--+--+          +------+
                                     |                     
+--------+        +-----+            |                     
| Waiter +--------+ OFT +------------+                     
+--------+        +-----+                                  
```

The StakePool contract (called `Chef`) is the main contract that operates the staking flow, and it settled on Hub chain.

The Stake entrypoint contract (called `Waiter`) is the contract that provides the interfaces for users to stake, unstake, withdraw tokens, claim rewards. It is deployed on holder chains.

## Contract Addresses

The deployed contract addresses on different networks are as follows:

```json
"sepolia": {
      "Omakase": "0x2dA943A5E008b9A85aA0E80F0d7d8d53a4945b2D",
      "Adapter": "0x5132f64f01140C4EfCdEbfcFe769c69E023cd694",
      "Waiter": "0xCccBc8e303E254c854bC132A5c9e4d477b6288c8"
},
"arbitrumsepolia": {
    "OFT": "0x3b6Be820c586B7235e19c7956e9408879A0F6065",
    "Waiter": "0xCccBc8e303E254c854bC132A5c9e4d477b6288c8"
},
"basesepolia": {
    "OFT": "0x3b6Be820c586B7235e19c7956e9408879A0F6065",
    "Chef": "0xcaa8340AA4a760cF83D9e712597AD045fA1b3C50"
}
```

### User Flows

### Stake

### Unstake


### Withdraw

### Claim Reward

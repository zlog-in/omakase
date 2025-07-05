// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IChef {
    event TokenStaked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event TokenUnstaked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event TokenWithdrawn(uint256 indexed chainId, address indexed staker, uint256 amount);
    event RewardClaimed(uint256 indexed chainId, address indexed staker, uint256 amount);
    event RewardSent(uint256 indexed chainId, address indexed staker, uint256 amount);

    // =============================== CCTP Functions ===============================
    function sendReward(uint32 _domainId, bytes calldata _message, bytes calldata _attestation) external;
}

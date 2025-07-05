// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IChef {
    event TokenStaked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event TokenUnstaked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event TokenWithdrawn(uint256 indexed chainId, address indexed staker, uint256 amount);
    event RewardClaimed(uint256 indexed chainId, address indexed staker, uint256 amount);
    event RewardSent(uint256 indexed chainId, address indexed staker, uint256 amount);

    // =============================== View Functions ===============================
    function getTotalStakedAmount() external view returns (uint256);
    function getStakedAmount(address _staker) external view returns (uint256);
    function getUnstakeLockTime(address _staker) external view returns (uint256);
    function getReward(address _staker) external view returns (uint256);

    // =============================== CCTP Functions ===============================
    function sendReward(uint256 _chainId, bytes calldata _message, bytes calldata _attestation) external;

    // =============================== Admin Functions ===============================
    function setToken(address _token) external;
    function setOFT(address _oft) external;
}

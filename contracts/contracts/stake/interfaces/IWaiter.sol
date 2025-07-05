// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWaiter {
    event StakeSent(address indexed staker, uint256 amount);
    event UnstakeSent(address indexed staker);
    event WithdrawSent(address indexed staker);
    event WithdrawFinished(address indexed staker, uint256 amount);
    event ClaimSent(address indexed staker, uint256 amount);
    event ClaimFinished(address indexed staker, uint256 amount);

    // =============================== User Functions ===============================
    function stake(uint256 _amount) external payable;
    function unstake() external payable;
    function withdraw() external payable;
    function claim() external payable;

    // =============================== CCPT Functions ===============================
    function receiveReward(bytes calldata _message, bytes calldata _attestation) external;

    // =============================== Admin Functions ===============================
    function setToken(address _token) external;
    function setOFT(address _oft) external;
}

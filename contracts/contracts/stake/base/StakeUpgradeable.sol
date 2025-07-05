// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CCTPHandlerUpgradeable} from "./CCTPHandlerUpgradeable.sol";
import {IOFT} from "../../layerzerolabs/lz-evm-oapp-v2/contracts/oft/interfaces/IOFT.sol";

abstract contract StakeUpgradeable is CCTPHandlerUpgradeable {
    struct StakeInfo {
        uint256 stakeAmount;
        uint256 stakeReward;
        uint256 lastStakeTime;
        uint256 lastUnstakeTime;
    }

    event Staked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event Unstaked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event Withdrawn(uint256 indexed chainId, address indexed staker, uint256 amount);
    event Claimed(uint256 indexed chainId, address indexed staker, uint256 amount);

    uint256 public constant UNSTAKE_PERIOD = 15 seconds;
    uint256 public constant STAKE_REWARD_RATE = 100; // 1 BP of USDC (6 decimals) per second

    mapping(address => StakeInfo) public userStakeInfo;
    uint256 public totalStakedAmount;

    uint256[47] private __gap;

    // =============================== View Functions for Front-End ===============================
    function getUserReward(address _staker) public view returns (uint256) {
        return _getUserReward(_staker);
    }

    function getUserStakeInfo(address _staker) public view returns (StakeInfo memory) {
        return userStakeInfo[_staker];
    }

    function getTotalStakedAmount() public view returns (uint256) {
        return totalStakedAmount;
    }

    function getUserUnstakeLockTime(address _staker) public view returns (uint256) {
        require(userStakeInfo[_staker].lastUnstakeTime > 0, "Stake: No Unstake request in processing");
        uint256 unlockedTime = block.timestamp - userStakeInfo[_staker].lastUnstakeTime;
        return unlockedTime < UNSTAKE_PERIOD ? UNSTAKE_PERIOD - unlockedTime : 0;
    }

    function _stake(uint256 _chainId, address _staker, uint256 _amount) internal {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        stakeInfo.stakeReward += stakeInfo.stakeAmount * STAKE_REWARD_RATE * (block.timestamp - stakeInfo.lastStakeTime)
            / (10 ** IOFT(oft).sharedDecimals());
        stakeInfo.stakeAmount += _amount;
        stakeInfo.lastStakeTime = block.timestamp;
        stakeInfo.lastUnstakeTime = 0;
        totalStakedAmount += _amount;

        emit Staked(_chainId, _staker, _amount);
    }

    function _unstake(uint256 _chainId, address _staker) internal {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        require(stakeInfo.lastUnstakeTime == 0, "Stake: already unstaked");

        stakeInfo.stakeReward += stakeInfo.stakeAmount * STAKE_REWARD_RATE * (block.timestamp - stakeInfo.lastStakeTime)
            / (10 ** IOFT(oft).sharedDecimals());
        stakeInfo.lastUnstakeTime = block.timestamp;

        emit Unstaked(_chainId, _staker, stakeInfo.stakeAmount);
    }

    function _withdraw(uint256 _chainId, address _staker) internal returns (uint256) {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        require(block.timestamp - stakeInfo.lastUnstakeTime >= UNSTAKE_PERIOD, "Chef: Unstake period not passed");
        uint256 amount = stakeInfo.stakeAmount;
        stakeInfo.stakeAmount = 0;
        stakeInfo.lastStakeTime = 0;
        stakeInfo.lastUnstakeTime = 0;
        totalStakedAmount -= amount;
        emit Withdrawn(_chainId, _staker, amount);
        return amount;
    }

    function _claim(uint256 _chainId, address _staker) internal {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        uint256 reward = _getUserReward(_staker);
        stakeInfo.stakeReward = 0;
        stakeInfo.lastUnstakeTime = 0;
        _burnUSDC(_chainId, _staker, reward);

        emit Claimed(_chainId, _staker, reward);
    }

    function _getUserReward(address _staker) internal view returns (uint256) {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        return stakeInfo.stakeReward
            + stakeInfo.stakeAmount * STAKE_REWARD_RATE * (block.timestamp - stakeInfo.lastStakeTime)
                / (10 ** IOFT(oft).sharedDecimals());
    }
}

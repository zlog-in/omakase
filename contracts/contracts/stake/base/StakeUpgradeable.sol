// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BaseContractUpgradeable} from "./BaseContractUpgradeable.sol";
import {IOFT} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/interfaces/IOFT.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract StakeUpgradeable is BaseContractUpgradeable {
    struct StakeInfo {
        uint256 amount;
        uint256 reward;
        uint256 lastStakedTime;
        uint256 lastUnstakedTime;
    }

    event Staked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event Unstaked(uint256 indexed chainId, address indexed staker, uint256 amount);
    event Withdrawn(uint256 indexed chainId, address indexed staker, uint256 amount);
    event Claimed(uint256 indexed chainId, address indexed staker, uint256 amount);

    uint256 public constant UNSTAKE_PERIOD = 15 seconds;
    uint256 public constant STAKE_REWARD_RATE = 100; // 1 BP of USDC (6 decimals) per second

    mapping(address => StakeInfo) public userStakeInfo;
    uint256 public totalStakedAmount;
    IERC20 public usdc;

    uint256[50] private __gap;

    function getUserReward(address _staker) public view returns (uint256) {
        return _getUserReward(_staker);
    }

    function _stake(uint256 _chainId, address _staker, uint256 _amount) internal {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        stakeInfo.reward += stakeInfo.amount * STAKE_REWARD_RATE * (block.timestamp - stakeInfo.lastStakedTime)
            / IOFT(oft).sharedDecimals();
        stakeInfo.amount += _amount;
        stakeInfo.lastStakedTime = block.timestamp;
        stakeInfo.lastUnstakedTime = 0;
        totalStakedAmount += _amount;

        emit Staked(_chainId, _staker, _amount);
    }

    function _unstake(uint256 _chainId, address _staker) internal {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        require(stakeInfo.lastUnstakedTime != 0, "Stake: already unstaked");
        stakeInfo.lastUnstakedTime = block.timestamp;

        stakeInfo.reward += stakeInfo.amount * STAKE_REWARD_RATE * (block.timestamp - stakeInfo.lastStakedTime)
            / IOFT(oft).sharedDecimals();
        stakeInfo.lastUnstakedTime = block.timestamp;

        emit Unstaked(_chainId, _staker, stakeInfo.amount);
    }

    function _withdraw(uint256 _chainId, address _staker) internal {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        require(block.timestamp - stakeInfo.lastUnstakedTime >= UNSTAKE_PERIOD, "Chef: Unstake period not passed");
        uint256 amount = stakeInfo.amount;
        stakeInfo.amount = 0;
        stakeInfo.lastStakedTime = 0;
        stakeInfo.lastUnstakedTime = 0;
        totalStakedAmount -= amount;

        // TODO: Transfer oft back to staker

        emit Withdrawn(_chainId, _staker, amount);
    }

    function _claim(uint256 _chainId, address _staker) internal {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        uint256 reward = stakeInfo.reward;
        stakeInfo.reward = 0;

        // TODO: Transfer reward to staker

        emit Claimed(_chainId, _staker, reward);
    }

    function _getUserReward(address _staker) internal view returns (uint256) {
        StakeInfo storage stakeInfo = userStakeInfo[_staker];
        return stakeInfo.reward
            + stakeInfo.amount * STAKE_REWARD_RATE * (block.timestamp - stakeInfo.lastStakedTime)
                / IOFT(oft).sharedDecimals();
    }
}

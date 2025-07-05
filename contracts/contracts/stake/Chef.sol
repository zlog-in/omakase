// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IChef} from "./interfaces/IChef.sol";
import {StakeUpgradeable} from "./base/StakeUpgradeable.sol";

abstract contract Chef is StakeUpgradeable, IChef {
    mapping(uint256 => address) public waiters;
    address public backend;

    // =============================== View Functions ===============================

    function getStakedAmount(address _staker) external view returns (uint256) {
        // TODO: Implement
    }
    function getUnstakePeriod(address _staker) external view returns (uint256) {
        // TODO: Implement
    }
    function getReward(address _staker) external view returns (uint256) {}

    // =============================== CCTP Functions ===============================
    function sendReward(uint256 _chainId, bytes calldata _message, bytes calldata _attestation) external {
        // TODO: Implement
    }

    // =============================== Admin Functions ===============================
    function setToken(address _token) external {
        // TODO: Implement
    }
    function setOFT(address _oft) external {
        // TODO: Implement
    }

    // =============================== Internal Functions ===============================
    function _stake(address _staker, uint256 _amount) internal {}

    receive() external payable {}
    fallback() external payable {}
}

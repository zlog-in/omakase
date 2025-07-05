// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BaseContractUpgradeable} from "./base/BaseContractUpgradeable.sol";
import {IWaiter} from "./interfaces/IWaiter.sol";

abstract contract Waiter is BaseContractUpgradeable, IWaiter {
    address public backend;
    uint256 public hubChainId;
    address public chef;

    // =============================== User Functions ===============================
    function stake(uint256 amount) external {
        // TODO: Implement
    }
    function unstake() external {
        // TODO: Implement
    }
    function withdraw() external {
        // TODO: Implement
    }
    function claim() external {
        // TODO: Implement
    }

    // =============================== CCPT Functions ===============================
    function receiveReward(bytes calldata _message, bytes calldata _attestation) external {
        // TODO: Implement
    }

    // =============================== LayerZero Functions ===============================
    function lzReceive(uint16 _srcChainId, bytes calldata _srcAddress, uint64 _nonce, bytes calldata _payload)
        external
    {
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

    receive() external payable {}
    fallback() external payable {}
}

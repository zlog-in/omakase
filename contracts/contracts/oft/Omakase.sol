// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Omakase Protocol
 * @author Zion
 * @dev OMA is the native ERC20 token for the Omakase Protocol, it is deployed on Ethereum.
 */
contract Omakase is ERC20 {
    constructor(address _initDistributor) ERC20("Omakase", "OMA") {
        _mint(_initDistributor, 1_000_000_000 ether);
    }
}

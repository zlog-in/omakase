// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OFTUpgradeable} from "../layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTUpgradeable.sol";
import {Origin} from "../layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTCoreUpgradeable.sol";

/**
 * @title Omakase Protocol
 * @author Zion
 * @dev OFT is the OFT version of the native ERC20 token for the Omakase Protocol, it is deployed on Arbitrum and Base.
 */
contract OFT is OFTUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(address _lzEndpoint, address _delegate) external initializer {
        __initializeOFT("Omakase", "OMA", _lzEndpoint, _delegate);
    }
}

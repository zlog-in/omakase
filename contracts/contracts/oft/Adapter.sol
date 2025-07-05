// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OFTAdapterUpgradeable} from "../layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTAdapterUpgradeable.sol";
import {Origin} from "../layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFTCoreUpgradeable.sol";

contract Adapter is OFTAdapterUpgradeable {
    constructor() {
        _disableInitializers();
    }

    function initialize(address _token, address _lzEndpoint, address _delegate) external initializer {
        __initializeOFTAdapter(_token, _lzEndpoint, _delegate);
    }
}

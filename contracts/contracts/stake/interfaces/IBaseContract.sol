// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ILayerZeroComposer} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroComposer.sol";

struct LzOptions {
    uint128 gas;
    uint128 value;
}

interface IBaseContract is ILayerZeroComposer {
    /* ========== Errors ========== */
    error NotLocalComposeMsgSender(address sender);
    error NotRemoteComposeMsgSender(uint32 eid, address sender);
    error InvalidEnpoint(address savedEndpoint, address realEndpoint);

    /* ========== Events ========== */
    event ComposeMsgSenderSet(address indexed composeMsgSender, bool allowed);
    event EndpointSet(address indexed endpoint);
    event OftSet(address indexed oft);
    event EidSet(uint256 indexed chainId, uint32 eid);

    /* ========== Functions ========== */
    function setLocalComposeMsgSender(address _composeMsgSender, bool _allowed) external;
    function setRemoteComposeMsgSender(uint32 _eid, address _composeMsgSender, bool _allowed) external;
    function setLzEndpoint(address _lzEndpoint) external;
    function setPayloadOptions(uint8 _payloadType, uint128 _gas, uint128 _value) external;
    function setOft(address _oft) external;
    function setEid(uint256 _chainId, uint32 _eid) external;
}

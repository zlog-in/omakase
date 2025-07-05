// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ILayerZeroComposer} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroComposer.sol";
import {IBaseContract} from "../interfaces/IBaseContract.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {PayloadTypes, LzOptions} from "../interfaces/IBaseContract.sol";

abstract contract BaseContractUpgradeable is
    UUPSUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ILayerZeroComposer,
    IBaseContract
{
    using OptionsBuilder for bytes;

    mapping(address => bool) public localComposeMsgSender;
    mapping(uint32 => mapping(address => bool)) public remoteComposeMsgSender;
    mapping(uint256 => uint32) public chainId2Eid;
    mapping(uint32 => uint256) public eid2ChainId;
    mapping(PayloadTypes => LzOptions) public lzOptions;
    address public oft;
    address public lzEndpoint;

    uint256[43] private __gap;

    function initialize(address _owner) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(_owner);
        __Pausable_init();
    }

    /**
     * @param newImplementation The address of deployed implementation
     * @dev Override with onlyOwner modifier to authrize the upgrade prcess
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    using OptionsBuilder for bytes;
    /* =============================== Amdin Functions =============================== */

    function setLocalComposeMsgSender(address _addr, bool _allowed) public onlyOwner {
        localComposeMsgSender[_addr] = _allowed;
    }

    function setRemoteComposeMsgSender(uint32 _eid, address _addr, bool _allowed) public onlyOwner {
        remoteComposeMsgSender[_eid][_addr] = _allowed;
    }

    function setLzEndpoint(address _lzEndpoint) public onlyOwner {
        lzEndpoint = _lzEndpoint;
    }

    function setOft(address _oft) public onlyOwner {
        oft = _oft;
    }

    function setEid(uint256 _chainId, uint32 _eid) public onlyOwner {
        chainId2Eid[_chainId] = _eid;
        eid2ChainId[_eid] = _chainId;
    }

    function setPayloadOptions(uint8 _payloadType, uint128 _gas, uint128 _value) public onlyOwner {
        lzOptions[PayloadTypes(_payloadType)] = LzOptions(_gas, _value);
    }

    /* =============================== Internal Functions =============================== */
    function _isLocalComposeMsgSender(address _addr) internal view returns (bool) {
        return localComposeMsgSender[_addr];
    }

    function _isRemoteComposeMsgSender(uint32 _eid, address _addr) internal view returns (bool) {
        return remoteComposeMsgSender[_eid][_addr];
    }

    function _getEid(uint256 _chainId) internal view returns (uint32) {
        return chainId2Eid[_chainId];
    }

    function _getChainId(uint32 _eid) internal view returns (uint256) {
        return eid2ChainId[_eid];
    }

    function _getOptionsAirdrop(uint8 _payloadType) internal view returns (uint128 gas, uint128 value) {
        gas = lzOptions[PayloadTypes(_payloadType)].gas;
        value = lzOptions[PayloadTypes(_payloadType)].value;
    }

    function _getOption(uint8 _option) internal view returns (bytes memory options) {
        (uint128 lzReceiveGas, uint128 lzReceiveValue) = _getOptionsAirdrop(uint8(PayloadTypes.LZ_RECEIVE));
        (uint128 optionGas, uint128 optionValue) = _getOptionsAirdrop(_option);
        uint16 index = 0; // only one message can be composed in a transaction
        if (_option == uint8(PayloadTypes.STAKE_ORDER)) {
            options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(lzReceiveGas, lzReceiveValue)
                .addExecutorLzComposeOption(index, optionGas, optionValue);
        }
    }

    /**
     *
     * @param _lzEndpoint The the caller of function lzCompose() on the relayer contract, it should be the endpoint
     * @param _localSender The composeMsg sender on local network, it should be the oft/adapter contract
     * @param _srcEid The eid to identify the network from where the composeMsg sent
     * @param _remoteSender The address to identiy the sender on the remote network
     */
    function _authorizeComposeMsgSender(
        address _lzEndpoint,
        address _localSender,
        uint32 _srcEid,
        address _remoteSender
    ) internal view returns (bool) {
        if (lzEndpoint != _lzEndpoint) revert InvalidEnpoint(lzEndpoint, _lzEndpoint);
        if (!_isLocalComposeMsgSender(_localSender)) revert NotLocalComposeMsgSender(_localSender);
        if (!_isRemoteComposeMsgSender(_srcEid, _remoteSender)) {
            revert NotRemoteComposeMsgSender(_srcEid, _remoteSender);
        }
        return true;
    }
}

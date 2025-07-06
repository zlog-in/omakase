// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ITokenMessenger} from "../interfaces/cctp/ITokenMessenger.sol";
import {IMessageTransmitter} from "../interfaces/cctp/IMessageTransmitter.sol";
import {BaseContractUpgradeable} from "./BaseContractUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract CCTPHandlerUpgradeable is BaseContractUpgradeable {
    event BurnUSDC(uint256 indexed chainId, uint32 indexed domainId, address indexed mintRecipient, uint256 amount);
    event MintUSDC();

    ITokenMessenger public tokenMessager;
    IMessageTransmitter public messageTransmitter;
    mapping(uint256 => uint32) public chainId2DomainId;
    mapping(uint32 => uint256) public domainId2ChainId;
    address public usdc;

    uint256[45] private __gap;

    function setTokenMessager(address _tokenMessager) external onlyOwner {
        tokenMessager = ITokenMessenger(_tokenMessager);
    }

    function setMessageTransmitter(address _messageTransmitter) external onlyOwner {
        messageTransmitter = IMessageTransmitter(_messageTransmitter);
    }

    function setCCTPDomainId(uint256 _chainId, uint32 _domainId) external onlyOwner {
        chainId2DomainId[_chainId] = _domainId;
        domainId2ChainId[_domainId] = _chainId;
    }

    function setUSDC(address _usdc) external onlyOwner {
        usdc = _usdc;
    }

    // =============================== CCTP Functions ===============================
    function _sendReward(uint32 _domainId, bytes memory _message, bytes memory _attestation) internal whenNotPaused {}

    function _receiveReward(bytes memory _message, bytes memory _attestation) internal {
        IMessageTransmitter(messageTransmitter).receiveMessage(_message, _attestation);
        emit MintUSDC();
    }

    function _burnUSDC(uint256 _chainId, address _mintRecipient, uint256 _amount) internal whenNotPaused {
        IERC20(usdc).approve(address(tokenMessager), _amount);
        uint32 finalitThreshold = 1000; // 1000: fast, 2000: standard
        uint256 maxFee = 500; // maximum 500 bp
        ITokenMessenger(tokenMessager).depositForBurn(
            _amount,
            chainId2DomainId[_chainId],
            _toBytes32(_mintRecipient),
            usdc,
            _toBytes32(address(0)),
            maxFee,
            finalitThreshold
        );
        emit BurnUSDC(_chainId, chainId2DomainId[_chainId], _mintRecipient, _amount);
    }

    function _toBytes32(address _address) internal pure returns (bytes32) {
        return bytes32(abi.encode(_address));
    }
}

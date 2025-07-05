// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ITokenMessenger} from "../interfaces/cctp/ITokenMessenger.sol";
import {BaseContractUpgradeable} from "./BaseContractUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

abstract contract CCTPHandlerUpgradeable is BaseContractUpgradeable {
    event BurnUSDC(uint256 indexed chainId, uint32 indexed domainId, address indexed mintRecipient, uint256 amount);

    ITokenMessenger public tokenMessager;
    mapping(uint256 => uint32) public chainId2DomainId;
    mapping(uint32 => uint256) public domainId2ChainId;
    address public usdc;

    uint256[46] private __gap;

    function settokenMessager(address _tokenMessager) external onlyOwner {
        tokenMessager = ITokenMessenger(_tokenMessager);
    }

    function setCCTPDomainId(uint256 _chainId, uint32 _domainId) external onlyOwner {
        chainId2DomainId[_chainId] = _domainId;
        domainId2ChainId[_domainId] = _chainId;
    }

    // =============================== CCTP Functions ===============================
    function _sendReward(uint256 _chainId, bytes calldata _message, bytes calldata _attestation) internal {
        // TODO: Implement
    }

    function _burnUSDC(uint256 _chainId, address _mintRecipient, uint256 _amount) internal {
        IERC20(usdc).approve(address(tokenMessager), _amount);
        require(chainId2DomainId[_chainId] > 0, "CCTPHandler: Invalid CCTP Domain");
        ITokenMessenger(tokenMessager).depositForBurn(
            _amount, chainId2DomainId[_chainId], _toBytes32(_mintRecipient), usdc
        );
        emit BurnUSDC(_chainId, chainId2DomainId[_chainId], _mintRecipient, _amount);
    }

    function _toBytes32(address _address) internal pure returns (bytes32) {
        return bytes32(abi.encode(_address));
    }
}

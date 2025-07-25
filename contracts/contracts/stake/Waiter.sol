// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20, SafeERC20} from "./base/BaseContractUpgradeable.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {
    IOFT,
    SendParam,
    MessagingFee,
    MessagingReceipt,
    OFTReceipt
} from "../layerzerolabs/lz-evm-oapp-v2/contracts/oft/interfaces/IOFT.sol";
import {OFTMsgCodec} from "../layerzerolabs/lz-evm-oapp-v2/contracts/oft/libs/OFTMsgCodec.sol";
import {OFTComposeMsgCodec} from "../layerzerolabs/lz-evm-oapp-v2/contracts/oft/libs/OFTComposeMsgCodec.sol";
import {LzMessageLib} from "./library/LzMessageLib.sol";
import {IWaiter} from "./interfaces/IWaiter.sol";
import {CCTPHandlerUpgradeable} from "./base/CCTPHandlerUpgradeable.sol";

contract Waiter is CCTPHandlerUpgradeable, IWaiter {
    using SafeERC20 for IERC20;
    using OptionsBuilder for bytes;
    using OFTComposeMsgCodec for bytes;
    using LzMessageLib for bytes;

    address public backend;
    uint256 public hubChainId;
    address public chef;

    // =============================== User Functions ===============================
    function stake(uint256 _amount) public payable {
        IERC20 token = IERC20(IOFT(oft).token());

        _checkApproval(token, msg.sender, _amount);
        token.safeTransferFrom(msg.sender, address(this), _amount);
        bytes memory stakePayload = LzMessageLib.encodeStakePayload(msg.sender, _amount);
        bytes memory stakeMsg = LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.STAKE), stakePayload);
        _sendMsg(stakeMsg, _amount);
    }

    function quoteStake(address _staker, uint256 _amount) public view returns (uint256) {
        bytes memory stakePayload = LzMessageLib.encodeStakePayload(_staker, _amount);
        bytes memory stakeMsg = LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.STAKE), stakePayload);
        return _quoteMsg(stakeMsg, _amount);
    }

    function unstake() public payable {
        bytes memory unstakePayload = LzMessageLib.encodeUnstakePayload(msg.sender);
        bytes memory unstakeMsg = LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.UNSTAKE), unstakePayload);
        _sendMsg(unstakeMsg, 0);
    }

    function quoteUnstake(address _unstaker) public view returns (uint256) {
        bytes memory unstakePayload = LzMessageLib.encodeUnstakePayload(_unstaker);
        bytes memory unstakeMsg = LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.UNSTAKE), unstakePayload);
        return _quoteMsg(unstakeMsg, 0);
    }

    function withdraw() public payable {
        bytes memory withdrawPayload = LzMessageLib.encodeWithdrawPayload(msg.sender);
        bytes memory withdrawMsg =
            LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.WITHDRAW), withdrawPayload);
        _sendMsg(withdrawMsg, 0);
    }

    function quoteWithdraw(address _withdrawer) public view returns (uint256) {
        bytes memory withdrawPayload = LzMessageLib.encodeWithdrawPayload(_withdrawer);
        bytes memory withdrawMsg =
            LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.WITHDRAW), withdrawPayload);
        return _quoteMsg(withdrawMsg, 0);
    }

    function claim() public payable {
        bytes memory claimPayload = LzMessageLib.encodeClaimPayload(msg.sender);
        bytes memory claimMsg = LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.CLAIM), claimPayload);
        _sendMsg(claimMsg, 0);
    }

    function quoteClaim(address _claimer) public view returns (uint256) {
        bytes memory claimPayload = LzMessageLib.encodeClaimPayload(_claimer);
        bytes memory claimMsg = LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.CLAIM), claimPayload);
        return _quoteMsg(claimMsg, 0);
    }

    // =============================== LayerZero Functions ===============================
    function lzCompose(
        address _from,
        bytes32, /*_guid*/
        bytes calldata _message,
        address, /*_executor*/
        bytes calldata /*_extraData*/
    ) public payable override {
        bytes memory composeMsg = _message.composeMsg();
        uint32 srcEid = _message.srcEid();
        address remoteSender = OFTComposeMsgCodec.bytes32ToAddress(_message.composeFrom());
        _authorizeComposeMsgSender(msg.sender, _from, srcEid, remoteSender);
        LzMessageLib.LzMessage memory lzMessage = composeMsg.decodeLzMessage();
        if (lzMessage.payloadType == uint8(LzMessageLib.PayloadTypes.WITHDRAW_FINISH)) {
            LzMessageLib.WithdrawFinishPayload memory withdrawPayload =
                LzMessageLib.decodeWithdrawFinishPayload(lzMessage.payload);
            _withdrawFinish(withdrawPayload.staker, withdrawPayload.amount);
        } else if (lzMessage.payloadType == uint8(LzMessageLib.PayloadTypes.CLAIM_FINISH)) {
            LzMessageLib.ClaimFinishPayload memory claimFinishPayload =
                LzMessageLib.decodeClaimFinishPayload(lzMessage.payload);
            _claimFinish(claimFinishPayload.message, claimFinishPayload.attestation);
        } else {
            revert("Waiter: Invalid payload type");
        }
    }

    // =============================== Admin Functions ===============================
    function setBackend(address _backend) external onlyOwner {
        backend = _backend;
    }

    function setHubChainId(uint256 _hubChainId) external onlyOwner {
        hubChainId = _hubChainId;
    }

    function setChef(address _chef) external onlyOwner {
        chef = _chef;
    }

    // =============================== Internal Functions ===============================

    function _checkApproval(IERC20 token, address _staker, uint256 _amount) internal {
        require(token.allowance(_staker, address(this)) >= _amount, "Waiter: insufficient approval");

        if (IOFT(oft).approvalRequired()) {
            token.approve(oft, _amount);
        }
    }

    function _sendMsg(bytes memory _msg, uint256 _amount) internal whenNotPaused {
        SendParam memory sendParam = SendParam({
            dstEid: _getEid(hubChainId),
            to: OFTMsgCodec.addressToBytes32(chef),
            amountLD: _amount,
            minAmountLD: _amount,
            extraOptions: "",
            composeMsg: _msg,
            oftCmd: ""
        });

        MessagingFee memory fee = IOFT(oft).quoteSend(sendParam, false);
        require(msg.value >= fee.nativeFee, "Waiter: insufficient lz fee");
        IOFT(oft).send{value: fee.nativeFee}(sendParam, fee, payable(msg.sender));
    }

    function _quoteMsg(bytes memory _msg, uint256 _amount) internal view returns (uint256) {
        SendParam memory sendParam = SendParam({
            dstEid: _getEid(hubChainId),
            to: OFTMsgCodec.addressToBytes32(chef),
            amountLD: _amount,
            minAmountLD: _amount,
            extraOptions: "",
            composeMsg: _msg,
            oftCmd: ""
        });
        MessagingFee memory fee = IOFT(oft).quoteSend(sendParam, false);
        return fee.nativeFee;
    }

    function _withdrawFinish(address _staker, uint256 _amount) internal {
        IERC20 token = IERC20(IOFT(oft).token());
        token.safeTransfer(_staker, _amount);
        emit WithdrawFinished(_staker, _amount);
    }

    function _claimFinish(bytes memory _message, bytes memory _attestation) internal {
        _receiveReward(_message, _attestation);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IChef} from "./interfaces/IChef.sol";
import {StakeUpgradeable} from "./base/StakeUpgradeable.sol";
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

contract Chef is StakeUpgradeable, IChef {
    using OFTComposeMsgCodec for bytes;
    using LzMessageLib for bytes;

    mapping(uint256 => address) public waiters;
    address public backend;

    function sendReward(uint256 _chainId, bytes calldata _message, bytes calldata _attestation) external {
        _sendReward(_chainId, _message, _attestation);
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

        uint256 chainId = eid2ChainId[srcEid];
        if (lzMessage.payloadType == uint8(LzMessageLib.PayloadTypes.STAKE)) {
            LzMessageLib.StakePayload memory stakePayload = LzMessageLib.decodeStakePayload(lzMessage.payload);
            _stake(stakePayload.staker, stakePayload.amount);
        } else if (lzMessage.payloadType == uint8(LzMessageLib.PayloadTypes.UNSTAKE)) {
            LzMessageLib.UnstakePayload memory unstakePayload = LzMessageLib.decodeUnstakePayload(lzMessage.payload);
            _unstake(chainId, unstakePayload.staker);
        } else if (lzMessage.payloadType == uint8(LzMessageLib.PayloadTypes.WITHDRAW)) {
            LzMessageLib.WithdrawPayload memory withdrawPayload = LzMessageLib.decodeWithdrawPayload(lzMessage.payload);

            uint256 withdrawAmount = _withdraw(chainId, withdrawPayload.staker);

            bytes memory withdrawFinishPyload =
                LzMessageLib.encodeWithdrawFinishPayload(withdrawPayload.staker, withdrawAmount);
            bytes memory withdrawFinishMsg =
                LzMessageLib.encodeLzMessage(uint8(LzMessageLib.PayloadTypes.WITHDRAW_FINISH), withdrawFinishPyload);
            _sendMsg(chainId, waiters[chainId], withdrawFinishMsg, withdrawAmount);
        } else if (lzMessage.payloadType == uint8(LzMessageLib.PayloadTypes.CLAIM)) {
            LzMessageLib.ClaimPayload memory claimPayload = LzMessageLib.decodeClaimPayload(lzMessage.payload);
            _claim(chainId, claimPayload.staker);
        }
    }

    // =============================== Internal Functions ===============================
    function _stake(address _staker, uint256 _amount) internal {}

    function _sendMsg(uint256 _chainId, address _to, bytes memory _msg, uint256 _amount) internal {
        SendParam memory sendParam = SendParam({
            dstEid: _getEid(_chainId),
            to: OFTMsgCodec.addressToBytes32(_to),
            amountLD: _amount,
            minAmountLD: _amount,
            extraOptions: "",
            composeMsg: _msg,
            oftCmd: ""
        });

        MessagingFee memory fee = IOFT(oft).quoteSend(sendParam, false);
        IOFT(oft).send{value: fee.nativeFee}(sendParam, fee, address(this));
    }

    receive() external payable {}
    fallback() external payable {}
}

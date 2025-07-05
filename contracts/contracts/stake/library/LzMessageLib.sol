// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library LzMessageLib {
    // =============================== Payload Types ===============================
    enum PayloadTypes {
        LZ_RECEIVE,
        STAKE,
        UNSTAKE,
        WITHDRAW,
        WITHDRAW_FINISH,
        CLAIM,
        CLAIM_FINISH,
        SNED_REWARD
    }

    // =============================== LzMessage ===============================
    struct LzMessage {
        uint8 payloadType;
        bytes payload;
    }

    // =============================== Payloads ===============================
    struct StakePayload {
        address staker;
        uint256 amount;
    }

    struct UnstakePayload {
        address staker;
    }

    struct WithdrawPayload {
        address staker;
    }

    struct WithdrawFinishPayload {
        address staker;
        uint256 amount;
    }

    struct ClaimPayload {
        address staker;
    }

    function encodeLzMessage(uint8 _payloadType, bytes memory _payload) internal pure returns (bytes memory) {
        LzMessage memory lzMessage = LzMessage({payloadType: _payloadType, payload: _payload});
        return abi.encode(lzMessage);
    }

    function decodeLzMessage(bytes memory _message) internal pure returns (LzMessage memory) {
        return abi.decode(_message, (LzMessage));
    }

    function encodeStakePayload(address _staker, uint256 _amount) internal pure returns (bytes memory) {
        return abi.encode(_staker, _amount);
    }

    function decodeStakePayload(bytes memory _payload) internal pure returns (StakePayload memory) {
        (address staker, uint256 amount) = abi.decode(_payload, (address, uint256));
        return StakePayload({staker: staker, amount: amount});
    }

    function encodeUnstakePayload(address _staker) internal pure returns (bytes memory) {
        return abi.encode(_staker);
    }

    function decodeUnstakePayload(bytes memory _payload) internal pure returns (UnstakePayload memory) {
        (address staker) = abi.decode(_payload, (address));
        return UnstakePayload({staker: staker});
    }

    function encodeWithdrawPayload(address _staker) internal pure returns (bytes memory) {
        return abi.encode(_staker);
    }

    function decodeWithdrawPayload(bytes memory _payload) internal pure returns (WithdrawPayload memory) {
        (address staker) = abi.decode(_payload, (address));
        return WithdrawPayload({staker: staker});
    }

    function encodeWithdrawFinishPayload(address _staker, uint256 _amount) internal pure returns (bytes memory) {
        return abi.encode(_staker, _amount);
    }

    function decodeWithdrawFinishPayload(bytes memory _payload) internal pure returns (WithdrawFinishPayload memory) {
        (address staker, uint256 amount) = abi.decode(_payload, (address, uint256));
        return WithdrawFinishPayload({staker: staker, amount: amount});
    }

    function encodeClaimPayload(address _staker) internal pure returns (bytes memory) {
        return abi.encode(_staker);
    }

    function decodeClaimPayload(bytes memory _payload) internal pure returns (ClaimPayload memory) {
        (address staker) = abi.decode(_payload, (address));
        return ClaimPayload({staker: staker});
    }
}

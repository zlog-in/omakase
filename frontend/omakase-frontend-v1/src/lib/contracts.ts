export const WAITER_ABI = [
  // User Functions
  "function stake(uint256 amount) external",
  "function unstake() external", 
  "function withdraw() external",
  "function claim() external",
  
  // CCTP Functions
  "function receiveReward(bytes calldata _message, bytes calldata _attestation) external",
  
  // Events
  "event StakeSent(address indexed staker, uint256 amount)",
  "event UnstakeSent(address indexed staker)",
  "event WithdrawSent(address indexed staker)",
  "event WithdrawFinished(address indexed staker, uint256 amount)",
  "event ClaimSent(address indexed staker, uint256 amount)",
  "event ClaimFinished(address indexed staker, uint256 amount)"
] as const;

export const CHEF_ABI = [
  // View Functions
  "function getTotalStakedAmount() external view returns (uint256)",
  "function getUserStakeInfo(address _staker) external view returns (tuple(uint256 stakeAmount, uint256 stakeReward, uint256 lastStakeTime, uint256 lastUnstakeTime))",
  "function getUserReward(address _staker) external view returns (uint256)",
  "function getUserUnstakeLockTime(address _staker) external view returns (uint256)",
  
  // Constants
  "function UNSTAKE_PERIOD() external view returns (uint256)",
  "function STAKE_REWARD_RATE() external view returns (uint256)",
  
  // CCTP Functions
  "function sendReward(uint256 _chainId, bytes calldata _message, bytes calldata _attestation) external",
  
  // Events
  "event Staked(uint256 indexed chainId, address indexed staker, uint256 amount)",
  "event Unstaked(uint256 indexed chainId, address indexed staker, uint256 amount)",
  "event Withdrawn(uint256 indexed chainId, address indexed staker, uint256 amount)",
  "event Claimed(uint256 indexed chainId, address indexed staker, uint256 amount)"
] as const;

export const BASE_CONTRACT_ABI = [
  // Base contract functions
  "function setLocalComposeMsgSender(address _composeMsgSender, bool _allowed) external",
  "function setRemoteComposeMsgSender(uint32 _eid, address _composeMsgSender, bool _allowed) external",
  "function setLzEndpoint(address _lzEndpoint) external",
  "function setPayloadOptions(uint8 _payloadType, uint128 _gas, uint128 _value) external",
  "function setOft(address _oft) external",
  "function setEid(uint256 _chainId, uint32 _eid) external",
  
  // Events
  "event ComposeMsgSenderSet(address indexed composeMsgSender, bool allowed)",
  "event EndpointSet(address indexed endpoint)",
  "event OftSet(address indexed oft)",
  "event EidSet(uint256 indexed chainId, uint32 eid)"
] as const;

export const OFT_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
  "function sharedDecimals() external view returns (uint8)"
] as const;

// Payload Types
export const PayloadTypes = {
  LZ_RECEIVE: 0,
  STAKE_ORDER: 1,
  UNSTAKE_ORDER: 2,
  WITHDRAW_ORDER: 3,
  CLAIM_REWARD: 4
} as const;
// ==============================================================================
// STILLWORKS 0G GALILEO CONTRACT ABIS & DEPLOYED ADDRESSES
// ==============================================================================

export const STILLWORKS_DEPLOYED = {
  chainId: 16602,
  network: '0G Galileo Testnet',
  explorer: 'https://chainscan-galileo.0g.ai',
  usdt: '0x6A8c371B01A9b9657c3bfbF8677c96408145B512' as `0x${string}`,
  hub: '0xb2b264386d3b88085ca7e4114a6B0eF0358aC450' as `0x${string}`,
  hourlyProtocolHub: '0xb2b264386d3b88085ca7e4114a6B0eF0358aC450' as `0x${string}`,
  waterfallContingencyHub: '0x3DE98F1928157098e6c82F316Ac04BbF46c7B10e' as `0x${string}`,
  cleanEscrow: '0x153badA8AB7C65DAF3a90f581E6b34AB7cAC543a' as `0x${string}`,
  zerogServingBroker: '0x0AD9690e0b34aB2d493DE02cDF149ee34f6C9939' as `0x${string}`,
};

export const MOCK_USDT_ABI = [
  {
    type: 'function',
    name: 'faucet',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export const STILLWORKS_HUB_ABI = [
  {
    type: 'function',
    name: 'registerListing',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'slugHash', type: 'bytes32' },
      { name: 'steward', type: 'address' },
      { name: 'escrowContract', type: 'address' },
      { name: 'initialStorageHash', type: 'bytes32' },
    ],
    outputs: [{ name: 'productId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'recordHeartbeat',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'uint256' },
      { name: 'newStorageHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'performUpkeep',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'snapshotHash', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getProductHealth',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [
      { name: 'currentStatus', type: 'uint8' },
      { name: 'secondsSinceHeartbeat', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'totalProtocolFeesCollected',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'productCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export const STEWARDSHIP_ESCROW_ABI = [
  {
    type: 'function',
    name: 'subscribe',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tier', type: 'uint8' }],
    outputs: [{ name: 'agreementId', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'claimOpsReserve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'agreementId', type: 'bytes32' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'releaseReviewFunds',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'agreementId', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimContingencyAndRefund',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'agreementId', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'totalSubscriptions',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'status',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'steward',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

export const HOURLY_PROTOCOL_HUB_ABI = [
  {
    type: 'function',
    name: 'currentEpoch',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'latestPlatformSnapshotHash',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'epochSnapshotHashes',
    stateMutability: 'view',
    inputs: [{ name: 'epoch', type: 'uint256' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'getProductHealth',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [
      { name: 'currentStatus', type: 'uint8' },
      { name: 'secondsSinceHeartbeat', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'performHourlyUpkeep',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'snapshotHash', type: 'bytes32' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'recordHeartbeat',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'uint256' },
      { name: 'newStorageHash', type: 'bytes32' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'replenishInferenceQuota',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'uint256' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'submitSuccessionProposal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'uint256' },
      { name: 'proposedSteward', type: 'address' },
      { name: 'proposedFrontend0GRoot', type: 'bytes32' },
      { name: 'proposedWalkawayRoot', type: 'bytes32' },
    ],
    outputs: [{ name: 'proposalId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'voteSuccessionProposal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'subscriberWeight', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'executeSuccession',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
  },
] as const;

export const WATERFALL_CONTINGENCY_HUB_ABI = [
  {
    type: 'function',
    name: 'proposalCount',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'proposals',
    stateMutability: 'view',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'productId', type: 'uint256' },
      { name: 'proposer', type: 'address' },
      { name: 'issueRef', type: 'string' },
      { name: 'patchProofHash', type: 'bytes32' },
      { name: 'requestedAmount', type: 'uint256' },
      { name: 'createdAt', type: 'uint256' },
      { name: 'votingDeadline', type: 'uint256' },
      { name: 'votesForWeight', type: 'uint256' },
      { name: 'votesAgainstWeight', type: 'uint256' },
      { name: 'executed', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'lastProposalTimestamp',
    stateMutability: 'view',
    inputs: [{ name: 'productId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'submitFixProposal',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'productId', type: 'uint256' },
      { name: 'issueRef', type: 'string' },
      { name: 'patchProofHash', type: 'bytes32' },
      { name: 'requestedAmount', type: 'uint256' },
    ],
    outputs: [{ name: 'proposalId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'castVote',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'bool' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'executeFixReward',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'hasVoted',
    stateMutability: 'view',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'voter', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;


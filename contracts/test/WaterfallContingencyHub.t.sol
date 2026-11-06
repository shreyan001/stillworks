// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {MockUSDT} from "../src/MockUSDT.sol";
import {WaterfallContingencyHub} from "../src/WaterfallContingencyHub.sol";

interface Vm {
    function warp(uint256) external;
    function prank(address) external;
    function startPrank(address) external;
    function stopPrank() external;
}

contract MockContingencyEscrow {
    address public steward;
    uint256 public contingencyVault = 100 * 10**6; // 100 USDT contingency pool
    mapping(address => uint256) public subscriberWeights;

    constructor(address _steward) {
        steward = _steward;
    }

    function setSubscriberWeight(address subscriber, uint256 weight) external {
        subscriberWeights[subscriber] = weight;
    }

    function totalContingencyVault() external view returns (uint256) {
        return contingencyVault;
    }

    function getSubscriberWeight(address subscriber) external view returns (uint256) {
        return subscriberWeights[subscriber];
    }

    function releaseContingencyReward(address recipient, uint256 amount) external {
        require(amount <= contingencyVault, "Exceeds vault");
        contingencyVault -= amount;
    }
}

contract WaterfallContingencyHubTest {
    Vm constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    WaterfallContingencyHub public hub;
    MockUSDT public usdt;
    MockContingencyEscrow public mockEscrow;

    address public admin = address(0xAA1);
    address public steward = address(0xBB2);
    address public contributor = address(0xCC3);
    address public proSubscriber = address(0xDD4);
    address public premiumSubscriber = address(0xEE5);
    address public nonSubscriber = address(0xFF6);

    function setUp() public {
        vm.startPrank(admin);
        usdt = new MockUSDT();
        hub = new WaterfallContingencyHub(address(usdt));
        vm.stopPrank();

        mockEscrow = new MockContingencyEscrow(steward);
        mockEscrow.setSubscriberWeight(proSubscriber, 10);      // 10 USDT monthly tier
        mockEscrow.setSubscriberWeight(premiumSubscriber, 7);   // 7 USDT prepaid tier

        vm.prank(admin);
        hub.linkProductEscrow(1, address(mockEscrow));
    }

    function test_SubmitProposalWithin20PercentCap() public {
        vm.prank(contributor);
        // Vault has 100 USDT. Max 20% tranche = 20 USDT (20,000,000 raw)
        uint256 propId = hub.submitFixProposal(
            1,
            "FIX-001: Patch memory leak in browser SQLite IndexedDB buffer",
            keccak256("git-patch-diff-0g-hash"),
            18 * 10**6 // 18 USDT (18%)
        );

        require(propId == 1, "ProposalId != 1");
    }

    function test_RejectsExceeding20PercentCap() public {
        vm.prank(contributor);
        // Request 25 USDT on a 100 USDT vault -> must revert
        (bool success, ) = address(hub).call(
            abi.encodeWithSelector(
                hub.submitFixProposal.selector,
                1,
                "OVER-BUDGET: Requesting 25%",
                keccak256("diff"),
                25 * 10**6
            )
        );
        require(!success, "Must revert when exceeding 20% cap");
    }

    function test_EnforcesOneProposalPerWeekLimit() public {
        vm.prank(contributor);
        hub.submitFixProposal(
            1,
            "FIX-001: SQL injection sanitizer fix",
            keccak256("diff-1"),
            15 * 10**6
        );

        // Submitting again within 7 days must fail
        vm.warp(block.timestamp + 3 days);
        vm.prank(contributor);
        (bool success, ) = address(hub).call(
            abi.encodeWithSelector(
                hub.submitFixProposal.selector,
                1,
                "FIX-002: Second proposal in same week",
                keccak256("diff-2"),
                10 * 10**6
            )
        );
        require(!success, "Must revert when submitting within 7-day cooldown");

        // After 7 days, submission succeeds
        vm.warp(block.timestamp + 4 days + 1); // 7 days total
        vm.prank(contributor);
        uint256 prop2 = hub.submitFixProposal(
            1,
            "FIX-002: Second proposal after 7 days",
            keccak256("diff-2"),
            10 * 10**6
        );
        require(prop2 == 2, "Second proposal should succeed after cooldown");
    }

    function test_WeightedSubscriberVotingAndBountyRelease() public {
        vm.prank(contributor);
        uint256 propId = hub.submitFixProposal(
            1,
            "FIX-001: Resolve 0G Storage Turbo segment indexing timeout",
            keccak256("diff-1"),
            20 * 10**6 // 20 USDT
        );

        // Pro subscriber votes support (Weight = 10)
        vm.prank(proSubscriber);
        hub.voteOnProposal(propId, true);

        // Premium subscriber votes support (Weight = 7)
        vm.prank(premiumSubscriber);
        hub.voteOnProposal(propId, true);

        // Non-subscriber cannot vote
        vm.prank(nonSubscriber);
        (bool voteSuccess, ) = address(hub).call(
            abi.encodeWithSelector(hub.voteOnProposal.selector, propId, true)
        );
        require(!voteSuccess, "Non-subscriber must not vote");

        // Advance 3 days past voting deadline
        vm.warp(block.timestamp + 3 days + 1);

        // Execute proposal
        hub.executeProposal(propId);

        // Verify contingency vault in escrow was deducted from 100 USDT to 80 USDT
        require(mockEscrow.contingencyVault() == 80 * 10**6, "Vault not reduced by 20 USDT");
    }
}

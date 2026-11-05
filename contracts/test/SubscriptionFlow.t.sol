// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ProductRegistry} from "../src/ProductRegistry.sol";
import {SubscriptionAgreement} from "../src/SubscriptionAgreement.sol";
import {SubscriptionEscrow} from "../src/SubscriptionEscrow.sol";

interface Vm {
    function warp(uint256) external;
    function deal(address, uint256) external;
    function prank(address) external;
    function expectRevert(bytes4) external;
}

contract SubscriptionFlowTest {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    ProductRegistry internal registry;
    SubscriptionAgreement internal agreement;
    SubscriptionEscrow internal escrow;

    address internal founder = address(0x100);
    address internal steward = address(0x200);
    address internal signer = address(0x300);
    address internal subscriber = address(0x400);
    address internal stranger = address(0x500);

    bytes32 internal constant PASSPORT = keccak256("passport-0g-root");
    bytes32 internal constant FRONTEND = keccak256("frontend-0g-root");
    bytes32 internal constant STATUS_HASH = keccak256("heartbeat-status");

    uint256 internal constant PRICE_PER_PERIOD = 1 ether;
    uint256 internal constant PERIOD_LENGTH = 1 days;
    uint256 internal constant GRACE_WINDOW = 2 hours;

    uint256 internal productId;

    // Receive function so test contract can receive funds
    receive() external payable {}

    function setUp() public {
        registry = new ProductRegistry();
        agreement = new SubscriptionAgreement(address(registry));
        escrow = new SubscriptionEscrow(address(registry), address(agreement), steward);

        // Fund test accounts
        vm.deal(founder, 10 ether);
        vm.deal(subscriber, 10 ether);
        vm.deal(stranger, 10 ether);

        // Register and activate a product
        vm.prank(founder);
        productId = registry.register(PASSPORT, FRONTEND, signer, steward);

        vm.prank(founder);
        registry.proposePassport(productId, PASSPORT);

        vm.prank(steward);
        registry.approvePassport(productId);
    }

    function testCreateAgreement() public {
        vm.prank(subscriber);
        uint256 agId = agreement.create(productId, PRICE_PER_PERIOD, PERIOD_LENGTH, GRACE_WINDOW);

        SubscriptionAgreement.Agreement memory ag = agreement.getAgreement(agId);
        require(ag.productId == productId, "product id");
        require(ag.subscriber == subscriber, "subscriber");
        require(ag.pricePerPeriod == PRICE_PER_PERIOD, "price");
        require(ag.periodLength == PERIOD_LENGTH, "period length");
        require(ag.graceWindow == GRACE_WINDOW, "grace window");
        require(!ag.cancelled, "not cancelled");
    }

    function testCancelAgreement() public {
        vm.prank(subscriber);
        uint256 agId = agreement.create(productId, PRICE_PER_PERIOD, PERIOD_LENGTH, GRACE_WINDOW);

        // Stranger cannot cancel
        vm.prank(stranger);
        vm.expectRevert(SubscriptionAgreement.NotSubscriber.selector);
        agreement.cancel(agId);

        // Subscriber cancels
        vm.prank(subscriber);
        agreement.cancel(agId);

        require(agreement.getAgreement(agId).cancelled, "should be cancelled");

        // Cannot cancel twice
        vm.prank(subscriber);
        vm.expectRevert(SubscriptionAgreement.AlreadyCancelled.selector);
        agreement.cancel(agId);
    }

    function testWalkawayRequestsAndUpdates() public {
        vm.prank(subscriber);
        uint256 agId = agreement.create(productId, PRICE_PER_PERIOD, PERIOD_LENGTH, GRACE_WINDOW);

        // Subscriber can request walkaway
        vm.prank(subscriber);
        agreement.requestWalkaway(agId);

        // Founder updates walkaway root
        bytes32 bundleRoot = keccak256("walkaway-bundle-v1");
        vm.prank(founder);
        agreement.updateWalkawayRoot(agId, bundleRoot);

        require(agreement.getAgreement(agId).walkawayRoot == bundleRoot, "root updated");

        // Stranger cannot update walkaway root
        vm.prank(stranger);
        vm.expectRevert(SubscriptionAgreement.NotFounder.selector);
        agreement.updateWalkawayRoot(agId, keccak256("fake"));
    }

    function testFundingAndExcessRefund() public {
        vm.prank(subscriber);
        uint256 agId = agreement.create(productId, PRICE_PER_PERIOD, PERIOD_LENGTH, GRACE_WINDOW);

        uint256 subBalanceBefore = subscriber.balance;

        // Subscriber funds 2 periods (2 ether) but sends 2.5 ether
        vm.prank(subscriber);
        escrow.fund{value: 2.5 ether}(agId, 2);

        SubscriptionEscrow.EscrowState memory esc = escrow.getEscrow(agId);
        require(esc.fundedPeriods == 2, "funded 2 periods");
        require(esc.balance == 2 ether, "balance should be 2 ether");
        require(subscriber.balance == subBalanceBefore - 2 ether, "excess 0.5 refunded");
    }

    function testReleasePeriodSequential() public {
        vm.prank(subscriber);
        uint256 agId = agreement.create(productId, PRICE_PER_PERIOD, PERIOD_LENGTH, GRACE_WINDOW);

        vm.prank(subscriber);
        escrow.fund{value: 2 ether}(agId, 2);

        // Period 1 heartbeat not yet attested -> release fails
        vm.expectRevert(SubscriptionEscrow.HeartbeatMissing.selector);
        escrow.release(agId, 1);

        // Post heartbeat for period 1
        vm.prank(signer);
        registry.heartbeat(productId, 1, STATUS_HASH);

        // Anyone (stranger) can trigger release
        uint256 founderBalanceBefore = founder.balance;
        vm.prank(stranger);
        escrow.release(agId, 1);

        require(founder.balance == founderBalanceBefore + PRICE_PER_PERIOD, "founder paid");
        SubscriptionEscrow.EscrowState memory esc = escrow.getEscrow(agId);
        require(esc.releasedPeriods == 1, "released period 1");
        require(esc.balance == 1 ether, "1 ether left in escrow");

        // Cannot release period 2 yet (heartbeat missing)
        vm.expectRevert(SubscriptionEscrow.HeartbeatMissing.selector);
        escrow.release(agId, 2);
    }

    function testProRataRefundOnMissedHeartbeat() public {
        vm.prank(subscriber);
        uint256 agId = agreement.create(productId, PRICE_PER_PERIOD, PERIOD_LENGTH, GRACE_WINDOW);

        // Fund 3 periods (3 ether)
        vm.prank(subscriber);
        escrow.fund{value: 3 ether}(agId, 3);

        // Period 1 heartbeat posted and released
        vm.prank(signer);
        registry.heartbeat(productId, 1, STATUS_HASH);
        escrow.release(agId, 1);

        // Period 2 heartbeat is NEVER posted.
        // Before grace window deadline, refund fails
        vm.expectRevert(SubscriptionEscrow.GraceWindowNotElapsed.selector);
        escrow.claimRefund(agId);

        // Warp past Period 2 deadline: startTime + (2 * PERIOD_LENGTH) + GRACE_WINDOW + 1 second
        SubscriptionAgreement.Agreement memory ag = agreement.getAgreement(agId);
        uint256 period2Deadline = ag.startTime + (2 * PERIOD_LENGTH) + GRACE_WINDOW;
        vm.warp(period2Deadline + 1);

        // Check helper function
        (bool claimable, uint256 refundAmount) = escrow.isRefundClaimable(agId);
        require(claimable, "refund must be claimable");
        require(refundAmount == 2 ether, "refund amount must be 2 ether");

        // Claim refund
        uint256 subBalanceBefore = subscriber.balance;
        escrow.claimRefund(agId);

        require(subscriber.balance == subBalanceBefore + 2 ether, "subscriber refunded 2 ether");

        SubscriptionEscrow.EscrowState memory esc = escrow.getEscrow(agId);
        require(esc.refunded, "escrow marked refunded");
        require(esc.balance == 0, "balance zero");

        // Cannot claim refund again
        vm.expectRevert(SubscriptionEscrow.AlreadyRefunded.selector);
        escrow.claimRefund(agId);
    }
}

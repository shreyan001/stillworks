// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {MockUSDT} from "../src/MockUSDT.sol";
import {StillworksHub} from "../src/StillworksHub.sol";
import {StewardshipEscrowPayments} from "../src/StewardshipEscrowPayments.sol";

interface Vm {
    function warp(uint256) external;
    function prank(address) external;
    function startPrank(address) external;
    function stopPrank() external;
}

contract StewardshipEscrowPaymentsTest {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    MockUSDT public usdt;
    StillworksHub public hub;
    StewardshipEscrowPayments public escrow;

    address public admin = address(0xAA11);
    address public keeper = address(0xBB22);
    address public steward = address(0xCC33);
    address public subscriber = address(0xDD44);

    uint256 public productId;
    bytes32 public slugHash = keccak256("clean");
    bytes32 public initialRoot = keccak256("clean-merkle-v1");

    function setUp() public {
        vm.startPrank(admin);

        // 1. Deploy MockUSDT
        usdt = new MockUSDT();

        // 2. Deploy StillworksHub
        hub = new StillworksHub(address(usdt), keeper);

        // 3. Register Product Clean
        productId = hub.registerListing(slugHash, steward, address(0), initialRoot);

        // 4. Deploy Escrow for Clean
        escrow = new StewardshipEscrowPayments(address(hub), address(usdt), productId, steward);

        // Authorize Escrow on Hub
        hub.setEscrowAuthorization(address(escrow), true);

        vm.stopPrank();

        // Faucet subscriber 100 USDT
        usdt.mint(subscriber, 100 * 10**6);
    }

    function testMockUSDTFaucet() public {
        uint256 bal = usdt.balanceOf(subscriber);
        require(bal == 100 * 10**6, "Faucet mint failed");
    }

    function testListingRegisteredOnHub() public {
        (uint256 id, bytes32 slug, address st, address esc, bytes32 root, , , StillworksHub.HealthStatus status, bool reg) = hub.listings(productId);
        require(id == 1, "Wrong product id");
        require(slug == slugHash, "Wrong slug hash");
        require(st == steward, "Wrong steward");
        require(status == StillworksHub.HealthStatus.Active, "Status not active");
        require(reg, "Not registered");
    }

    function testProSubscriptionSplitAndFeeRemittance() public {
        vm.startPrank(subscriber);
        usdt.approve(address(escrow), 10 * 10**6);
        bytes32 agreementId = escrow.subscribe(StewardshipEscrowPayments.Tier.ProMonthly);
        vm.stopPrank();

        // Verify escrow balances
        (
            bytes32 id,
            address sub,
            StewardshipEscrowPayments.Tier tier,
            uint256 depTime,
            uint256 unlockTime,
            uint256 totalDep,
            uint256 ops,
            uint256 contingency,
            uint256 reviewLock,
            uint256 serviceFee,
            bool reviewRel,
            bool refunded
        ) = escrow.subscriptions(agreementId);

        require(sub == subscriber, "Wrong subscriber");
        require(tier == StewardshipEscrowPayments.Tier.ProMonthly, "Wrong tier");
        require(totalDep == 10 * 10**6, "Total should be 10 USDT");

        // 2.5% platform fee = 0.25 USDT (250,000 units)
        require(serviceFee == 250_000, "Service fee should be 0.25 USDT");

        // 30% ops = 3.00 USDT (3,000,000 units)
        require(ops == 3_000_000, "Ops should be 3 USDT");

        // 20% contingency = 2.00 USDT (2,000,000 units)
        require(contingency == 2_000_000, "Contingency should be 2 USDT");

        // 47.5% review lock = 4.75 USDT (4,750,000 units)
        require(reviewLock == 4_750_000, "Review lock should be 4.75 USDT");

        // Verify StillworksHub received the 0.25 USDT service fee
        uint256 hubBal = usdt.balanceOf(address(hub));
        require(hubBal == 250_000, "Hub should hold 0.25 USDT");
        require(hub.totalProtocolFeesCollected() == 250_000, "Hub protocol fees mismatch");
    }

    function testOpsReserveClaimBySteward() public {
        vm.startPrank(subscriber);
        usdt.approve(address(escrow), 10 * 10**6);
        bytes32 agreementId = escrow.subscribe(StewardshipEscrowPayments.Tier.ProMonthly);
        vm.stopPrank();

        uint256 stewardBefore = usdt.balanceOf(steward);

        // Steward claims 1 USDT from ops reserve
        vm.prank(steward);
        escrow.claimOpsReserve(agreementId, 1 * 10**6);

        uint256 stewardAfter = usdt.balanceOf(steward);
        require(stewardAfter - stewardBefore == 1 * 10**6, "Steward should receive 1 USDT");
    }

    function testReviewFundsReleaseAfter7Days() public {
        vm.startPrank(subscriber);
        usdt.approve(address(escrow), 10 * 10**6);
        bytes32 agreementId = escrow.subscribe(StewardshipEscrowPayments.Tier.ProMonthly);
        vm.stopPrank();

        // Warp 7 days + 1 second
        vm.warp(block.timestamp + 7 days + 1);

        uint256 stewardBefore = usdt.balanceOf(steward);
        escrow.releaseReviewFunds(agreementId);
        uint256 stewardAfter = usdt.balanceOf(steward);

        // 4.75 USDT released
        require(stewardAfter - stewardBefore == 4_750_000, "Steward should receive review locked 4.75 USDT");
    }

    function testAbandonmentRefundTriggeredByHubLiveness() public {
        vm.startPrank(subscriber);
        usdt.approve(address(escrow), 10 * 10**6);
        bytes32 agreementId = escrow.subscribe(StewardshipEscrowPayments.Tier.ProMonthly);
        vm.stopPrank();

        // Warp 25 hours without heartbeat (past 24h grace period)
        vm.warp(block.timestamp + 25 hours);

        // Keeper performs upkeep
        vm.prank(keeper);
        hub.performUpkeep(keccak256("new-snapshot-25h"));

        // Status on hub is now Abandoned
        (StillworksHub.HealthStatus health, ) = hub.getProductHealth(productId);
        require(health == StillworksHub.HealthStatus.Abandoned, "Health should be Abandoned");

        // Subscriber claims contingency + unreleased review balance (2.00 USDT + 4.75 USDT = 6.75 USDT)
        uint256 subBefore = usdt.balanceOf(subscriber);
        vm.prank(subscriber);
        escrow.claimContingencyAndRefund(agreementId);
        uint256 subAfter = usdt.balanceOf(subscriber);

        require(subAfter - subBefore == 6_750_000, "Subscriber should recover 6.75 USDT");
    }
}

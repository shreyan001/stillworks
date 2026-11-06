// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {MockUSDT} from "../src/MockUSDT.sol";
import {StillworksHourlyProtocolHub} from "../src/StillworksHourlyProtocolHub.sol";

interface Vm {
    function warp(uint256) external;
    function prank(address) external;
    function startPrank(address) external;
    function stopPrank() external;
}

contract MockEscrow {
    address public steward;
    uint256 public opsReserve = 50 * 10**6; // 50 USDT

    constructor(address _steward) {
        steward = _steward;
    }

    function releaseOpsReserveForInference(address provider, uint256 amount) external {
        require(amount <= opsReserve, "Exceeds reserve");
        opsReserve -= amount;
    }

    function transferStewardship(address newSteward) external {
        steward = newSteward;
    }
}

contract StillworksHourlyProtocolHubTest {
    Vm constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    StillworksHourlyProtocolHub public hub;
    MockUSDT public usdt;
    MockEscrow public mockEscrow;

    address public admin = address(0xAA1);
    address public keeper = address(0xBB2);
    address public steward = address(0xCC3);
    address public successor = address(0xDD4);
    address public inferenceProvider = address(0xEE5);

    function setUp() public {
        vm.startPrank(admin);
        usdt = new MockUSDT();
        hub = new StillworksHourlyProtocolHub(address(usdt), keeper);
        vm.stopPrank();

        mockEscrow = new MockEscrow(steward);
    }

    function test_RegisterListing() public {
        vm.prank(admin);
        bytes32 slug = keccak256("clean");
        bytes32 initialHash = keccak256("initial-storage");

        uint256 id = hub.registerListing(slug, steward, address(mockEscrow), inferenceProvider, initialHash);
        require(id == 1, "ID != 1");

        (StillworksHourlyProtocolHub.HealthStatus status, uint256 secondsSince) = hub.getProductHealth(1);
        require(uint8(status) == uint8(StillworksHourlyProtocolHub.HealthStatus.Active), "Status not Active");
        require(secondsSince == 0, "secondsSince != 0");
    }

    function test_HourlyUpkeepAndRingBuffer() public {
        vm.prank(admin);
        bytes32 slug = keccak256("clean");
        hub.registerListing(slug, steward, address(mockEscrow), inferenceProvider, keccak256("init"));

        bytes32 snap1 = keccak256("epoch-1-snapshot");
        vm.prank(keeper);
        hub.performHourlyUpkeep(snap1);

        require(hub.currentEpoch() == 1, "Epoch != 1");
        require(hub.latestPlatformSnapshotHash() == snap1, "Hash mismatch");

        (bytes32 storedSnap, uint256 ts) = hub.getHistoricalSnapshot(1);
        require(storedSnap == snap1, "Stored snapshot mismatch");
        require(ts > 0, "Timestamp 0");

        // Advance 1 hour and run Epoch 2
        vm.warp(block.timestamp + 1 hours);
        bytes32 snap2 = keccak256("epoch-2-snapshot");
        vm.prank(keeper);
        hub.performHourlyUpkeep(snap2);

        require(hub.currentEpoch() == 2, "Epoch != 2");
        (bytes32 storedSnap2, ) = hub.getHistoricalSnapshot(2);
        require(storedSnap2 == snap2, "Snapshot 2 mismatch");
    }

    function test_HeartbeatTimeoutAndAbandonment() public {
        vm.prank(admin);
        bytes32 slug = keccak256("clean");
        hub.registerListing(slug, steward, address(mockEscrow), inferenceProvider, keccak256("init"));

        // Advance 1.5 hours without heartbeat -> GracePeriod
        vm.warp(block.timestamp + 1.5 hours);
        vm.prank(keeper);
        hub.performHourlyUpkeep(keccak256("snap-1"));

        (StillworksHourlyProtocolHub.HealthStatus statusGrace, ) = hub.getProductHealth(1);
        require(uint8(statusGrace) == uint8(StillworksHourlyProtocolHub.HealthStatus.GracePeriod), "Not GracePeriod");

        // Advance past 2.5 hours without heartbeat -> Abandoned
        vm.warp(block.timestamp + 1 hours);
        vm.prank(keeper);
        hub.performHourlyUpkeep(keccak256("snap-2"));

        (StillworksHourlyProtocolHub.HealthStatus statusAbandoned, ) = hub.getProductHealth(1);
        require(uint8(statusAbandoned) == uint8(StillworksHourlyProtocolHub.HealthStatus.Abandoned), "Not Abandoned");
    }

    function test_AutonomousInferenceReplenishment() public {
        vm.prank(admin);
        bytes32 slug = keccak256("clean");
        hub.registerListing(slug, steward, address(mockEscrow), inferenceProvider, keccak256("init"));

        // Keeper triggers automated inference quota replenishment without steward
        vm.prank(keeper);
        hub.replenishInferenceQuota(1, 10 * 10**6);

        require(mockEscrow.opsReserve() == 40 * 10**6, "Ops reserve not deducted");
    }

    function test_SuccessionProposalFlow() public {
        vm.prank(admin);
        bytes32 slug = keccak256("clean");
        hub.registerListing(slug, steward, address(mockEscrow), inferenceProvider, keccak256("init"));

        // Fast forward 3 hours so module is declared Abandoned
        vm.warp(block.timestamp + 3 hours);
        vm.prank(keeper);
        hub.performHourlyUpkeep(keccak256("snap-abandoned"));

        // Community developer submits succession proposal
        vm.prank(successor);
        uint256 proposalId = hub.submitSuccessionProposal(
            1,
            successor,
            keccak256("new-frontend-0g"),
            keccak256("new-walkaway-root")
        );

        require(proposalId == 1, "ProposalId != 1");

        // Community voter votes
        address voter2 = address(0x999);
        vm.prank(voter2);
        hub.voteOnProposal(1);

        // Fast forward 25 hours past voting deadline
        vm.warp(block.timestamp + 25 hours);

        // Execute succession
        hub.executeSuccession(1);

        // Verify steward updated on hub and escrow
        (StillworksHourlyProtocolHub.HealthStatus status, ) = hub.getProductHealth(1);
        require(uint8(status) == uint8(StillworksHourlyProtocolHub.HealthStatus.Active), "Status not Active post-succession");
        require(mockEscrow.steward() == successor, "Escrow steward != successor");
    }
}

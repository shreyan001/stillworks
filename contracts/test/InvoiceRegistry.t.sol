// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {InvoiceRegistry} from "../src/InvoiceRegistry.sol";

interface Vm {
    function warp(uint256) external;
    function prank(address) external;
    function expectRevert(bytes4) external;
}

contract InvoiceRegistryTest {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    InvoiceRegistry internal registry;

    address internal escrow = address(0x10);
    address internal steward = address(0x20);
    address internal founder = address(0x100);
    address internal subscriber = address(0x400);
    address internal stranger = address(0x500);
    address internal newEscrow = address(0x600);
    address internal newSteward = address(0x700);

    bytes32 internal constant HEARTBEAT_TX = keccak256("heartbeat-tx-hash-0g");
    string internal constant AUDIT_REQUEST_ID = "0g-req-abc-12345-audit";

    function setUp() public {
        registry = new InvoiceRegistry(escrow, steward);
    }

    function testInitialState() public view {
        require(registry.escrow() == escrow, "escrow mismatch");
        require(registry.steward() == steward, "steward mismatch");
        require(registry.nextInvoiceId() == 1, "nextInvoiceId initial");
    }

    function testMintAuthorizedEscrow() public {
        uint256 agreementId = 42;
        uint256 period = 1;
        uint256 amount = 1 ether;

        vm.warp(1700000000);

        vm.prank(escrow);
        uint256 invoiceId = registry.mint(
            agreementId,
            period,
            amount,
            founder,
            subscriber,
            HEARTBEAT_TX,
            AUDIT_REQUEST_ID
        );

        require(invoiceId == 1, "first invoiceId should be 1");
        require(registry.nextInvoiceId() == 2, "nextInvoiceId should increment");

        InvoiceRegistry.Invoice memory inv = registry.getInvoice(invoiceId);
        require(inv.agreementId == agreementId, "agreementId match");
        require(inv.period == period, "period match");
        require(inv.amount == amount, "amount match");
        require(inv.timestamp == 1700000000, "timestamp match");
        require(inv.founder == founder, "founder match");
        require(inv.subscriber == subscriber, "subscriber match");
        require(inv.heartbeatTx == HEARTBEAT_TX, "heartbeatTx match");
        require(
            keccak256(bytes(inv.auditRequestId)) == keccak256(bytes(AUDIT_REQUEST_ID)),
            "auditRequestId match"
        );
    }

    function testMintMultipleInvoicesSequential() public {
        vm.prank(escrow);
        uint256 id1 = registry.mint(1, 1, 0.5 ether, founder, subscriber, HEARTBEAT_TX, "trace-1");

        bytes32 secondTx = keccak256("second-tx");
        vm.prank(escrow);
        uint256 id2 = registry.mint(1, 2, 0.5 ether, founder, subscriber, secondTx, "trace-2");

        require(id1 == 1, "id1 == 1");
        require(id2 == 2, "id2 == 2");
        require(registry.nextInvoiceId() == 3, "next == 3");

        InvoiceRegistry.Invoice memory inv1 = registry.getInvoice(1);
        InvoiceRegistry.Invoice memory inv2 = registry.getInvoice(2);

        require(inv1.period == 1, "inv1 period");
        require(inv2.period == 2, "inv2 period");
        require(inv2.heartbeatTx == secondTx, "inv2 tx");
        require(
            keccak256(bytes(inv2.auditRequestId)) == keccak256(bytes("trace-2")),
            "inv2 trace"
        );
    }

    function testMintRevertsNonEscrow() public {
        vm.prank(stranger);
        vm.expectRevert(InvoiceRegistry.NotEscrow.selector);
        registry.mint(1, 1, 1 ether, founder, subscriber, HEARTBEAT_TX, AUDIT_REQUEST_ID);

        // Steward is not escrow and cannot mint directly
        vm.prank(steward);
        vm.expectRevert(InvoiceRegistry.NotEscrow.selector);
        registry.mint(1, 1, 1 ether, founder, subscriber, HEARTBEAT_TX, AUDIT_REQUEST_ID);
    }

    function testStewardCanUpdateEscrow() public {
        vm.prank(steward);
        registry.setEscrow(newEscrow);
        require(registry.escrow() == newEscrow, "escrow updated");

        // Old escrow cannot mint anymore
        vm.prank(escrow);
        vm.expectRevert(InvoiceRegistry.NotEscrow.selector);
        registry.mint(1, 1, 1 ether, founder, subscriber, HEARTBEAT_TX, AUDIT_REQUEST_ID);

        // New escrow can mint
        vm.prank(newEscrow);
        uint256 invoiceId = registry.mint(1, 1, 1 ether, founder, subscriber, HEARTBEAT_TX, AUDIT_REQUEST_ID);
        require(invoiceId == 1, "minted by new escrow");
    }

    function testNonStewardCannotUpdateEscrow() public {
        vm.prank(stranger);
        vm.expectRevert(InvoiceRegistry.NotSteward.selector);
        registry.setEscrow(newEscrow);

        vm.prank(escrow);
        vm.expectRevert(InvoiceRegistry.NotSteward.selector);
        registry.setEscrow(newEscrow);
    }

    function testSetEscrowRejectsZeroAddress() public {
        vm.prank(steward);
        vm.expectRevert(InvoiceRegistry.ZeroAddress.selector);
        registry.setEscrow(address(0));
    }

    function testStewardCanUpdateSteward() public {
        vm.prank(steward);
        registry.setSteward(newSteward);
        require(registry.steward() == newSteward, "steward updated");

        // Old steward loses control
        vm.prank(steward);
        vm.expectRevert(InvoiceRegistry.NotSteward.selector);
        registry.setEscrow(newEscrow);

        // New steward has control
        vm.prank(newSteward);
        registry.setEscrow(newEscrow);
        require(registry.escrow() == newEscrow, "updated by new steward");
    }

    function testNonStewardCannotUpdateSteward() public {
        vm.prank(stranger);
        vm.expectRevert(InvoiceRegistry.NotSteward.selector);
        registry.setSteward(newSteward);
    }

    function testSetStewardRejectsZeroAddress() public {
        vm.prank(steward);
        vm.expectRevert(InvoiceRegistry.ZeroAddress.selector);
        registry.setSteward(address(0));
    }

    function testConstructorRejectsZeroSteward() public {
        (bool ok, ) = address(this).call(
            abi.encodeWithSignature("deployInvalidRegistry()")
        );
        require(!ok, "constructor should revert with zero steward");
    }

    function deployInvalidRegistry() external {
        new InvoiceRegistry(escrow, address(0));
    }

    function testGetInvoiceRevertsUnknown() public {
        vm.expectRevert(InvoiceRegistry.UnknownInvoice.selector);
        registry.getInvoice(0);

        vm.expectRevert(InvoiceRegistry.UnknownInvoice.selector);
        registry.getInvoice(1);

        vm.expectRevert(InvoiceRegistry.UnknownInvoice.selector);
        registry.getInvoice(999);
    }
}

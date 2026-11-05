// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ProductRegistry} from "../src/ProductRegistry.sol";

contract Caller {
    function register(
        ProductRegistry registry,
        bytes32 passportRoot,
        bytes32 frontendRoot,
        address heartbeatSigner,
        address steward
    ) external returns (uint256) {
        return registry.register(passportRoot, frontendRoot, heartbeatSigner, steward);
    }

    function propose(ProductRegistry registry, uint256 productId, bytes32 newRoot) external {
        registry.proposePassport(productId, newRoot);
    }

    function approve(ProductRegistry registry, uint256 productId) external {
        registry.approvePassport(productId);
    }

    function beat(ProductRegistry registry, uint256 productId, uint256 period, bytes32 statusHash) external {
        registry.heartbeat(productId, period, statusHash);
    }
}

contract ProductRegistryTest {
    ProductRegistry internal registry;
    Caller internal founder;
    Caller internal steward;
    Caller internal signer;
    Caller internal stranger;

    bytes32 internal constant PASSPORT = keccak256("passport");
    bytes32 internal constant FRONTEND = keccak256("frontend");
    bytes32 internal constant NEXT_PASSPORT = keccak256("next-passport");
    bytes32 internal constant STATUS_HASH = keccak256("up");

    function setUp() public {
        registry = new ProductRegistry();
        founder = new Caller();
        steward = new Caller();
        signer = new Caller();
        stranger = new Caller();
    }

    function testRegisterStoresListing() public {
        uint256 productId = _register();
        ProductRegistry.Product memory product = registry.getProduct(productId);

        require(productId == 1, "first id");
        require(product.founder == address(founder), "founder");
        require(product.steward == address(steward), "steward");
        require(product.heartbeatSigner == address(signer), "signer");
        require(product.passportRoot == PASSPORT, "passport");
        require(product.frontendRoot == FRONTEND, "frontend");
        require(product.status == ProductRegistry.Status.Pending, "pending");
    }

    function testRejectsZeroStewardOrSigner() public {
        (bool stewardOk,) = address(founder).call(
            abi.encodeCall(Caller.register, (registry, PASSPORT, FRONTEND, address(signer), address(0)))
        );
        (bool signerOk,) = address(founder).call(
            abi.encodeCall(Caller.register, (registry, PASSPORT, FRONTEND, address(0), address(steward)))
        );
        require(!stewardOk && !signerOk, "zero address accepted");
    }

    function testOnlyFounderProposesAndOnlyStewardApproves() public {
        uint256 productId = _register();

        (bool strangerPropose,) = address(stranger).call(
            abi.encodeCall(Caller.propose, (registry, productId, NEXT_PASSPORT))
        );
        require(!strangerPropose, "stranger proposed");

        founder.propose(registry, productId, NEXT_PASSPORT);

        (bool strangerApprove,) = address(stranger).call(
            abi.encodeCall(Caller.approve, (registry, productId))
        );
        require(!strangerApprove, "stranger approved");

        steward.approve(registry, productId);
        ProductRegistry.Product memory product = registry.getProduct(productId);
        require(product.passportRoot == NEXT_PASSPORT, "root not updated");
        require(product.status == ProductRegistry.Status.Active, "not active");
        require(!product.hasProposal, "proposal still open");
    }

    function testHeartbeatMustBeNewerAndFromSigner() public {
        uint256 productId = _register();

        (bool strangerBeat,) = address(stranger).call(
            abi.encodeCall(Caller.beat, (registry, productId, 1, STATUS_HASH))
        );
        require(!strangerBeat, "stranger heartbeat");

        (bool oldPeriod,) = address(signer).call(
            abi.encodeCall(Caller.beat, (registry, productId, 0, STATUS_HASH))
        );
        require(!oldPeriod, "period 0 accepted");

        signer.beat(registry, productId, 1, STATUS_HASH);
        require(registry.getProduct(productId).lastHeartbeatPeriod == 1, "period not stored");

        (bool repeat,) = address(signer).call(
            abi.encodeCall(Caller.beat, (registry, productId, 1, STATUS_HASH))
        );
        require(!repeat, "same period accepted");

        signer.beat(registry, productId, 2, STATUS_HASH);
        require(registry.getProduct(productId).lastHeartbeatPeriod == 2, "second period");
    }

    function _register() internal returns (uint256) {
        return founder.register(registry, PASSPORT, FRONTEND, address(signer), address(steward));
    }
}

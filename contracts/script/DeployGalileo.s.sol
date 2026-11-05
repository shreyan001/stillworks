// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ProductRegistry} from "../src/ProductRegistry.sol";
import {SubscriptionAgreement} from "../src/SubscriptionAgreement.sol";
import {SubscriptionEscrow} from "../src/SubscriptionEscrow.sol";
import {InvoiceRegistry} from "../src/InvoiceRegistry.sol";

interface Vm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envOr(string calldata, uint256) external view returns (uint256);
}

/// @notice Deployment script for Stillworks core contracts on 0G Galileo (Chain ID: 16602)
/// @dev Run with:
///      forge script script/DeployGalileo.s.sol --rpc-url https://evmrpc-testnet.0g.ai --broadcast
contract DeployGalileo {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    ProductRegistry public registry;
    SubscriptionAgreement public agreement;
    SubscriptionEscrow public escrow;
    InvoiceRegistry public invoiceRegistry;

    function run() external returns (address registryAddr, address agreementAddr, address escrowAddr, address invoiceRegistryAddr) {
        uint256 deployerKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerKey == 0) {
            deployerKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        }

        if (deployerKey != 0) {
            vm.startBroadcast(deployerKey);
        } else {
            vm.startBroadcast();
        }

        // 1. Deploy ProductRegistry (listing, passport roots, heartbeats)
        registry = new ProductRegistry();
        registryAddr = address(registry);

        // 2. Deploy SubscriptionAgreement (terms, subscriber records, walkaway roots)
        agreement = new SubscriptionAgreement(registryAddr);
        agreementAddr = address(agreement);

        // 3. Deploy SubscriptionEscrow (locked funds, periodic release, pro-rata refund rail)
        // Default steward set to msg.sender (deployer)
        escrow = new SubscriptionEscrow(registryAddr, agreementAddr, msg.sender);
        escrowAddr = address(escrow);

        // 4. Deploy InvoiceRegistry (non-transferable receipts for escrow releases)
        invoiceRegistry = new InvoiceRegistry(escrowAddr, msg.sender);
        invoiceRegistryAddr = address(invoiceRegistry);

        // 5. Wire InvoiceRegistry into SubscriptionEscrow
        escrow.setInvoiceRegistry(invoiceRegistryAddr);

        vm.stopBroadcast();
    }
}

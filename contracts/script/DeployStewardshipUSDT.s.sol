// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ProductRegistry} from "../src/ProductRegistry.sol";
import {MockUSDT} from "../src/MockUSDT.sol";
import {StewardshipEscrowPayments} from "../src/StewardshipEscrowPayments.sol";
import {ProductHealthReceiver} from "../src/ProductHealthReceiver.sol";

interface Vm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envOr(string calldata, uint256) external view returns (uint256);
}

/// @notice Deployment script for Stillworks USDT Stewardship Escrow on 0G Galileo (Chain ID: 16602)
contract DeployStewardshipUSDT {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    ProductRegistry public registry;
    MockUSDT public usdt;
    StewardshipEscrowPayments public escrow;
    ProductHealthReceiver public receiver;

    function run() external returns (address registryAddr, address usdtAddr, address escrowAddr, address receiverAddr) {
        uint256 deployerKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerKey == 0) {
            deployerKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        }

        if (deployerKey != 0) {
            vm.startBroadcast(deployerKey);
        } else {
            vm.startBroadcast();
        }

        // 1. Deploy MockUSDT (6-decimal Tether token with open faucet)
        usdt = new MockUSDT();
        usdtAddr = address(usdt);

        // 2. Deploy ProductRegistry
        registry = new ProductRegistry();
        registryAddr = address(registry);

        // 3. Register Clean (Flagship product #1)
        bytes32 passportRoot = keccak256("clean-passport-v1-0g-turbo");
        bytes32 frontendRoot = keccak256("stillworks-frontend-v1-0g");
        uint256 cleanId = registry.register(passportRoot, frontendRoot, msg.sender, msg.sender);

        // 4. Deploy StewardshipEscrowPayments for Clean with USDT billing
        escrow = new StewardshipEscrowPayments(registryAddr, usdtAddr, cleanId, msg.sender);
        escrowAddr = address(escrow);

        // 5. Deploy ProductHealthReceiver for CRE and sidecar reports
        receiver = new ProductHealthReceiver(msg.sender, msg.sender);
        receiverAddr = address(receiver);

        vm.stopBroadcast();
    }
}

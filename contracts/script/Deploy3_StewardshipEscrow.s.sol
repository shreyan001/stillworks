// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {StillworksHub} from "../src/StillworksHub.sol";
import {MockUSDT} from "../src/MockUSDT.sol";
import {StewardshipEscrowPayments} from "../src/StewardshipEscrowPayments.sol";

interface Vm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envOr(string calldata, uint256) external view returns (uint256);
}

contract Deploy3_StewardshipEscrow {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    address public constant VERIFIED_USDT = 0x6A8c371B01A9b9657c3bfbF8677c96408145B512;
    address public constant VERIFIED_HUB = 0x6939b3e9FB99Ef0005a3e6dd8Ed223E121c51460;
    address public constant DEPLOYER = 0x237eA22D38a1e20EC50b39711014B9C87dBb21c7;

    function run() external returns (address escrowAddr, uint256 cleanId) {
        uint256 deployerKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerKey == 0) {
            deployerKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        }

        if (deployerKey != 0) {
            vm.startBroadcast(deployerKey);
        } else {
            vm.startBroadcast();
        }

        StillworksHub hub = StillworksHub(VERIFIED_HUB);

        // 1. Register Clean on StillworksHub
        bytes32 slugHash = keccak256("clean");
        bytes32 passportRoot = keccak256("clean-passport-v1-0g-turbo");
        cleanId = hub.registerListing(slugHash, DEPLOYER, address(0), passportRoot);

        // 2. Deploy StewardshipEscrowPayments for Clean (productId = 1)
        StewardshipEscrowPayments escrow = new StewardshipEscrowPayments(
            VERIFIED_HUB,
            VERIFIED_USDT,
            cleanId,
            DEPLOYER
        );
        escrowAddr = address(escrow);

        // 3. Authorize Escrow on StillworksHub
        hub.setEscrowAuthorization(escrowAddr, true);

        vm.stopBroadcast();
    }
}

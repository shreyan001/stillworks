// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {StillworksHub} from "../src/StillworksHub.sol";

interface Vm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envOr(string calldata, uint256) external view returns (uint256);
}

contract Deploy2_StillworksHub {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    // Verified MockUSDT deployed address on 0G Galileo (Checksummed)
    address public constant VERIFIED_USDT = 0x6A8c371B01A9b9657c3bfbF8677c96408145B512;
    address public constant DEPLOYER = 0x237eA22D38a1e20EC50b39711014B9C87dBb21c7;

    function run() external returns (address hubAddr) {
        uint256 deployerKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerKey == 0) {
            deployerKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        }

        if (deployerKey != 0) {
            vm.startBroadcast(deployerKey);
        } else {
            vm.startBroadcast();
        }

        StillworksHub hub = new StillworksHub(VERIFIED_USDT, DEPLOYER);
        hubAddr = address(hub);

        vm.stopBroadcast();
    }
}

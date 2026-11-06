// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {MockUSDT} from "../src/MockUSDT.sol";

interface Vm {
    function startBroadcast() external;
    function startBroadcast(uint256 privateKey) external;
    function stopBroadcast() external;
    function envOr(string calldata, uint256) external view returns (uint256);
}

contract Deploy1_MockUSDT {
    Vm internal constant vm = Vm(address(bytes20(uint160(uint256(keccak256("hevm cheat code"))))));

    function run() external returns (address usdtAddr) {
        uint256 deployerKey = vm.envOr("PRIVATE_KEY", uint256(0));
        if (deployerKey == 0) {
            deployerKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        }

        if (deployerKey != 0) {
            vm.startBroadcast(deployerKey);
        } else {
            vm.startBroadcast();
        }

        MockUSDT usdt = new MockUSDT();
        usdtAddr = address(usdt);

        vm.stopBroadcast();
    }
}

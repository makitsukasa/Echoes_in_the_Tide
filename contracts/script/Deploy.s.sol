// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Bottle.sol";
import "../src/Ocean.sol";

contract DeployScript is Script {
	function run() external {
		// デプロイに使う秘密鍵（.env経由で読み込む）
		uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

		vm.startBroadcast(deployerPrivateKey);

		// Bottleを先にデプロイ
		Bottle bottle = new Bottle();

		// OceanはBottleのアドレスを受け取る
		Ocean ocean = new Ocean(address(bottle));

		// OceanにBottleのminter権限を付与
		bottle.setOceanAddress(address(ocean));

		vm.stopBroadcast();

		console.log("Bottle deployed at:", address(bottle));
		console.log("Ocean deployed at:", address(ocean));
	}
}

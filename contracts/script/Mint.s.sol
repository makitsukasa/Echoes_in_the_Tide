// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Ocean.sol";

contract MintScript is Script {
	function run() external {
		// .envなどから秘密鍵を読み込み
		uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");

		// 事前にデプロイされたOceanコントラクトのアドレスを入力
		address oceanAddress = 0xf4d6a4610095f29C7303305a7D2a031Af0cEF835;

		// アップロード済みのmetadata URI
		string memory tokenURI = "ipfs://bafybeifjox2ei7u5wn36b3vynjoj5fbjlht5xchdakuolac6kv2bktj4ye/0.json";

		vm.startBroadcast(userPrivateKey);

		Ocean ocean = Ocean(oceanAddress);
		ocean.mintAndAssign(tokenURI);

		vm.stopBroadcast();
	}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Ocean.sol";

contract ClaimScript is Script {
    function run() external {
        // NFTを拾うユーザーの秘密鍵
        uint256 userPrivateKey = vm.envUint("PRIVATE_KEY");

        // 既にデプロイされたOceanコントラクトのアドレス
        address oceanAddress = 0xf4d6a4610095f29C7303305a7D2a031Af0cEF835;

        // 拾いたい tokenId（mintAndAssign 後に Ocean が所有している tokenId）
        uint256 tokenId = 0; // 必要に応じて変更

        vm.startBroadcast(userPrivateKey);

        Ocean ocean = Ocean(oceanAddress);
        ocean.claim(tokenId);

        vm.stopBroadcast();
    }
}

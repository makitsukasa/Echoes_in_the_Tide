// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Bottle.sol";

contract Ocean {
Bottle public bottle;
	constructor(address _bottle) {
		bottle = Bottle(_bottle);
	}

	/// NFTをmintして海に流す（tokenURIを与える）
	function mintAndAssign(string memory tokenURI) external payable {
		// 料金などの制御が必要ならここで追加可能
		uint256 tokenId = bottle.mintToOcean(tokenURI);
		// tokenIdと流した人の紐付けを覚えておきたければ mapping に保存
	}

	/// 海に流れているNFTを拾う
	function claim(uint256 tokenId) external payable {
		require(bottle.ownerOf(tokenId) == address(this), "Not drifting in the ocean");
		bottle.transferBottle(tokenId, msg.sender);
	}
}

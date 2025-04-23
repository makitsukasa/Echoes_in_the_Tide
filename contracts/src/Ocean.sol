// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Bottle.sol";

contract Ocean {
	Bottle public bottle;

	event BottleMinted(address indexed sender, uint256 tokenId, string tokenURI);
	event BottleClaimed(address indexed claimer, uint256 tokenId);

	constructor(address _bottle) {
		bottle = Bottle(_bottle);
	}

	/// NFTをmintして海に流す（tokenURIを与える）
	function mintAndAssign(string memory tokenURI) external payable {
		uint256 tokenId = bottle.mintToOcean(tokenURI);
		emit BottleMinted(msg.sender, tokenId, tokenURI);
	}

	/// 海に流れているNFTを拾う
	function claim(uint256 tokenId) external payable {
		require(bottle.ownerOf(tokenId) == address(this), "Not drifting in the ocean");
		bottle.transferBottle(tokenId, msg.sender);
		emit BottleClaimed(msg.sender, tokenId);
	}
}

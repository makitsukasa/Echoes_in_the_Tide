// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bottle is ERC721URIStorage, Ownable {
	uint256 public nextTokenId;
	address public ocean;

	modifier onlyOcean() {
		require(msg.sender == ocean, "Only Ocean can call this");
		_;
	}

	constructor() ERC721("Bottle", "BTL") Ownable(msg.sender) {}

	function setOceanAddress(address _ocean) external onlyOwner {
		ocean = _ocean;
	}

	function mintToOcean(string memory uri) external onlyOcean returns (uint256) {
		uint256 tokenId = nextTokenId++;
		_mint(ocean, tokenId);
		_setTokenURI(tokenId, uri);
		return tokenId;
	}

	function transferBottle(uint256 tokenId, address to) external onlyOcean {
		_transfer(ocean, to, tokenId);
	}
}

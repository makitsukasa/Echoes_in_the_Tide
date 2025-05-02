// コントラクトのアドレス
export const CONTRACT_ADDRESSES = {
  OCEAN: "0xA01f4A6b456122e1e745d113e61aaBe1AbEfB422"   // Ocean コントラクトのアドレス
} as const;

// ABI（インターフェース定義）
export const CONTRACT_ABIS = {
  OCEAN: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "tokenURI",
          "type": "string"
        }
      ],
      "name": "mintAndAssign",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ]
} as const;

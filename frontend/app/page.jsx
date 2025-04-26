"use client";

import { useState, useEffect } from 'react';
import Button from './components/Button';
import Modal from './components/Modal';
import { fetchBottles } from './components/FetchBottles';
import { connectWallet, getWalletAddress, mintAndAssignToOcean, claimBottle } from './lib/callcontracts';
import axios from 'axios';

async function onThrowBottleClick() {
  await connectWallet();
  await mintAndAssignToOcean("ipfs://your-token-uri");
}

async function onClaimClick(tokenId) {
  await connectWallet();
  await claimBottle(tokenId);
}

export default function Home() {
  const [bottles, setBottles] = useState([]);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    async function getBottles() {
      const data = await fetchBottles();
      setBottles(data);
    }
    getBottles();
  }, []);

  const handleWalletConnect = async () => {
    if(connectWallet()){
      const address = getWalletAddress();
      setWalletAddress(address);
    }
  };

  const handleBottleClick = async (tokenURI) => {
    try {
      const response = await axios.get(tokenURI);
      setSelectedBottle(response.data);
    } catch (error) {
      console.error("データ取得に失敗しました:", error);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8 text-center">放置ゲーム - Drift Bottles</h1>

      <div className="flex justify-center gap-4">
        {bottles.map((bottle) => (
          <Button
            key={bottle.id}
            id={bottle.id}
            tokenURI={bottle.tokenURI}
            onClick={handleBottleClick}
          />
        ))}
      </div>

      {walletAddress ? (
        <p>ウォレットアドレス: {walletAddress}</p>
      ) : (
        <button onClick={handleWalletConnect}>ウォレット接続</button>
      )}

      <Modal data={selectedBottle} onClose={() => setSelectedBottle(null)} />
    </div>
  );
}

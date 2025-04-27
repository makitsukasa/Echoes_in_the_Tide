"use client";

import { useState, useEffect } from 'react';
import Button from './components/Button';
import BottleDetailModal from './components/BottleDetailModal';
import ThrowBottleModal from './components/ThrowBottleModal';
import { fetchBottles } from './lib/fetchBottles';
import { connectWallet, getWalletAddress, mintAndAssignToOcean, claimBottle } from './lib/callcontracts';
import { uploadToIPFS } from './lib/pinata';

export default function Home() {
  const [bottles, setBottles] = useState([]);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isThrowModalOpen, setIsThrowModalOpen] = useState(false);

  useEffect(() => {
    async function getBottles() {
      const data = await fetchBottles();
      setBottles(data);
    }
    getBottles();
  }, []);

  const handleWalletConnect = async () => {
    if(await connectWallet()){
      const address = await getWalletAddress();
      setWalletAddress(address);
    }
  };

  const handleBottleClick = async (bottle) => {
    try {
      console.log('Selected bottle:', bottle); // デバッグ用
      setSelectedBottle(bottle);
    } catch (error) {
      console.error("データ取得に失敗しました:", error);
    }
  };

  const handleThrowBottle = async (formData) => {
    try {
      const tokenURI = await uploadToIPFS(formData);
      await mintAndAssignToOcean(tokenURI);
      // ボトルリストを更新
      const data = await fetchBottles();
      setBottles(data);
    } catch (error) {
      console.error("ボトル投げに失敗しました:", error);
    }
  };

  const handleClaimBottle = async (tokenId) => {
    try {
      console.log('Claiming bottle with tokenId:', tokenId); // デバッグ用
      await claimBottle(tokenId);
      // ボトルリストを更新
      const data = await fetchBottles();
      setBottles(data);
      setSelectedBottle(null); // モーダルを閉じる
    } catch (error) {
      console.error("ボトルの取得に失敗しました:", error);
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
            name={bottle.name}
            description={bottle.description}
            image={bottle.image}
            onClick={() => handleBottleClick(bottle)}
          />
        ))}
      </div>

      {walletAddress ? (
        <div className="flex flex-col items-center gap-4 mt-8">
          <p>ウォレット接続済み: {walletAddress}</p>
          <button
            onClick={() => setIsThrowModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ボトルを投げる
          </button>
        </div>
      ) : (
        <button
          onClick={handleWalletConnect}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          ウォレット接続
        </button>
      )}

      <BottleDetailModal
        data={selectedBottle}
        onClose={() => setSelectedBottle(null)}
        onClaim={handleClaimBottle}
      />
      <ThrowBottleModal
        isOpen={isThrowModalOpen}
        onClose={() => setIsThrowModalOpen(false)}
        onSubmit={handleThrowBottle}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Button from "./components/Button";
import BottleDetailModal from "./components/BottleDetailModal";
import ThrowBottleModal from "./components/ThrowBottleModal";
import { fetchBottles } from "./lib/fetchBottles";
import { connectWallet, getWalletAddress, mintAndAssignToOcean, claimBottle } from "./lib/callcontracts";
import { uploadToIPFS } from "./lib/pinata";

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
    if (await connectWallet()) {
      const address = await getWalletAddress();
      setWalletAddress(address);
    }
  };

  const handleBottleClick = async (bottle) => {
    try {
      setSelectedBottle(bottle);
    } catch (error) {
      console.error("小瓶の中身を取得できませんでした:", error);
    }
  };

  const handleThrowBottle = async (formData) => {
    try {
      const tokenURI = await uploadToIPFS(formData);
      await mintAndAssignToOcean(tokenURI);
      const data = await fetchBottles();
      setBottles(data);
    } catch (error) {
      console.error("小瓶を海に流せませんでした:", error);
    }
  };

  const handleClaimBottle = async (tokenId) => {
    try {
      await claimBottle(tokenId);
      const data = await fetchBottles();
      setBottles(data);
      setSelectedBottle(null);
    } catch (error) {
      console.error("小瓶を拾い上げられませんでした:", error);
    }
  };

  return (
    <div
      className="min-h-screen p-0 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, #cce5ff, #99ccff)",
        fontFamily: "'Comfortaa', cursive",
      }}
    >
      {/* 背景の波（奥） */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <div className="wave" />
      </div>

      {/* メインコンテンツ */}
      <div className="z-10 flex flex-col items-center w-full pt-20">
        <div className="flex flex-wrap justify-center gap-8 p-4 relative">
          {bottles.map((bottle) => (
            <div
              key={bottle.id}
              className="relative w-32 h-32 flex items-center justify-center animate-bob cursor-pointer"
              onClick={() => handleBottleClick(bottle)}
            >
              <div className="w-24 h-24 p-2 rounded-full backdrop-blur-md bg-white/30 border-2 border-white/50 shadow-lg overflow-hidden">
              <img
                src="/bottle.svg"
                alt="Bottle"
                className="object-contain w-full h-full drop-shadow-lg"
                width="20%"
                height="20%"
              />
              </div>
            </div>
          ))}
        </div>

        {/* ウォレットと投げるボタン */}
        {walletAddress ? (
          <div className="flex flex-col items-center gap-4 mt-8">
            <p className="text-white/90">ウォレット接続中: {walletAddress}</p>
            <button
              onClick={() => setIsThrowModalOpen(true)}
              className="px-6 py-3 bg-blue-400/80 text-white rounded-full hover:bg-blue-500 transition-all backdrop-blur-sm"
            >
              小瓶を流す
            </button>
          </div>
        ) : (
          <button
            onClick={handleWalletConnect}
            className="px-6 py-3 bg-blue-400/80 text-white rounded-full hover:bg-blue-500 transition-all backdrop-blur-sm"
          >
            ウォレット接続
          </button>
        )}
      </div>

      {/* モーダルたち */}
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

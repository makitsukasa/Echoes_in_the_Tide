// frontend/src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [account, setAccount] = useState<string>("");

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } else {
      alert("MetaMaskが見つかりません");
    }
  }

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Echoes in the Tide</h1>
      <button
        onClick={connectWallet}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Connect MetaMask
      </button>
      {account && <p className="mt-4">接続済みアカウント: {account}</p>}
    </main>
  );
}

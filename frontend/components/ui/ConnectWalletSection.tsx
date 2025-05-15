"use client"

import { ConnectWallet } from "@/components/ui/connect-wallet"
import { FC } from "react"

interface ConnectWalletSectionProps {
  title: string
  description: string
}

export const ConnectWalletSection: FC<ConnectWalletSectionProps> = ({ title, description }) => {
  const handleConnectWallet = () => {
    window.dispatchEvent(new CustomEvent('connectWallet'))
  }

  return (
    <div className="flex flex-col items-center gap-4 p-10 text-center">
      <h3 className="text-xl font-medium text-blue-800">{title}</h3>
      <p className="text-blue-700">{description}</p>
      <ConnectWallet onConnect={handleConnectWallet} />
    </div>
  )
}

'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

function WalletConnectButtonInner() {
  const [mounted, setMounted] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { address, isConnected, status } = useAccount()
  const { connect, connectors, error: connectError } = useConnect()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    setMounted(true)
    setIsConnecting(false)
    return () => {
      setIsConnecting(false)
    }
  }, [])

  const metaMask = connectors.find(c => c.type === 'injected' && c.name === 'MetaMask')
  const walletConnect = connectors.find(c => c.id === 'walletConnect')

  useEffect(() => {
    console.log('接続状態:', { status, isConnected, address, isConnecting })
    if (connectError) {
      console.error('接続エラー:', connectError)
      setIsConnecting(false)
    }
  }, [status, isConnected, address, connectError, isConnecting])

  useEffect(() => {
    if (isConnected) {
      setIsConnecting(false)
      console.log('接続完了:', { address, status })
    }
  }, [isConnected, address, status])

  if (!mounted) {
    return null
  }

  const handleConnect = async (connector: any) => {
    if (isConnecting) return

    try {
      setIsConnecting(true)
      console.log('接続を試みます:', connector.name)
      await connect({ connector })
      console.log('接続成功:', { status, isConnected, address })
    } catch (error) {
      console.error('接続エラー:', error)
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setIsConnecting(false)
      console.log('切断完了')
    } catch (error) {
      console.error('切断エラー:', error)
    }
  }

  if (isConnected && address) {
    return (
      <button
        onClick={handleDisconnect}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        切断: {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    )
  }

  return (
    <div className="flex gap-2">
      {metaMask && (
        <button
          onClick={() => handleConnect(metaMask)}
          disabled={isConnecting}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {isConnecting ? '接続中...' : 'MetaMaskで接続'}
        </button>
      )}
      {walletConnect && (
        <button
          onClick={() => handleConnect(walletConnect)}
          disabled={isConnecting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isConnecting ? '接続中...' : 'WalletConnectで接続'}
        </button>
      )}
    </div>
  )
}

const WalletConnectButton = dynamic(() => Promise.resolve(WalletConnectButtonInner), {
  ssr: false
})

export default WalletConnectButton

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const WalletConnectButton = dynamic(() => import('./WalletConnectButton'), { ssr: false });

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">波打ち際の小瓶</span>
            </Link>
          </div>

          {/* デスクトップメニュー */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              海を眺める
            </Link>
            <Link href="/throw" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              小瓶を流す
            </Link>
            <Link href="/mybottles" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              拾った小瓶
            </Link>
            <Link href="/setting" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100">
              設定
            </Link>
            <WalletConnectButton />
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">メニューを開く</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
              海を眺める
            </Link>
            <Link href="/throw" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
              小瓶を流す
            </Link>
            <Link href="/mybottles" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
              拾った小瓶
            </Link>
            <Link href="/setting" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100">
              設定
            </Link>
            <div className="px-3 py-2">
              <WalletConnectButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

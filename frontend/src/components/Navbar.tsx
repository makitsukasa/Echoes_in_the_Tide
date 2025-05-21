'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from './ConnectButton';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                波打ち際の小瓶
              </Link>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              海を眺める
            </Link>
            <Link
              href="/throw"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/throw') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              小瓶を流す
            </Link>
            <Link
              href="/mybottles"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/mybottles') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              拾った小瓶
            </Link>
            <Link
              href="/setting"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/setting') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              設定
            </Link>
            <ConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">メニューを開く</span>
              <svg
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setIsOpen(false)}
          >
            海を眺める
          </Link>
          <Link
            href="/throw"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/throw') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setIsOpen(false)}
          >
            小瓶を流す
          </Link>
          <Link
            href="/mybottles"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/mybottles') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setIsOpen(false)}
          >
            拾った小瓶
          </Link>
          <Link
            href="/setting"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/setting') ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
            onClick={() => setIsOpen(false)}
          >
            設定
          </Link>
          <div className="px-3 py-2">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

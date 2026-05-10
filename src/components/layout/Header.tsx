"use client";

import React from "react";
import Link from "next/link";
import { formatAddress } from "@/lib/format";
import { useWallet } from "@/hooks/useWallet";

export function Header() {
  const { address, shortenedAddress, isConnecting, error, connectWallet, disconnectWallet } =
    useWallet();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          GadgetSales
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/create" className="text-gray-700 hover:text-blue-600">
            Create Sale
          </Link>
          <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
            Dashboard
          </Link>
          <div className="border-l border-gray-300 pl-6">
            {error && !address ? (
              <button onClick={() => void connectWallet()} className="text-sm text-red-600 underline">
                {error}
              </button>
            ) : address ? (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div>
                  Connected: <span className="font-mono font-semibold">{shortenedAddress || formatAddress(address)}</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => void connectWallet()}
                disabled={isConnecting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

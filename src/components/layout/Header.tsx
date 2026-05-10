"use client";

import React from "react";
import Link from "next/link";
import { formatAddress } from "@/lib/format";

interface HeaderProps {
  walletAddress?: string;
  onConnect?: () => void;
}

export function Header({ walletAddress, onConnect }: HeaderProps) {
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
            {walletAddress ? (
              <div className="text-sm text-gray-600">
                Connected: <span className="font-mono font-semibold">{formatAddress(walletAddress)}</span>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

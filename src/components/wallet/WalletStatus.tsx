"use client";

import React from "react";
import { formatAddress } from "@/lib/format";
import { useWallet } from "@/hooks/useWallet";

export function WalletStatus() {
  const { address, shortenedAddress, isConnected, isConnecting, error, connectWallet, disconnectWallet } =
    useWallet();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-semibold">Wallet Error</p>
        <p className="text-sm">{error}</p>
        <button onClick={() => void connectWallet()} className="mt-2 text-sm underline hover:no-underline">
          Try connecting again
        </button>
      </div>
    );
  }

  if (!isConnected || !address) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
        <p className="font-semibold mb-2">No wallet connected</p>
        <button
          onClick={() => void connectWallet()}
          disabled={isConnecting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Connected</p>
          <p className="text-sm font-mono">{shortenedAddress || formatAddress(address)}</p>
        </div>
        <button
          onClick={disconnectWallet}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium text-sm"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useWallet } from "@/hooks/useWallet";

function HeaderIconButton({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex h-7 w-7 items-center justify-center rounded-md text-blue-700 transition-colors hover:bg-blue-50"
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

export default function HeaderClient() {
  const { address, shortenedAddress, isConnecting, error, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="flex items-center gap-3 text-blue-700">
      {address ? (
        <button
          type="button"
          onClick={disconnectWallet}
          className="hidden h-7 items-center gap-2 rounded-md border border-blue-200 bg-white px-3 text-xs font-medium text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 sm:flex"
          title="Disconnect wallet"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          <span className="font-mono">{shortenedAddress || address}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => void connectWallet()}
          disabled={isConnecting}
          className="hidden h-7 rounded-md border border-blue-200 bg-white px-3 text-xs font-medium text-blue-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 sm:block"
        >
          {error ? "Connect Wallet" : isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}

      <HeaderIconButton title="Notifications">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.16V11a6 6 0 0 0-4-5.66V5a2 2 0 1 0-4 0v.34A6 6 0 0 0 6 11v3.16c0 .54-.21 1.05-.6 1.44L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
          />
        </svg>
      </HeaderIconButton>

      <HeaderIconButton title="Wallet">
        <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h3" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 9h5" />
        </svg>
      </HeaderIconButton>

      <HeaderIconButton title="Profile">
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.75 9A3.75 3.75 0 1 1 8.25 9a3.75 3.75 0 0 1 7.5 0ZM4.5 19.25a7.5 7.5 0 0 1 15 0"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
        </svg>
      </HeaderIconButton>
    </div>
  );
}

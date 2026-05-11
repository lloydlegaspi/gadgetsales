"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BrowserProvider, type Eip1193Provider } from "ethers";
import { formatAddress } from "@/lib/format";

type WalletContextValue = {
  address: string | null;
  shortenedAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

type InjectedEthereumProvider = Eip1193Provider & {
  on: (eventName: string, listener: (...args: unknown[]) => void) => void;
  removeListener: (eventName: string, listener: (...args: unknown[]) => void) => void;
};

function getEthereumProvider(): InjectedEthereumProvider | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as Window & { ethereum?: InjectedEthereumProvider }).ethereum ?? null;
}

function createBrowserProvider(): BrowserProvider {
  const ethereum = getEthereumProvider();
  if (!ethereum) {
    throw new Error("MetaMask is not available. Install a compatible wallet to continue.");
  }

  return new BrowserProvider(ethereum);
}

function normalizeError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Unable to connect wallet. Please try again.";
}

async function readConnectedAccount(): Promise<string | null> {
  const ethereum = getEthereumProvider();
  if (!ethereum) {
    return null;
  }

  const provider = new BrowserProvider(ethereum);
  const accounts = await provider.send("eth_accounts", []);
  return accounts[0] ?? null;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshConnectedAccount = useCallback(async () => {
    try {
      const connectedAccount = await readConnectedAccount();
      setAddress(connectedAccount);
      if (connectedAccount) {
        setError(null);
      }
    } catch (refreshError) {
      setError(normalizeError(refreshError));
    }
  }, []);

  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      void Promise.resolve().then(() => {
        setError("MetaMask is not available. Install a compatible wallet to continue.");
      });
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const connectedAccount = await readConnectedAccount();
        if (cancelled) {
          return;
        }

        setAddress(connectedAccount);
        if (connectedAccount) {
          setError(null);
        }
      } catch (bootstrapError) {
        if (!cancelled) {
          setError(normalizeError(bootstrapError));
        }
      }
    })();

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? args[0].filter((account): account is string => typeof account === "string") : [];
      setAddress(accounts[0] ?? null);
      if (accounts.length > 0) {
        setError(null);
      }
    };

    const handleChainChanged = () => {
      void refreshConnectedAccount();
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      cancelled = true;
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [refreshConnectedAccount]);

  const connectWallet = useCallback(async () => {
    const ethereum = getEthereumProvider();
    if (!ethereum) {
      setError("MetaMask is not available. Install a compatible wallet to continue.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = createBrowserProvider();
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const connectedAddress = await signer.getAddress();
      setAddress(connectedAddress);
    } catch (connectError) {
      const message = normalizeError(connectError);
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      shortenedAddress: address ? formatAddress(address) : "",
      isConnected: Boolean(address),
      isConnecting,
      error,
      connectWallet,
      disconnectWallet,
    }),
    [address, connectWallet, disconnectWallet, error, isConnecting]
  );

  return React.createElement(WalletContext.Provider, { value }, children);
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider.");
  }

  return context;
}

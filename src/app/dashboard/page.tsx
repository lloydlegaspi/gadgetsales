"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { SaleCard } from "@/components/sales/SaleCard";
import { useBuyerSales } from "@/hooks/useBuyerSales";
import { useSellerSales } from "@/hooks/useSellerSales";
import { useWallet } from "@/hooks/useWallet";
import type { Sale } from "@/types/sale";

type DashboardSectionProps = {
  title: string;
  description: string;
  refreshLabel: string;
  emptyMessage: string;
  saleIds: bigint[];
  sales: Sale[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
};

function DashboardSection({
  title,
  description,
  refreshLabel,
  emptyMessage,
  saleIds,
  sales,
  loading,
  error,
  onRefresh,
}: DashboardSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>
        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={loading}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : refreshLabel}
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            Loading sales from the configured contract...
          </p>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-semibold">Unable to load this section.</p>
            <p className="mt-1">{error}</p>
          </div>
        ) : sales.length === 0 ? (
          <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">{emptyMessage}</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {saleIds.length} on-chain sale{saleIds.length === 1 ? "" : "s"} found.
            </p>
            {sales.map((sale) => (
              <SaleCard key={sale.id.toString()} sale={sale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { isConnected, isConnecting, connectWallet, error: walletError } = useWallet();
  const sellerSales = useSellerSales();
  const buyerSales = useBuyerSales();

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">
              Wallet dashboard
            </p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              View only the sales connected to your wallet address. These lists come from the
              smart contract seller and buyer indexes.
            </p>
          </div>
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Create Sale
          </Link>
        </div>

        {!isConnected ? (
          <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">Connect your wallet</h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              The dashboard uses your connected wallet address to load sales you created or
              accepted on-chain.
            </p>
            {walletError ? <p className="mt-4 text-sm text-red-700">{walletError}</p> : null}
            <button
              type="button"
              onClick={() => void connectWallet()}
              disabled={isConnecting}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          </section>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <DashboardSection
              title="Sales I Created"
              description="Sales where the connected wallet is the seller."
              refreshLabel="Refresh seller sales"
              emptyMessage="No created sales found for this wallet. Create a sale to see it here."
              saleIds={sellerSales.saleIds}
              sales={sellerSales.sales}
              loading={sellerSales.loading}
              error={sellerSales.error}
              onRefresh={sellerSales.refetch}
            />

            <DashboardSection
              title="Sales I Accepted"
              description="Sales where the connected wallet accepted as buyer."
              refreshLabel="Refresh buyer sales"
              emptyMessage="No accepted sales found for this wallet. Accept a shared sale link to see it here."
              saleIds={buyerSales.saleIds}
              sales={buyerSales.sales}
              loading={buyerSales.loading}
              error={buyerSales.error}
              onRefresh={buyerSales.refetch}
            />
          </div>
        )}
      </main>
    </>
  );
}

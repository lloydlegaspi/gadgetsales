"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useBuyerSales } from "@/hooks/useBuyerSales";
import { useSellerSales } from "@/hooks/useSellerSales";
import { formatAddress } from "@/lib/format";
import { useWallet } from "@/hooks/useWallet";
import type { Sale } from "@/types/sale";

type IconProps = React.SVGProps<SVGSVGElement>;

type SaleStatus = Sale["status"];

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const STATUS_BADGE_CLASSES: Record<SaleStatus, string> = {
  Created: "bg-slate-200 text-slate-700",
  Accepted: "bg-blue-700 text-white",
  Delivered: "bg-amber-200 text-amber-800",
  Completed: "bg-emerald-200 text-emerald-800",
  Disputed: "bg-orange-200 text-orange-800",
  Cancelled: "bg-red-200 text-red-800",
};

type DashboardSectionProps = {
  title: string;
  loadingLabel: string;
  errorLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  showCreateSaleAction?: boolean;
  sales: Sale[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
};

function DashboardSection({
  title,
  loadingLabel,
  errorLabel,
  emptyTitle,
  emptyDescription,
  showCreateSaleAction = false,
  sales,
  loading,
  error,
  onRefresh,
}: DashboardSectionProps) {
  const [dismissedError, setDismissedError] = React.useState<string | null>(null);
  const hasError = Boolean(error) && error !== dismissedError;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
          <div
            className="inline-flex items-center gap-2 text-sm text-[#6b7bb4]"
            aria-live="polite"
            role="status"
          >
            <RefreshIcon className={`${loading ? "animate-spin" : ""} h-4 w-4`} />
            <span>{loading ? loadingLabel : `${sales.length} sale record${sales.length === 1 ? "" : "s"} loaded.`}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void onRefresh()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <RefreshIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {hasError ? (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:text-base">
          <div className="flex items-center gap-3">
            <ErrorIcon className="h-5 w-5 flex-shrink-0" />
            <span>{errorLabel}</span>
          </div>
          <button
            type="button"
            onClick={() => setDismissedError(error)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-red-100 hover:text-slate-700"
            aria-label="Dismiss error"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      <div className="mt-4">
        {sales.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-9 text-center sm:px-6">
            <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <BagIcon className="h-7 w-7" />
            </span>
            <p className="mt-5 text-lg font-bold text-slate-700 sm:text-xl">{emptyTitle}</p>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">{emptyDescription}</p>
            {showCreateSaleAction ? (
              <Link
                href="/create"
                className="mx-auto mt-6 inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition-colors hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <AddIcon className="h-5 w-5" />
                Create Sale
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {sales.map((sale) => (
              <DashboardSaleCard key={sale.id.toString()} sale={sale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { address, shortenedAddress, isConnected, isConnecting, connectWallet, error: walletError } =
    useWallet();
  const sellerSales = useSellerSales();
  const buyerSales = useBuyerSales();
  const [hasCopiedAddress, setHasCopiedAddress] = React.useState(false);

  const walletDisplayAddress = shortenedAddress || (address ? formatAddress(address) : "Not connected");

  const handleCopyWalletAddress = React.useCallback(async () => {
    if (!address || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      setHasCopiedAddress(true);

      window.setTimeout(() => {
        setHasCopiedAddress(false);
      }, 1200);
    } catch {
      setHasCopiedAddress(false);
    }
  }, [address]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 text-slate-950">
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-12">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              View your on-chain second-hand gadget transaction records.
            </p>
          </div>

          <section className="mt-7 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:px-7 sm:py-6">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.8fr_0.95fr_1.5fr_0.95fr] lg:items-center">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <WalletIcon className="h-8 w-8" />
                </span>
                <div>
                  <p className="text-sm text-slate-600">Connected Wallet</p>
                  {isConnected ? (
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                        {walletDisplayAddress}
                      </p>
                      <button
                        type="button"
                        onClick={() => void handleCopyWalletAddress()}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-700"
                        aria-label="Copy wallet address"
                        title={hasCopiedAddress ? "Copied" : "Copy full wallet address"}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <p className="text-sm text-slate-600 sm:text-base">Connect your wallet to load records.</p>
                      <button
                        type="button"
                        onClick={() => void connectWallet()}
                        disabled={isConnecting}
                        className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-700 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isConnecting ? "Connecting..." : "Connect Wallet"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:border-l lg:border-slate-200 lg:pl-8">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-xl font-semibold tracking-tight text-slate-900">Hardhat Local</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">Network</p>
              </div>

              <div className="lg:border-l lg:border-slate-200 lg:pl-8">
                <p className="text-sm leading-6 text-slate-600 sm:text-base">
                  This dashboard shows your sale records loaded from the smart contract.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 lg:border-0">
                <div className="flex items-start gap-3 text-slate-600">
                  <InfoIcon className="mt-0.5 h-5 w-5 text-blue-700" />
                  <p className="text-sm leading-6 sm:text-base">Records update from on-chain data.</p>
                </div>
              </div>
            </div>
            {walletError ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:text-base">
                {walletError}
              </p>
            ) : null}
          </section>

          <div className="mt-7 space-y-5">
            <DashboardSection
              title="Sales I Created"
              loadingLabel="Loading sales from contract..."
              errorLabel="Unable to refresh created sales. Try again."
              emptyTitle="You have not created any sale records yet."
              emptyDescription="Create a sale to record your first transaction."
              showCreateSaleAction
              sales={sellerSales.sales}
              loading={sellerSales.loading}
              error={sellerSales.error}
              onRefresh={sellerSales.refetch}
            />

            <DashboardSection
              title="Sales I Accepted"
              loadingLabel="Loading accepted sales..."
              errorLabel="Unable to refresh accepted sales. Try again."
              emptyTitle="You have not accepted any sale records yet."
              emptyDescription="Accept a sale from another seller to see it here."
              showCreateSaleAction
              sales={buyerSales.sales}
              loading={buyerSales.loading}
              error={buyerSales.error}
              onRefresh={buyerSales.refetch}
            />
          </div>
        </div>

        <footer className="mt-4 border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-4 px-5 py-5 text-xs text-slate-500 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-9">
            <Link href="/" className="text-3xl font-bold text-blue-700">
              GadgetSales
            </Link>
            <p className="text-lg">&copy; 2024 GadgetSales Ledger. All transactions recorded on-chain.</p>
            <div className="flex gap-6 text-lg">
              <a href="#" className="transition-colors hover:text-blue-700">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-blue-700">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-blue-700">
                Security Audit
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function DashboardSaleCard({ sale }: { sale: Sale }) {
  const buyerLabel = sale.buyer === ZERO_ADDRESS ? "No buyer yet" : formatAddress(sale.buyer);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_14px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <DocumentIcon className="h-5 w-5" />
          </span>
          <p className="text-2xl text-slate-800">Sale #{sale.id.toString()}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-bold ${STATUS_BADGE_CLASSES[sale.status]}`}
        >
          {sale.status}
        </span>
      </div>

      <h3 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{sale.gadgetName}</h3>
      <p className="mt-1 text-2xl text-slate-600">{sale.brandModel}</p>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <p className="text-4xl font-bold tracking-tight text-slate-950">{formatPeso(sale.price)}</p>
      </div>

      <dl className="mt-3 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-xl text-blue-700">
            <PersonIcon className="h-4 w-4" />
            Seller
          </dt>
          <dd className="text-xl font-semibold text-slate-600">{formatAddress(sale.seller)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="inline-flex items-center gap-2 text-xl text-blue-700">
            <PersonIcon className="h-4 w-4" />
            Buyer
          </dt>
          <dd className="text-xl font-semibold text-slate-600">{buyerLabel}</dd>
        </div>
      </dl>

      <Link
        href={`/sales/${sale.id.toString()}`}
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-200 text-xl font-bold text-blue-700 transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <EyeIcon className="h-4 w-4" />
        View Sale
      </Link>
    </article>
  );
}

function formatPeso(price: bigint): string {
  return `\u20B1${Number(price).toLocaleString("en-PH")}`;
}
function WalletIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12h3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 9h5" />
    </svg>
  );
}

function DocumentIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h7l3 3v13H7V4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v4h4M10 12h5M10 16h5" />
    </svg>
  );
}

function PersonIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9A3.75 3.75 0 1 1 8.25 9a3.75 3.75 0 0 1 7.5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.25a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function EyeIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}

function AddIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8M8 12h8" />
    </svg>
  );
}

function BagIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9h16l-1 10H5L4 9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function RefreshIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12a7 7 0 0 1-11.9 5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12a7 7 0 0 1 11.9-5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3v4h4M8 21v-4H4" />
    </svg>
  );
}

function ErrorIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v5m0 3h.01" />
    </svg>
  );
}

function InfoIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function CopyIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h11v11H9V9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15V4h11" />
    </svg>
  );
}

function CloseIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}


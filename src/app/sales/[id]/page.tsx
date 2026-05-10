"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SaleStatusBadge } from "@/components/sales/SaleStatusBadge";
import { SaleTimeline } from "@/components/sales/SaleTimeline";
import { WalletStatus } from "@/components/wallet/WalletStatus";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { getSaleActionVisibility } from "@/lib/salePermissions";
import { useSale } from "@/hooks/useSale";
import { useSaleActions } from "@/hooks/useSaleActions";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress, formatPrice, formatTimestamp } from "@/lib/format";
import type { Sale } from "@/types/sale";

type TimelineEvent = {
  status: Sale["status"];
  timestamp: bigint;
  actor: Sale["seller"];
};

function buildTimeline(sale: NonNullable<ReturnType<typeof useSale>["sale"]>) {
  const events: Array<TimelineEvent | null> = [
    sale.createdAt > BigInt(0)
      ? { status: "Created" as const, timestamp: sale.createdAt, actor: sale.seller }
      : null,
    sale.acceptedAt > BigInt(0)
      ? { status: "Accepted" as const, timestamp: sale.acceptedAt, actor: sale.buyer }
      : null,
    sale.deliveredAt > BigInt(0)
      ? { status: "Delivered" as const, timestamp: sale.deliveredAt, actor: sale.seller }
      : null,
    sale.completedAt > BigInt(0)
      ? { status: "Completed" as const, timestamp: sale.completedAt, actor: sale.buyer }
      : null,
    sale.disputedAt > BigInt(0)
      ? { status: "Disputed" as const, timestamp: sale.disputedAt, actor: sale.buyer }
      : null,
    sale.cancelledAt > BigInt(0)
      ? { status: "Cancelled" as const, timestamp: sale.cancelledAt, actor: sale.seller }
      : null,
  ];

  return events.filter((event): event is TimelineEvent => event !== null);
}

export default function SaleDetail() {
  const params = useParams<{ id: string }>();
  const rawSaleId = params.id ?? "";
  const saleIdIsValid = /^\d+$/.test(rawSaleId);
  const saleId = saleIdIsValid ? rawSaleId : null;
  const { sale, loading, error, refetch } = useSale(saleId);
  const { address, isConnected } = useWallet();
  const {
    actionState,
    transactionHash,
    errorMessage,
    acceptSale,
    markDelivered,
    confirmReceipt,
    openDispute,
    cancelSale,
    resetActionState,
  } = useSaleActions();

  const timeline = sale ? buildTimeline(sale) : [];
  const visibility = sale ? getSaleActionVisibility(sale, address) : null;
  const hasConfigError = !CONTRACT_ADDRESS;

  const actionMessage =
    actionState.status === "awaiting_wallet_confirmation"
      ? "Confirm the transaction in your wallet."
      : actionState.status === "pending_blockchain_confirmation"
        ? "Waiting for blockchain confirmation..."
        : actionState.status === "success"
          ? "Action completed successfully."
          : actionState.status === "error"
            ? actionState.errorMessage ?? "Action failed."
            : "Ready.";

  async function handleAction(action: "accept" | "deliver" | "confirm" | "dispute" | "cancel") {
    if (!sale) {
      return;
    }

    resetActionState();

    try {
      if (action === "confirm") {
        const approved = window.confirm("Confirm receipt? This will mark the sale as Completed and cannot be changed.");
        if (!approved) return;
      }

      if (action === "dispute") {
        const approved = window.confirm(
          "Open dispute? The MVP only records the dispute on-chain and does not resolve it automatically."
        );
        if (!approved) return;
      }

      if (action === "cancel") {
        const approved = window.confirm("Cancel sale? Cancelled sales cannot be changed.");
        if (!approved) return;
      }

      const saleIdValue = sale.id;

      if (action === "accept") {
        await acceptSale(saleIdValue);
      } else if (action === "deliver") {
        await markDelivered(saleIdValue);
      } else if (action === "confirm") {
        await confirmReceipt(saleIdValue);
      } else if (action === "dispute") {
        await openDispute(saleIdValue);
      } else {
        await cancelSale(saleIdValue);
      }

      await refetch();
    } catch {
      // State is already captured in the hook.
    }
  }

  const renderedTransactionHash = transactionHash ?? null;

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-blue-700 font-semibold">Sale details</p>
              <h1 className="text-4xl font-bold text-gray-900">
                Sale {sale?.id ? `#${sale.id.toString()}` : rawSaleId ? `#${rawSaleId}` : "details"}
              </h1>
              <p className="text-gray-600">
                Read-only contract data for the selected gadget sale.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              {hasConfigError ? (
                <div className="space-y-3 text-amber-800">
                  <p className="font-semibold">Missing contract address</p>
                  <p className="text-sm">
                    Update .env.local with NEXT_PUBLIC_CONTRACT_ADDRESS from your local deployment,
                    then restart the dev server.
                  </p>
                </div>
              ) : !saleIdIsValid ? (
                <div className="space-y-3 text-red-700">
                  <p className="font-semibold">Invalid sale ID</p>
                  <p className="text-sm">The route parameter must be a numeric sale ID.</p>
                </div>
              ) : loading ? (
                <p className="text-gray-600">Loading sale from the configured contract...</p>
              ) : error ? (
                <div className="space-y-4 text-red-700">
                  <p className="font-semibold">Unable to load sale</p>
                  <p className="text-sm">{error}</p>
                </div>
              ) : sale ? (
                <div className="space-y-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">{sale.gadgetName}</h2>
                      <p className="text-gray-600">{sale.brandModel}</p>
                    </div>
                    <SaleStatusBadge status={sale.status} size="lg" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-semibold text-gray-900">{formatPrice(sale.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Condition</p>
                      <p className="font-semibold text-gray-900">{sale.conditionSummary}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Agreement hash</p>
                      <p className="font-mono text-sm break-all text-gray-900">{sale.agreementHash}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Proof hash</p>
                      <p className="font-mono text-sm break-all text-gray-900">
                        {sale.proofHash || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Seller</p>
                      <p className="font-mono text-gray-900">{formatAddress(sale.seller)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Buyer</p>
                      <p className="font-mono text-gray-900">
                        {sale.buyer === "0x0000000000000000000000000000000000000000"
                          ? "Not yet accepted"
                          : formatAddress(sale.buyer)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 text-sm text-gray-700">
                    <div>
                      <p className="text-gray-500">Created at</p>
                      <p>{formatTimestamp(sale.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Accepted at</p>
                      <p>{sale.acceptedAt > BigInt(0) ? formatTimestamp(sale.acceptedAt) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivered at</p>
                      <p>{sale.deliveredAt > BigInt(0) ? formatTimestamp(sale.deliveredAt) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completed at</p>
                      <p>{sale.completedAt > BigInt(0) ? formatTimestamp(sale.completedAt) : "—"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No sale found for this ID.</p>
              )}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Transaction history</h2>
              {sale ? <SaleTimeline events={timeline} /> : <p className="text-gray-600">Timeline will appear after a sale is created.</p>}
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Actions</h2>
              {!sale ? (
                <p className="text-gray-600">Load a sale to see available contract actions.</p>
              ) : !isConnected ? (
                <p className="text-gray-600">Connect your wallet to perform sale actions.</p>
              ) : !visibility ? (
                <p className="text-gray-600">No action permissions available for this wallet.</p>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">{actionMessage}</p>
                  {renderedTransactionHash ? (
                    <p className="break-all font-mono text-xs text-gray-700">Tx hash: {renderedTransactionHash}</p>
                  ) : null}

                  <div className="flex flex-col gap-3">
                    {visibility.canAcceptSale ? (
                      <button
                        onClick={() => void handleAction("accept")}
                        disabled={actionState.status === "awaiting_wallet_confirmation" || actionState.status === "pending_blockchain_confirmation"}
                        className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Accept Sale
                      </button>
                    ) : null}

                    {visibility.canMarkDelivered ? (
                      <button
                        onClick={() => void handleAction("deliver")}
                        disabled={actionState.status === "awaiting_wallet_confirmation" || actionState.status === "pending_blockchain_confirmation"}
                        className="rounded-xl bg-yellow-600 px-4 py-3 font-semibold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Mark as Delivered
                      </button>
                    ) : null}

                    {visibility.canConfirmReceipt ? (
                      <button
                        onClick={() => void handleAction("confirm")}
                        disabled={actionState.status === "awaiting_wallet_confirmation" || actionState.status === "pending_blockchain_confirmation"}
                        className="rounded-xl bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Confirm Receipt
                      </button>
                    ) : null}

                    {visibility.canOpenDispute ? (
                      <button
                        onClick={() => void handleAction("dispute")}
                        disabled={actionState.status === "awaiting_wallet_confirmation" || actionState.status === "pending_blockchain_confirmation"}
                        className="rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Open Dispute
                      </button>
                    ) : null}

                    {visibility.canCancelSale ? (
                      <button
                        onClick={() => void handleAction("cancel")}
                        disabled={actionState.status === "awaiting_wallet_confirmation" || actionState.status === "pending_blockchain_confirmation"}
                        className="rounded-xl bg-gray-800 px-4 py-3 font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancel Sale
                      </button>
                    ) : null}

                    {!visibility.canAcceptSale && !visibility.canMarkDelivered && !visibility.canConfirmReceipt && !visibility.canOpenDispute && !visibility.canCancelSale ? (
                      <p className="text-sm text-gray-600">
                        No actions are currently available for this wallet and sale status.
                      </p>
                    ) : null}
                  </div>
                  {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <WalletStatus />
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Read-only view</h3>
              <p className="mt-3 text-sm text-gray-700">
                This page only reads contract state. The write actions will be added later.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

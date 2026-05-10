"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { SaleStatusBadge } from "@/components/sales/SaleStatusBadge";
import { SaleTimeline } from "@/components/sales/SaleTimeline";
import { WalletStatus } from "@/components/wallet/WalletStatus";
import { useSale } from "@/hooks/useSale";
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
  const saleId = params.id ?? "";
  const { sale, loading, error } = useSale(saleId);

  const timeline = sale ? buildTimeline(sale) : [];

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.25em] text-blue-700 font-semibold">Sale details</p>
              <h1 className="text-4xl font-bold text-gray-900">
                Sale {sale?.id ? `#${sale.id.toString()}` : saleId ? `#${saleId}` : "details"}
              </h1>
              <p className="text-gray-600">
                Read-only contract data for the selected gadget sale.
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
              {loading ? (
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

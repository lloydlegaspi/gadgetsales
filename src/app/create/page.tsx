"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { WalletStatus } from "@/components/wallet/WalletStatus";
import { useCreateSale } from "@/hooks/useCreateSale";
import { useWallet } from "@/hooks/useWallet";
import { formatPrice } from "@/lib/format";

const TRANSACTION_STATUS_LABELS = {
  idle: "Idle",
  awaiting_wallet_confirmation: "Awaiting wallet confirmation",
  pending_blockchain_confirmation: "Pending blockchain confirmation",
  success: "Success",
  error: "Error",
} as const;

export default function CreateSale() {
  const { isConnected, shortenedAddress } = useWallet();
  const {
    form,
    agreementJSON,
    agreementHash,
    transactionState,
    createdSaleId,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useCreateSale();

  const transactionMessage =
    transactionState.status === "error"
      ? transactionState.errorMessage ?? "Transaction failed."
      : transactionState.status === "success"
        ? "Sale created successfully on-chain."
        : transactionState.status === "pending_blockchain_confirmation"
          ? "Transaction submitted. Waiting for blockchain confirmation."
          : transactionState.status === "awaiting_wallet_confirmation"
            ? "Confirm the transaction in your wallet."
            : "Ready to submit.";

  const pricePreview = /^\d+$/.test(form.price.trim()) ? BigInt(form.price.trim()) : BigInt(0);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] mb-10">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-700 font-semibold">
              Create Sale
            </p>
            <h1 className="text-4xl font-bold text-gray-900">Create a blockchain sale record</h1>
            <p className="text-gray-600 max-w-2xl">
              Review the agreement summary first, then submit it with MetaMask. The contract stores
              the agreed sale details, status, and timestamps on-chain.
            </p>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
              <p className="font-semibold">Stored on-chain</p>
              <p>
                Sale ID, seller, price, gadget details, agreement hash, optional proof hash, and
                transaction timestamps.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <WalletStatus />
            <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Wallet context</p>
              <p className="mt-1">
                {isConnected ? `Connected as ${shortenedAddress}` : "Connect MetaMask to create a sale."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Gadget Name *
                </label>
                <input
                  type="text"
                  name="gadgetName"
                  value={form.gadgetName}
                  onChange={handleChange}
                  placeholder="iPhone 12"
                  maxLength={80}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {form.validationErrors.gadgetName ? (
                  <p className="mt-2 text-sm text-red-600">{form.validationErrors.gadgetName}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Brand and Model *
                </label>
                <input
                  type="text"
                  name="brandModel"
                  value={form.brandModel}
                  onChange={handleChange}
                  placeholder="Apple iPhone 12 128GB"
                  maxLength={100}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {form.validationErrors.brandModel ? (
                  <p className="mt-2 text-sm text-red-600">{form.validationErrors.brandModel}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Condition Summary *
                </label>
                <textarea
                  name="conditionSummary"
                  value={form.conditionSummary}
                  onChange={handleChange}
                  rows={4}
                  maxLength={160}
                  placeholder="Used, minor scratches, battery health 86%"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                {form.validationErrors.conditionSummary ? (
                  <p className="mt-2 text-sm text-red-600">{form.validationErrors.conditionSummary}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Price (whole number) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  placeholder="15000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {form.validationErrors.price ? (
                  <p className="mt-2 text-sm text-red-600">{form.validationErrors.price}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Proof Hash (optional)
                </label>
                <input
                  type="text"
                  name="proofHash"
                  value={form.proofHash}
                  onChange={handleChange}
                  placeholder="0x..."
                  maxLength={256}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono text-sm"
                />
                {form.validationErrors.proofHash ? (
                  <p className="mt-2 text-sm text-red-600">{form.validationErrors.proofHash}</p>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">Optional hash reference for supporting files.</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Additional Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  maxLength={240}
                  placeholder="Short reminder for the buyer, delivery notes, or inspection details."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                {form.validationErrors.notes ? (
                  <p className="mt-2 text-sm text-red-600">{form.validationErrors.notes}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Agreement preview</p>
                <pre className="overflow-x-auto rounded-xl bg-white p-4 text-xs text-gray-700 border border-gray-200">
                  {agreementJSON}
                </pre>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Estimated on-chain price</p>
                  <p className="font-semibold text-gray-900">{formatPrice(pricePreview)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Agreement hash</p>
                  <p className="font-mono text-sm text-gray-900 break-all">
                    {agreementHash || "Generating..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-sm font-semibold text-gray-900">Transaction status</p>
              <p className="mt-1 text-sm text-gray-700">{transactionMessage}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                {TRANSACTION_STATUS_LABELS[transactionState.status]}
              </p>
              {transactionState.transactionHash ? (
                <p className="mt-3 break-all font-mono text-xs text-gray-700">
                  Tx hash: {transactionState.transactionHash}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={!isConnected || isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Create Sale"}
              </button>

              {createdSaleId ? (
                <div className="text-sm text-green-700">
                  Created sale ID {createdSaleId.toString()} ·{" "}
                  <Link href={`/sales/${createdSaleId.toString()}`} className="font-semibold underline">
                    View sale
                  </Link>
                </div>
              ) : null}
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">Before you submit</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li>Review the agreement preview and hash first.</li>
                <li>Connect MetaMask on the local Hardhat network.</li>
                <li>Keep only hashes and references on-chain.</li>
                <li>Use whole-number demo prices only.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
              <p className="font-semibold">Prototype reminder</p>
              <p className="mt-2">
                This app is for local and testnet demos only. Do not use real private keys, live
                funds, or sensitive personal data.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

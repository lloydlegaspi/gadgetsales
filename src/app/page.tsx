import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-blue-100 bg-white p-8 sm:p-10">
          <h1 className="text-4xl font-bold text-gray-900">GadgetSales</h1>
          <p className="mt-4 text-lg text-gray-700">
            GadgetSales is a transaction verification app for second-hand gadget sales.
            It records agreed sale details and status updates on-chain so both seller and buyer
            can see the same shared history.
          </p>
          <p className="mt-3 text-gray-600">
            The app verifies the transaction record and status flow. It does not verify the
            physical authenticity of the gadget.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/create"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Create Sale
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-900">Core Flow</h2>
            <ol className="mt-4 space-y-3 text-sm text-gray-700">
              <li>1. Seller creates a sale with gadget details and agreed price.</li>
              <li>2. Buyer accepts the sale from the sale details page.</li>
              <li>3. Seller marks the item as delivered.</li>
              <li>4. Buyer confirms receipt to complete, or opens a dispute.</li>
            </ol>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-2xl font-bold text-gray-900">What Is Recorded On-Chain</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>Sale ID, seller, buyer, price, and agreement hash.</li>
              <li>Status changes and timestamps across the full sale lifecycle.</li>
              <li>A transaction history both parties can review in one timeline.</li>
            </ul>
          </div>
        </section>

        <div className="mt-10 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-900">
          <p className="text-sm">
            <strong>Important:</strong> GadgetSales is a demo MVP for transaction verification.
            It does not prove the physical authenticity, condition, or ownership history of a device.
          </p>
        </div>
      </main>
    </>
  );
}

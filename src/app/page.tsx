"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              GadgetSales
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              A blockchain-based transaction verification system for second-hand gadget sales.
            </p>
            <p className="text-gray-600 mb-6">
              Record agreed sale details and track status updates on an immutable blockchain ledger.
              Create a shared transaction history that both buyer and seller can trust.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-blue-900 mb-2">MVP Scope</h2>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Create sale records with gadget details</li>
                <li>✓ Track status from Created → Completed</li>
                <li>✓ Record buyer and seller actions</li>
                <li>✓ View immutable transaction history</li>
                <li>✓ Open disputes if needed</li>
              </ul>
            </div>

            <div className="flex gap-4">
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

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-blue-600 flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Seller Creates Sale</h3>
                  <p className="text-gray-600 text-sm">
                    Enter gadget details, price, and condition on the blockchain.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-blue-600 flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Buyer Accepts</h3>
                  <p className="text-gray-600 text-sm">
                    Buyer confirms the agreed terms and accepts the sale.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-blue-600 flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Status Updates</h3>
                  <p className="text-gray-600 text-sm">
                    Mark as delivered, confirm receipt, or open a dispute.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl font-bold text-blue-600 flex-shrink-0">4</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Immutable History</h3>
                  <p className="text-gray-600 text-sm">
                    View the complete timeline of all actions and transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
          <p className="text-sm">
            <strong>⚠️ Disclaimer:</strong> This is a prototype for demonstration purposes only.
            Use testnet or local blockchain only. This system records transaction agreements but does not
            prove gadget authenticity, ownership, or legality. Not a substitute for legal documentation.
          </p>
        </div>
      </main>
    </>
  );
}

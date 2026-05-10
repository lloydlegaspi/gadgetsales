"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { SaleStatusBadge } from "@/components/sales/SaleStatusBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SaleDetail({ params }: PageProps) {
  const [id, setId] = React.useState<string>("");

  React.useEffect(() => {
    params.then((resolved) => setId(resolved.id));
  }, [params]);

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sale #{id || "Loading..."}</h1>
          <p className="text-gray-600 mt-2">Connect wallet to load sale details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Sale Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Details</h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="text-sm text-gray-500">Gadget Name</p>
                  <p className="font-semibold">Loading...</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand & Model</p>
                  <p className="font-semibold">Loading...</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="font-semibold">Loading...</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">Loading...</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
              <div className="text-gray-600">
                <p>Timeline will appear here once sale is created</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="mb-6">
                <SaleStatusBadge status="Created" size="lg" />
              </div>
              <button
                disabled
                className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Connect wallet to interact
              </button>
            </div>

            {/* Parties */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parties</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-500">Seller</p>
                  <p className="font-mono text-gray-900">0x1234...5678</p>
                </div>
                <div>
                  <p className="text-gray-500">Buyer</p>
                  <p className="text-gray-600">Not yet accepted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

"use client";

import React from "react";
import { Header } from "@/components/layout/Header";

export default function Dashboard() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales as Seller</h2>
            <div className="text-gray-600">
              <p>Connect your wallet to view your created sales.</p>
              <p className="text-sm mt-2 text-gray-500">
                This section will show all sales you created where you are the seller.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales as Buyer</h2>
            <div className="text-gray-600">
              <p>Connect your wallet to view your accepted sales.</p>
              <p className="text-sm mt-2 text-gray-500">
                This section will show all sales you accepted where you are the buyer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Connect your wallet using the button in the header</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Go to &quot;Create Sale&quot; to list a gadget for sale</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">3.</span>
              <span>View sale details and track status updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Accept sales or mark items as delivered</span>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}

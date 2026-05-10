"use client";

import React from "react";
import Link from "next/link";
import type { Sale } from "@/types/sale";
import { SaleStatusBadge } from "./SaleStatusBadge";
import { formatPrice, truncateText, formatAddress } from "@/lib/format";

interface SaleCardProps {
  sale: Sale;
}

export function SaleCard({ sale }: SaleCardProps) {
  return (
    <Link href={`/sales/${sale.id}`}>
      <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{sale.gadgetName}</h3>
            <p className="text-gray-600">{sale.brandModel}</p>
          </div>
          <SaleStatusBadge status={sale.status} />
        </div>
        <p className="text-gray-700 mb-4">{truncateText(sale.conditionSummary, 100)}</p>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Seller:</span>{" "}
            <span className="font-mono text-gray-900">{formatAddress(sale.seller)}</span>
          </div>
          <div>
            <span className="text-gray-500">Buyer:</span>{" "}
            <span className="font-mono text-gray-900">
              {sale.buyer === "0x0000000000000000000000000000000000000000"
                ? "—"
                : formatAddress(sale.buyer)}
            </span>
          </div>
        </div>
        <div className="text-lg font-bold text-blue-600">{formatPrice(sale.price)}</div>
      </div>
    </Link>
  );
}

"use client";

import React from "react";
import type { SaleStatus } from "@/types/sale";
import { SALE_STATUS_LABELS } from "@/constants/sale";

const STATUS_COLORS: Record<SaleStatus, string> = {
  Created: "bg-blue-100 text-blue-800",
  Accepted: "bg-purple-100 text-purple-800",
  Delivered: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Disputed: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

interface SaleStatusBadgeProps {
  status: SaleStatus;
  size?: "sm" | "md" | "lg";
}

export function SaleStatusBadge({ status, size = "md" }: SaleStatusBadgeProps) {
  const sizes = {
    sm: "px-2 py-1 text-xs font-medium rounded",
    md: "px-3 py-1.5 text-sm font-medium rounded",
    lg: "px-4 py-2 text-base font-medium rounded",
  };

  return (
    <span className={`${STATUS_COLORS[status]} ${sizes[size]} inline-block`}>
      {SALE_STATUS_LABELS[status]}
    </span>
  );
}

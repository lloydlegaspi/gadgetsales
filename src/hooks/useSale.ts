"use client";

import { useCallback, useEffect, useState } from "react";
import type { Sale, SaleStatus } from "@/types/sale";
import { getReadOnlyContract } from "@/lib/getGadgetSalesContract";

const SALE_STATUS_BY_INDEX = [
  "Created",
  "Accepted",
  "Delivered",
  "Completed",
  "Disputed",
  "Cancelled",
] as const satisfies readonly SaleStatus[];

type UseSaleResult = {
  sale: Sale | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function normalizeSale(rawSale: Awaited<ReturnType<Awaited<ReturnType<typeof getReadOnlyContract>>["getSale"]>>): Sale {
  return {
    id: BigInt(rawSale.id.toString()),
    seller: rawSale.seller,
    buyer: rawSale.buyer,
    price: BigInt(rawSale.price.toString()),
    gadgetName: rawSale.gadgetName,
    brandModel: rawSale.brandModel,
    conditionSummary: rawSale.conditionSummary,
    agreementHash: rawSale.agreementHash,
    proofHash: rawSale.proofHash,
    status: SALE_STATUS_BY_INDEX[Number(rawSale.status)] ?? "Created",
    createdAt: BigInt(rawSale.createdAt.toString()),
    acceptedAt: BigInt(rawSale.acceptedAt.toString()),
    deliveredAt: BigInt(rawSale.deliveredAt.toString()),
    completedAt: BigInt(rawSale.completedAt.toString()),
    disputedAt: BigInt(rawSale.disputedAt.toString()),
    cancelledAt: BigInt(rawSale.cancelledAt.toString()),
  };
}

export function useSale(saleId: string | number | bigint | null): UseSaleResult {
  const [sale, setSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(Boolean(saleId));
  const [error, setError] = useState<string | null>(null);

  const loadSale = useCallback(async () => {
    if (saleId === null || saleId === undefined || saleId === "") {
      setSale(null);
      setError("Missing sale ID.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getReadOnlyContract();
      const rawSale = await contract.getSale(BigInt(saleId.toString()));
      setSale(normalizeSale(rawSale));
    } catch (fetchError) {
      setSale(null);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load sale.");
    } finally {
      setLoading(false);
    }
  }, [saleId]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (cancelled) {
        return;
      }

      await loadSale();
    })();

    return () => {
      cancelled = true;
    };
  }, [loadSale]);

  return {
    sale,
    loading,
    error,
    refetch: loadSale,
  };
}

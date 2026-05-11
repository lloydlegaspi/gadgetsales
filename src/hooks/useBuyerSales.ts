"use client";

import { useCallback, useEffect, useState } from "react";
import type { Sale } from "@/types/sale";
import { getReadOnlyContract } from "@/lib/getGadgetSalesContract";
import { normalizeSale } from "@/hooks/useSale";
import { useWallet } from "@/hooks/useWallet";

type UseBuyerSalesResult = {
  saleIds: bigint[];
  sales: Sale[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

type ContractSaleId = {
  toString: () => string;
};

/**
 * Loads sale IDs accepted by the connected wallet and resolves them to sale records.
 */
export function useBuyerSales(): UseBuyerSalesResult {
  const { address } = useWallet();
  const [saleIds, setSaleIds] = useState<bigint[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBuyerSales = useCallback(async () => {
    if (!address) {
      setSaleIds([]);
      setSales([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const contract = await getReadOnlyContract();
      const rawSaleIds = (await contract.getSalesByBuyer(address)) as ContractSaleId[];
      const nextSaleIds: bigint[] = rawSaleIds.map((saleId) => BigInt(saleId.toString()));
      const nextSales = await Promise.all(
        nextSaleIds.map(async (saleId) => normalizeSale(await contract.getSale(saleId)))
      );

      setSaleIds(nextSaleIds);
      setSales(nextSales);
    } catch (salesError) {
      setSaleIds([]);
      setSales([]);
      setError(salesError instanceof Error ? salesError.message : "Failed to load buyer sales.");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      if (cancelled) {
        return;
      }

      await loadBuyerSales();
    })();

    return () => {
      cancelled = true;
    };
  }, [loadBuyerSales]);

  return {
    saleIds,
    sales,
    loading,
    error,
    refetch: loadBuyerSales,
  };
}

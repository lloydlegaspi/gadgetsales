import type { Sale, SaleStatus } from "@/types/sale";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export type SaleActionVisibility = {
  canAcceptSale: boolean;
  canCancelSale: boolean;
  canMarkDelivered: boolean;
  canConfirmReceipt: boolean;
  canOpenDispute: boolean;
};

export function isZeroAddress(address: string | null | undefined): boolean {
  return !address || address.toLowerCase() === ZERO_ADDRESS;
}

export function getSaleActionVisibility(sale: Sale, connectedAddress?: string | null): SaleActionVisibility {
  const walletAddress = connectedAddress?.toLowerCase() ?? "";
  const sellerAddress = sale.seller.toLowerCase();
  const buyerAddress = sale.buyer.toLowerCase();
  const isSeller = walletAddress !== "" && walletAddress === sellerAddress;
  const isBuyer = walletAddress !== "" && walletAddress === buyerAddress;
  const buyerIsEmpty = isZeroAddress(sale.buyer);

  return {
    canAcceptSale:
      sale.status === "Created" && !isSeller && buyerIsEmpty,
    canCancelSale:
      isSeller && (sale.status === "Created" || sale.status === "Accepted"),
    canMarkDelivered:
      isSeller && sale.status === "Accepted",
    canConfirmReceipt:
      isBuyer && sale.status === "Delivered",
    canOpenDispute:
      isBuyer && sale.status === "Delivered",
  };
}

export function saleStatusToEvents(status: SaleStatus): SaleStatus[] {
  return [status];
}

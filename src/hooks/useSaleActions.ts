"use client";

import { useCallback, useState } from "react";
import type { ContractTransactionResponse } from "ethers";
import { useWallet } from "@/hooks/useWallet";
import { getWritableContract } from "@/lib/getGadgetSalesContract";
import type { TransactionState } from "@/types/sale";

const INITIAL_ACTION_STATE: TransactionState = {
  status: "idle",
  transactionHash: null,
  errorMessage: null,
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Transaction failed.";
}

export function useSaleActions() {
  const { isConnected } = useWallet();
  const [actionState, setActionState] = useState<TransactionState>(INITIAL_ACTION_STATE);

  const resetActionState = useCallback(() => {
    setActionState(INITIAL_ACTION_STATE);
  }, []);

  const runAction = useCallback(
    async (action: "acceptSale" | "markDelivered" | "confirmReceipt" | "openDispute" | "cancelSale", saleId: bigint) => {
      if (!isConnected) {
        const message = "Connect your wallet before performing sale actions.";
        setActionState({ status: "error", transactionHash: null, errorMessage: message });
        throw new Error(message);
      }

      setActionState({ status: "awaiting_wallet_confirmation", transactionHash: null, errorMessage: null });

      try {
        const contract = await getWritableContract();
        let transaction: ContractTransactionResponse;

        if (action === "acceptSale") {
          transaction = await contract.acceptSale(saleId);
        } else if (action === "markDelivered") {
          transaction = await contract.markDelivered(saleId);
        } else if (action === "confirmReceipt") {
          transaction = await contract.confirmReceipt(saleId);
        } else if (action === "openDispute") {
          transaction = await contract.openDispute(saleId);
        } else {
          transaction = await contract.cancelSale(saleId);
        }

        setActionState({
          status: "pending_blockchain_confirmation",
          transactionHash: transaction.hash as `0x${string}`,
          errorMessage: null,
        });

        await transaction.wait();

        setActionState({
          status: "success",
          transactionHash: transaction.hash as `0x${string}`,
          errorMessage: null,
        });

        return transaction.hash;
      } catch (actionError) {
        const message = toErrorMessage(actionError);
        setActionState((current) => ({
          status: "error",
          transactionHash: current.transactionHash,
          errorMessage: message,
        }));
        throw new Error(message);
      }
    },
    [isConnected]
  );

  const acceptSale = useCallback((saleId: bigint) => runAction("acceptSale", saleId), [runAction]);
  const markDelivered = useCallback((saleId: bigint) => runAction("markDelivered", saleId), [runAction]);
  const confirmReceipt = useCallback((saleId: bigint) => runAction("confirmReceipt", saleId), [runAction]);
  const openDispute = useCallback((saleId: bigint) => runAction("openDispute", saleId), [runAction]);
  const cancelSale = useCallback((saleId: bigint) => runAction("cancelSale", saleId), [runAction]);

  return {
    actionState,
    transactionHash: actionState.transactionHash,
    errorMessage: actionState.errorMessage,
    acceptSale,
    markDelivered,
    confirmReceipt,
    openDispute,
    cancelSale,
    resetActionState,
  };
}

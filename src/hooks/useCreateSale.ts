"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { TransactionState, AgreementPayload, CreateSaleFormState } from "@/types/sale";
import { EMPTY_CREATE_SALE_FORM } from "@/constants/sale";
import { generateAgreementHash, generateAgreementJSON } from "@/lib/agreementHash";
import { getWritableContract } from "@/lib/getGadgetSalesContract";
import { useWallet } from "@/hooks/useWallet";

type CreateSaleHookResult = {
  form: CreateSaleFormState;
  agreementJSON: string;
  agreementHash: string;
  transactionState: TransactionState;
  createdSaleId: bigint | null;
  isSubmitting: boolean;
  handleChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  setFieldValue: (name: keyof Omit<CreateSaleFormState, "validationErrors" | "agreementHash">, value: string) => void;
  resetForm: () => void;
};

const INITIAL_TRANSACTION_STATE: TransactionState = {
  status: "idle",
  transactionHash: null,
  errorMessage: null,
};

const SALE_STATUS_EVENT_NAME = "SaleCreated";

function normalizeAgreementPayload(form: CreateSaleFormState): AgreementPayload {
  return {
    gadgetName: form.gadgetName,
    brandModel: form.brandModel,
    conditionSummary: form.conditionSummary,
    price: form.price,
    notes: form.notes,
    proofHash: form.proofHash,
  };
}

function validateSaleForm(form: CreateSaleFormState): Record<string, string> {
  const errors: Record<string, string> = {};
  const trimmedPrice = form.price.trim();

  if (form.gadgetName.trim().length === 0) {
    errors.gadgetName = "Gadget name is required.";
  } else if (form.gadgetName.trim().length > 80) {
    errors.gadgetName = "Gadget name must be 80 characters or fewer.";
  }

  if (form.brandModel.trim().length === 0) {
    errors.brandModel = "Brand and model are required.";
  } else if (form.brandModel.trim().length > 100) {
    errors.brandModel = "Brand and model must be 100 characters or fewer.";
  }

  if (form.conditionSummary.trim().length === 0) {
    errors.conditionSummary = "Condition summary is required.";
  } else if (form.conditionSummary.trim().length > 160) {
    errors.conditionSummary = "Condition summary must be 160 characters or fewer.";
  }

  if (trimmedPrice.length === 0) {
    errors.price = "Price is required.";
  } else if (!/^\d+$/.test(trimmedPrice)) {
    errors.price = "Price must be a whole number.";
  } else if (BigInt(trimmedPrice) <= BigInt(0)) {
    errors.price = "Price must be greater than zero.";
  }

  if (form.notes.trim().length > 240) {
    errors.notes = "Notes must be 240 characters or fewer.";
  }

  if (form.proofHash.trim().length > 256) {
    errors.proofHash = "Proof hash must be 256 characters or fewer.";
  }

  return errors;
}

function extractSaleCreatedId(
  receipt: { logs: Array<{ topics: readonly string[]; data: string }> },
  contractInterface: {
    parseLog: (log: { topics: readonly string[]; data: string }) =>
      | { name: string; args: Array<bigint | number | string> & { saleId?: bigint | number | string } }
      | null;
  }
) {
  for (const log of receipt.logs) {
    try {
      const parsed = contractInterface.parseLog(log);
      if (parsed?.name === SALE_STATUS_EVENT_NAME) {
        const args = parsed.args as { saleId?: bigint | number | string } & Array<bigint | number | string>;
        const saleId = args.saleId ?? args[0];
        if (saleId !== undefined) {
          return BigInt(saleId.toString());
        }
      }
    } catch {
      // Ignore non-matching logs.
    }
  }

  return null;
}

export function useCreateSale(): CreateSaleHookResult {
  const { isConnected } = useWallet();
  const [form, setForm] = useState<CreateSaleFormState>(EMPTY_CREATE_SALE_FORM);
  const [transactionState, setTransactionState] = useState<TransactionState>(INITIAL_TRANSACTION_STATE);
  const [createdSaleId, setCreatedSaleId] = useState<bigint | null>(null);
  const [agreementHash, setAgreementHash] = useState<string>("");

  const agreementJSON = useMemo(() => generateAgreementJSON(normalizeAgreementPayload(form)), [form]);

  useEffect(() => {
    let cancelled = false;

    void generateAgreementHash(normalizeAgreementPayload(form))
      .then((hash) => {
        if (!cancelled) {
          setAgreementHash(hash);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAgreementHash("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [form]);

  const setFieldValue = (name: keyof Omit<CreateSaleFormState, "validationErrors" | "agreementHash">, value: string) => {
    setForm((current) => ({
      ...current,
      [name]: value,
      validationErrors: {
        ...current.validationErrors,
        [name]: "",
      },
    }));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFieldValue(name as keyof Omit<CreateSaleFormState, "validationErrors" | "agreementHash">, value);
  };

  const resetForm = () => {
    setForm(EMPTY_CREATE_SALE_FORM);
    setCreatedSaleId(null);
    setTransactionState(INITIAL_TRANSACTION_STATE);
    setAgreementHash("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateSaleForm(form);
    if (Object.keys(errors).length > 0) {
      setForm((current) => ({
        ...current,
        validationErrors: errors,
      }));
      setTransactionState({
        status: "error",
        transactionHash: null,
        errorMessage: "Please fix the highlighted fields before submitting.",
      });
      return;
    }

    if (!isConnected) {
      setTransactionState({
        status: "error",
        transactionHash: null,
        errorMessage: "Connect your wallet before creating a sale.",
      });
      return;
    }

    const payload = normalizeAgreementPayload(form);
    const generatedAgreementHash = await generateAgreementHash(payload);
    setAgreementHash(generatedAgreementHash);
    setTransactionState({
      status: "awaiting_wallet_confirmation",
      transactionHash: null,
      errorMessage: null,
    });

    try {
      const contract = await getWritableContract();
      const transaction = await contract.createSale(
        BigInt(form.price.trim()),
        form.gadgetName.trim(),
        form.brandModel.trim(),
        form.conditionSummary.trim(),
        generatedAgreementHash,
        form.proofHash.trim()
      );

      setTransactionState({
        status: "pending_blockchain_confirmation",
        transactionHash: transaction.hash,
        errorMessage: null,
      });

      const receipt = await transaction.wait();
  const saleId = receipt ? extractSaleCreatedId(receipt as { logs: Array<{ topics: readonly string[]; data: string }> }, contract.interface) : null;

      setCreatedSaleId(saleId);
      setTransactionState({
        status: "success",
        transactionHash: transaction.hash,
        errorMessage: null,
      });
      setForm(EMPTY_CREATE_SALE_FORM);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Sale creation failed.";
      setTransactionState((current) => ({
        status: "error",
        transactionHash: current.transactionHash,
        errorMessage: message,
      }));
    }
  };

  return {
    form,
    agreementJSON,
    agreementHash,
    transactionState,
    createdSaleId,
    isSubmitting:
      transactionState.status === "awaiting_wallet_confirmation" ||
      transactionState.status === "pending_blockchain_confirmation",
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  };
}

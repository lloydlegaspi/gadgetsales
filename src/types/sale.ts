export type SaleStatus =
  | "Created"
  | "Accepted"
  | "Delivered"
  | "Completed"
  | "Disputed"
  | "Cancelled";

export type Sale = {
  id: bigint;
  seller: `0x${string}`;
  buyer: `0x${string}`;
  price: bigint;
  gadgetName: string;
  brandModel: string;
  conditionSummary: string;
  agreementHash: string;
  proofHash: string;
  status: SaleStatus;
  createdAt: bigint;
  acceptedAt: bigint;
  deliveredAt: bigint;
  completedAt: bigint;
  disputedAt: bigint;
  cancelledAt: bigint;
};

export type CreateSaleFormState = {
  gadgetName: string;
  brandModel: string;
  conditionSummary: string;
  price: string;
  notes: string;
  proofHash: string;
  agreementHash: string | null;
  validationErrors: Record<string, string>;
};

export type TransactionState = {
  status:
    | "idle"
    | "awaiting_wallet_confirmation"
    | "pending_blockchain_confirmation"
    | "success"
    | "error";
  transactionHash: `0x${string}` | null;
  errorMessage: string | null;
};

export type AgreementPayload = {
  gadgetName: string;
  brandModel: string;
  conditionSummary: string;
  price: string;
  notes: string;
  proofHash: string;
};

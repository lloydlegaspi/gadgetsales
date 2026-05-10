import type { SaleStatus, CreateSaleFormState } from "@/types/sale";

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  Created: "Created",
  Accepted: "Accepted",
  Delivered: "Delivered",
  Completed: "Completed",
  Disputed: "Disputed",
  Cancelled: "Cancelled",
};

export const VALID_STATUS_TRANSITIONS: Record<SaleStatus, SaleStatus[]> = {
  Created: ["Accepted", "Cancelled"],
  Accepted: ["Delivered", "Cancelled"],
  Delivered: ["Completed", "Disputed"],
  Completed: [],
  Disputed: [],
  Cancelled: [],
};

export const SALE_STATUS_TIMELINE: SaleStatus[] = [
  "Created",
  "Accepted",
  "Delivered",
  "Completed",
];

export const EMPTY_CREATE_SALE_FORM: CreateSaleFormState = {
  gadgetName: "",
  brandModel: "",
  conditionSummary: "",
  price: "",
  notes: "",
  proofHash: "",
  agreementHash: null,
  validationErrors: {},
};

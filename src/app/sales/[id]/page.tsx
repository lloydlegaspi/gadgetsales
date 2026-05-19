"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { CONTRACT_ADDRESS } from "@/constants/contract";
import { getSaleActionVisibility } from "@/lib/salePermissions";
import { useSale } from "@/hooks/useSale";
import { useSaleActions } from "@/hooks/useSaleActions";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress, formatPrice, formatTimestamp } from "@/lib/format";
import type { Sale, SaleStatus } from "@/types/sale";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

type StepTone = "created" | "accepted" | "delivered" | "completed" | "disputed" | "cancelled" | "pending";
type ActionVariant = "primary" | "warning" | "neutral";

type TimelineStep = {
  number: number;
  title: string;
  roleLabel: string | null;
  description: string | null;
  timestamp: bigint | null;
  txRef: string | null;
  tone: StepTone;
};

type SaleActionConfig = {
  key: "accept" | "deliver" | "confirm" | "dispute" | "cancel";
  label: string;
  variant: ActionVariant;
  visible: boolean;
};

type IconProps = React.SVGProps<SVGSVGElement>;

const STATUS_BADGE_CLASSES: Record<SaleStatus, string> = {
  Created: "border-slate-300 bg-slate-100 text-slate-700",
  Accepted: "border-blue-200 bg-blue-50 text-blue-700",
  Delivered: "border-amber-300 bg-amber-50 text-amber-700",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Disputed: "border-orange-200 bg-orange-50 text-orange-700",
  Cancelled: "border-red-200 bg-red-50 text-red-700",
};

const TIMELINE_CARD_CLASSES: Record<StepTone, string> = {
  created: "border-slate-200 bg-slate-50/60",
  accepted: "border-blue-200 bg-blue-50/40",
  delivered: "border-amber-200 bg-amber-50/40",
  completed: "border-emerald-200 bg-emerald-50/40",
  disputed: "border-orange-200 bg-orange-50/40",
  cancelled: "border-red-200 bg-red-50/40",
  pending: "border-slate-200 bg-slate-50",
};

const TIMELINE_NODE_CLASSES: Record<StepTone, string> = {
  created: "border-slate-400 bg-slate-500 text-white",
  accepted: "border-blue-600 bg-blue-600 text-white",
  delivered: "border-amber-500 bg-amber-500 text-white",
  completed: "border-emerald-600 bg-emerald-600 text-white",
  disputed: "border-orange-600 bg-orange-600 text-white",
  cancelled: "border-red-600 bg-red-600 text-white",
  pending: "border-slate-300 bg-white text-slate-500",
};

function isPresentTimestamp(timestamp: bigint): boolean {
  return timestamp > BigInt(0);
}

function resolveTimelineTone(status: SaleStatus): StepTone {
  if (status === "Completed") return "completed";
  if (status === "Disputed") return "disputed";
  if (status === "Cancelled") return "cancelled";
  return "pending";
}

function shortHash(value: string): string {
  if (!value) return "--";
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function formatTimelineTime(timestamp: bigint | null): string {
  if (!timestamp || timestamp <= BigInt(0)) return "Pending";

  const date = new Date(Number(timestamp) * 1000);
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const timeLabel = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  return `${dateLabel} - ${timeLabel}`;
}

function buildTimelineSteps(sale: Sale, timelineTxRef: Partial<Record<SaleStatus, string | null>>): TimelineStep[] {
  const createdTx = timelineTxRef.Created ?? (sale.agreementHash ? shortHash(sale.agreementHash) : null);
  const acceptedTx = timelineTxRef.Accepted ?? (isPresentTimestamp(sale.acceptedAt) ? shortHash(sale.buyer) : null);
  const deliveredTx = timelineTxRef.Delivered ?? (isPresentTimestamp(sale.deliveredAt) ? shortHash(sale.seller) : null);

  const terminalStatus: SaleStatus | null = isPresentTimestamp(sale.completedAt)
    ? "Completed"
    : isPresentTimestamp(sale.disputedAt)
      ? "Disputed"
      : isPresentTimestamp(sale.cancelledAt)
        ? "Cancelled"
        : null;

  const terminalTimestamp =
    terminalStatus === "Completed"
      ? sale.completedAt
      : terminalStatus === "Disputed"
        ? sale.disputedAt
        : terminalStatus === "Cancelled"
          ? sale.cancelledAt
          : null;

  const terminalTx = terminalStatus ? timelineTxRef[terminalStatus] ?? shortHash(sale.seller) : null;

  return [
    {
      number: 1,
      title: "Created",
      roleLabel: "Seller",
      description: null,
      timestamp: isPresentTimestamp(sale.createdAt) ? sale.createdAt : null,
      txRef: createdTx,
      tone: "created",
    },
    {
      number: 2,
      title: "Accepted",
      roleLabel: "Buyer",
      description: null,
      timestamp: isPresentTimestamp(sale.acceptedAt) ? sale.acceptedAt : null,
      txRef: acceptedTx,
      tone: isPresentTimestamp(sale.acceptedAt) ? "accepted" : "pending",
    },
    {
      number: 3,
      title: "Delivered",
      roleLabel: "Seller",
      description: null,
      timestamp: isPresentTimestamp(sale.deliveredAt) ? sale.deliveredAt : null,
      txRef: deliveredTx,
      tone: isPresentTimestamp(sale.deliveredAt) ? "delivered" : "pending",
    },
    {
      number: 4,
      title: terminalStatus ?? "Completed / Disputed / Cancelled",
      roleLabel: terminalStatus === null ? null : terminalStatus === "Cancelled" ? "Seller" : "Buyer",
      description: terminalStatus === null ? "Buyer to complete or dispute" : null,
      timestamp: terminalTimestamp,
      txRef: terminalTx,
      tone: terminalStatus ? resolveTimelineTone(terminalStatus) : "pending",
    },
  ];
}

function getActionVariantClasses(variant: ActionVariant): string {
  if (variant === "primary") {
    return "border-blue-700 bg-blue-700 text-white hover:bg-blue-800";
  }

  if (variant === "warning") {
    return "border-red-400 bg-white text-red-600 hover:bg-red-50";
  }

  return "border-slate-300 bg-white text-slate-700 hover:bg-slate-50";
}

export default function SaleDetail() {
  const params = useParams<{ id: string }>();
  const rawSaleId = params.id ?? "";
  const saleIdIsValid = /^\d+$/.test(rawSaleId);
  const saleId = saleIdIsValid ? rawSaleId : null;
  const { sale, loading, error, refetch } = useSale(saleId);
  const { address, isConnected } = useWallet();
  const {
    actionState,
    transactionHash,
    errorMessage,
    acceptSale,
    markDelivered,
    confirmReceipt,
    openDispute,
    cancelSale,
    resetActionState,
  } = useSaleActions();

  const [copiedField, setCopiedField] = React.useState<string | null>(null);
  const [timelineTxRef, setTimelineTxRef] = React.useState<Partial<Record<SaleStatus, string | null>>>({});

  const visibility = sale ? getSaleActionVisibility(sale, address) : null;
  const hasConfigError = !CONTRACT_ADDRESS;
  const isActionBusy =
    actionState.status === "awaiting_wallet_confirmation" ||
    actionState.status === "pending_blockchain_confirmation";

  const actionMessage =
    actionState.status === "awaiting_wallet_confirmation"
      ? "Confirm the transaction in your wallet."
      : actionState.status === "pending_blockchain_confirmation"
        ? "Waiting for blockchain confirmation..."
        : actionState.status === "success"
          ? "Action completed successfully."
          : actionState.status === "error"
            ? actionState.errorMessage ?? "Action failed."
            : "Ready.";

  const actions: SaleActionConfig[] = [
    {
      key: "accept",
      label: "Accept Sale",
      variant: "primary",
      visible: Boolean(visibility?.canAcceptSale),
    },
    {
      key: "deliver",
      label: "Mark as Delivered",
      variant: "primary",
      visible: Boolean(visibility?.canMarkDelivered),
    },
    {
      key: "confirm",
      label: "Confirm Receipt",
      variant: "primary",
      visible: Boolean(visibility?.canConfirmReceipt),
    },
    {
      key: "dispute",
      label: "Open Dispute",
      variant: "warning",
      visible: Boolean(visibility?.canOpenDispute),
    },
    {
      key: "cancel",
      label: "Cancel Sale",
      variant: "neutral",
      visible: Boolean(visibility?.canCancelSale),
    },
  ];

  const visibleActions = actions.filter((action) => action.visible);
  const mainActionButtons = visibleActions.filter((action) => action.key !== "cancel");
  const cancelAction = visibleActions.find((action) => action.key === "cancel") ?? null;

  const timelineSteps = React.useMemo(() => {
    if (!sale) return [];
    return buildTimelineSteps(sale, timelineTxRef);
  }, [sale, timelineTxRef]);

  const copyToClipboard = React.useCallback(async (field: string, value: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard || !value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 1000);
    } catch {
      setCopiedField(null);
    }
  }, []);

  async function handleAction(action: "accept" | "deliver" | "confirm" | "dispute" | "cancel") {
    if (!sale) {
      return;
    }

    resetActionState();

    try {
      if (action === "confirm") {
        const approved = window.confirm("Confirm receipt? This will complete the sale and cannot be changed.");
        if (!approved) return;
      }

      if (action === "dispute") {
        const approved = window.confirm(
          "Open dispute? The MVP only records the dispute on-chain and does not resolve it automatically."
        );
        if (!approved) return;
      }

      if (action === "cancel") {
        const approved = window.confirm("Cancel sale? Cancelled sales cannot be changed.");
        if (!approved) return;
      }

      const saleIdValue = sale.id;
      let txHash: string | null = null;

      if (action === "accept") {
        txHash = await acceptSale(saleIdValue);
        setTimelineTxRef((current) => ({ ...current, Accepted: txHash }));
      } else if (action === "deliver") {
        txHash = await markDelivered(saleIdValue);
        setTimelineTxRef((current) => ({ ...current, Delivered: txHash }));
      } else if (action === "confirm") {
        txHash = await confirmReceipt(saleIdValue);
        setTimelineTxRef((current) => ({ ...current, Completed: txHash }));
      } else if (action === "dispute") {
        txHash = await openDispute(saleIdValue);
        setTimelineTxRef((current) => ({ ...current, Disputed: txHash }));
      } else {
        txHash = await cancelSale(saleIdValue);
        setTimelineTxRef((current) => ({ ...current, Cancelled: txHash }));
      }

      await refetch();
    } catch {
      // State is already captured in the hook.
    }
  }

  const renderedTransactionHash = transactionHash ?? null;

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 text-slate-950">
        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Sale #{sale?.id ? sale.id.toString() : saleIdIsValid ? rawSaleId : "--"}
            </h1>
            {sale ? (
              <span
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${STATUS_BADGE_CLASSES[sale.status]}`}
              >
                <TruckIcon className="h-4 w-4" />
                {sale.status}
              </span>
            ) : null}
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            On-chain record of a second-hand gadget sale agreement and status.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.16fr_1fr]">
            <section className="space-y-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:p-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Sale Details</h2>

                {hasConfigError ? (
                  <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:text-base">
                    Missing contract address. Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.
                  </div>
                ) : !saleIdIsValid ? (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:text-base">
                    Invalid sale ID. Route parameter must be numeric.
                  </div>
                ) : loading ? (
                  <p className="mt-5 text-sm text-slate-600 sm:text-base">Loading sale details from contract...</p>
                ) : error ? (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:text-base">
                    {error}
                  </div>
                ) : sale ? (
                  <div className="mt-4">
                    <div className="flex gap-4">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <Image src="/logo.png" alt="Gadget preview" width={72} height={72} className="h-16 w-16 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{sale.gadgetName}</h3>
                        <p className="mt-1 text-base text-slate-600">{sale.brandModel}</p>
                        <p className="mt-2 max-w-[42rem] text-sm leading-6 text-slate-600 sm:text-base">{sale.conditionSummary}</p>
                      </div>
                    </div>

                    <div className="my-4 border-b border-slate-200" />

                    <dl className="space-y-2">
                      <DetailRow
                        icon={<TagIcon className="h-4 w-4" />}
                        label="Price"
                        value={<span className="font-semibold text-slate-950">{formatPrice(sale.price, "PHP").replace("PHP", "P")}</span>}
                      />
                      <DetailRow
                        icon={<UserIcon className="h-4 w-4" />}
                        label="Seller (Wallet)"
                        value={
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-700">{formatAddress(sale.seller)}</span>
                            <CopyButton
                              title={copiedField === "seller" ? "Copied" : "Copy seller wallet"}
                              onClick={() => void copyToClipboard("seller", sale.seller)}
                            />
                          </div>
                        }
                      />
                      <DetailRow
                        icon={<UserIcon className="h-4 w-4" />}
                        label="Buyer (Wallet)"
                        value={
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-blue-700">
                              {sale.buyer === ZERO_ADDRESS ? "Not yet accepted" : formatAddress(sale.buyer)}
                            </span>
                            {sale.buyer !== ZERO_ADDRESS ? (
                              <CopyButton
                                title={copiedField === "buyer" ? "Copied" : "Copy buyer wallet"}
                                onClick={() => void copyToClipboard("buyer", sale.buyer)}
                              />
                            ) : null}
                          </div>
                        }
                      />
                      <DetailRow
                        icon={<HashIcon className="h-4 w-4" />}
                        label="Agreement Hash"
                        value={
                          <HashField
                            value={sale.agreementHash}
                            copyLabel={copiedField === "agreement-hash" ? "Copied" : "Copy agreement hash"}
                            onCopy={() => void copyToClipboard("agreement-hash", sale.agreementHash)}
                          />
                        }
                        alignTop
                      />
                      <DetailRow
                        icon={<FileIcon className="h-4 w-4" />}
                        label="Proof Hash (Optional)"
                        value={
                          <HashField
                            value={sale.proofHash || "Not provided"}
                            copyLabel={copiedField === "proof-hash" ? "Copied" : "Copy proof hash"}
                            onCopy={() => void copyToClipboard("proof-hash", sale.proofHash)}
                            canCopy={Boolean(sale.proofHash)}
                          />
                        }
                        alignTop
                      />
                      <DetailRow
                        icon={<CalendarIcon className="h-4 w-4" />}
                        label="Created"
                        value={<span>{formatTimestamp(sale.createdAt).replace(",", " -")}</span>}
                      />
                    </dl>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-600 sm:text-base">No sale found for this ID.</p>
                )}
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:p-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Available Actions</h2>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">Actions are recorded as blockchain transactions.</p>
                <p className="text-sm text-slate-600 sm:text-base">Completed, disputed, and cancelled sales cannot be changed.</p>

                {!sale ? (
                  <p className="mt-4 text-sm text-slate-600 sm:text-base">Load a sale to show available actions.</p>
                ) : !isConnected ? (
                  <p className="mt-4 text-sm text-slate-600 sm:text-base">Connect your wallet to perform sale actions.</p>
                ) : (
                  <>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {mainActionButtons.map((action) => (
                        <button
                          key={action.key}
                          type="button"
                          onClick={() => void handleAction(action.key)}
                          disabled={isActionBusy}
                          className={`inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 ${getActionVariantClasses(action.variant)}`}
                        >
                          {action.key === "confirm" ? <CheckIcon className="mr-2 h-4 w-4" /> : null}
                          {action.key === "dispute" ? <WarningIcon className="mr-2 h-4 w-4" /> : null}
                          {action.label}
                        </button>
                      ))}
                      {cancelAction ? (
                        <button
                          type="button"
                          onClick={() => void handleAction(cancelAction.key)}
                          disabled={isActionBusy}
                          className={`inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2 ${getActionVariantClasses(cancelAction.variant)}`}
                        >
                          <BanIcon className="mr-2 h-4 w-4" />
                          {cancelAction.label}
                        </button>
                      ) : null}
                    </div>

                    <div className="mt-4 space-y-2">
                      <ActionHelp
                        tone="info"
                        icon={<InfoIcon className="h-4 w-4" />}
                        text="Confirm Receipt: This will complete the sale and cannot be changed."
                      />
                      <ActionHelp
                        tone="warning"
                        icon={<WarningIcon className="h-4 w-4" />}
                        text="Open Dispute: This MVP records a dispute but does not resolve it automatically."
                      />
                      <ActionHelp
                        tone="neutral"
                        icon={<BanIcon className="h-4 w-4" />}
                        text="Cancel Sale: Cancelled sales cannot be changed."
                      />
                    </div>

                    <p className="mt-3 text-xs text-slate-600">{actionMessage}</p>
                    {renderedTransactionHash ? (
                      <p className="mt-1 font-mono text-xs text-slate-500">Tx: {renderedTransactionHash}</p>
                    ) : null}
                    {errorMessage ? <p className="mt-1 text-xs text-red-700">{errorMessage}</p> : null}
                  </>
                )}
              </article>
            </section>

            <section>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] sm:p-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Transaction Timeline</h2>

                {!sale ? (
                  <p className="mt-4 text-sm text-slate-600 sm:text-base">Timeline appears once sale data is loaded.</p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {timelineSteps.map((step, index) => (
                      <div key={step.number} className="flex gap-4">
                        <div className="flex w-10 flex-col items-center">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border text-xl font-bold ${TIMELINE_NODE_CLASSES[step.tone]}`}
                          >
                            {step.number}
                          </div>
                          {index < timelineSteps.length - 1 ? (
                            <div
                              className={`mt-1 h-full w-px ${index === 2 ? "border-l border-dashed border-slate-300" : "bg-slate-300"}`}
                            />
                          ) : null}
                        </div>
                        <div className={`flex-1 rounded-xl border p-4 ${TIMELINE_CARD_CLASSES[step.tone]}`}>
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">{step.title}</h3>
                              {step.roleLabel ? (
                                <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-sm font-medium text-slate-600">
                                  {step.roleLabel}
                                </span>
                              ) : null}
                            </div>
                            <p className="text-sm text-slate-600">{formatTimelineTime(step.timestamp)}</p>
                          </div>

                          {step.txRef ? (
                            <div className="mt-3 flex items-center gap-2 text-sm">
                              <span className="text-slate-700">Tx:</span>
                              <span className="font-semibold text-blue-700">{step.txRef}</span>
                              <CopyButton
                                title={copiedField === `timeline-${step.number}` ? "Copied" : "Copy transaction reference"}
                                onClick={() => void copyToClipboard(`timeline-${step.number}`, step.txRef ?? "")}
                              />
                            </div>
                          ) : step.description ? (
                            <p className="mt-3 text-sm text-slate-600">{step.description}</p>
                          ) : (
                            <p className="mt-3 text-sm text-slate-500">Waiting for this step.</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </section>
          </div>
        </div>

        <footer className="mt-4 border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 text-xs text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-12">
            <Link href="/" className="text-base font-bold text-blue-700">
              GadgetSales
            </Link>
            <p className="text-xs sm:text-sm">&copy; 2024 GadgetSales Ledger. All transactions recorded on-chain.</p>
            <div className="flex gap-6 text-xs sm:text-sm">
              <a href="#" className="transition-colors hover:text-blue-700">
                Terms of Service
              </a>
              <a href="#" className="transition-colors hover:text-blue-700">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-blue-700">
                Security Audit
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function DetailRow({
  icon,
  label,
  value,
  alignTop = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  alignTop?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[170px_1fr] gap-2 ${alignTop ? "items-start" : "items-center"}`}>
      <dt className="flex items-center gap-2 text-sm text-slate-600 sm:text-base">
        <span className="text-slate-500">{icon}</span>
        <span>{label}</span>
      </dt>
      <dd className="min-w-0 text-sm text-slate-700 sm:text-base">{value}</dd>
    </div>
  );
}

function HashField({
  value,
  copyLabel,
  onCopy,
  canCopy = true,
}: {
  value: string;
  copyLabel: string;
  onCopy: () => void;
  canCopy?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2">
      <span className="min-w-0 truncate font-mono text-sm text-slate-700">{value}</span>
      {canCopy ? <CopyButton title={copyLabel} onClick={onCopy} /> : null}
    </div>
  );
}

function ActionHelp({
  icon,
  text,
  tone,
}: {
  icon: React.ReactNode;
  text: string;
  tone: "info" | "warning" | "neutral";
}) {
  const toneClasses =
    tone === "info"
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-300 bg-slate-100 text-slate-700";

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-base ${toneClasses}`}>
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function CopyButton({ title, onClick }: { title: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-blue-700"
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      <CopyIcon className="h-4 w-4" />
    </button>
  );
}

function ArrowLeftIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18 9 12l6-6" />
    </svg>
  );
}

function TruckIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h10v8H3V7Zm10 3h3l3 2v3h-6v-5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 18a1 1 0 1 0 0 .01M17 18a1 1 0 1 0 0 .01" />
    </svg>
  );
}

function TagIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m20 12-8 8-8-8 8-8h8v8Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h.01" />
    </svg>
  );
}

function UserIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 9A3.75 3.75 0 1 1 8.25 9a3.75 3.75 0 0 1 7.5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.25a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

function HashIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 3-2 18m10-18-2 18M4 9h16M3 15h16" />
    </svg>
  );
}

function FileIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h7l3 3v13H7V4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v4h4" />
    </svg>
  );
}

function CalendarIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14v14H5V5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v4m8-4v4M5 10h14" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 12 2 2 4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    </svg>
  );
}

function WarningIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v4m0 4h.01M10.3 3.6 2.8 17.1A1.5 1.5 0 0 0 4.1 19h15.8a1.5 1.5 0 0 0 1.3-1.9L13.7 3.6a1.5 1.5 0 0 0-3.4 0Z"
      />
    </svg>
  );
}

function BanIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.5 8.5 7 7" />
    </svg>
  );
}

function InfoIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function CopyIcon(props: IconProps) {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h11v11H9V9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15V4h11" />
    </svg>
  );
}

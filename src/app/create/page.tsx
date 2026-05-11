"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { useCreateSale } from "@/hooks/useCreateSale";
import { useWallet } from "@/hooks/useWallet";
import { formatPrice } from "@/lib/format";

type IconProps = React.SVGProps<SVGSVGElement>;

const TRANSACTION_STATUS_LABELS = {
  idle: "Idle",
  awaiting_wallet_confirmation: "Awaiting wallet confirmation",
  pending_blockchain_confirmation: "Pending blockchain confirmation",
  success: "Success",
  error: "Error",
} as const;

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-blue-100">
      {children}
    </span>
  );
}

function SparkIcon(props: IconProps) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Z" />
    </svg>
  );
}

function FileIcon(props: IconProps) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h7l4 4v12H7V4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v4h4" />
    </svg>
  );
}

function TagIcon(props: IconProps) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" />
    </svg>
  );
}

function ShieldIcon(props: IconProps) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3 5 6v6c0 4.7 3.1 8.7 7 10 3.9-1.3 7-5.3 7-10V6l-7-3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9.5 12 1.9 1.9 3.7-4" />
    </svg>
  );
}

function EyeIcon(props: IconProps) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );
}

function CopyIcon(props: IconProps) {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 9h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function LinkIcon(props: IconProps) {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  );
}

function SpinnerIcon(props: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3a9 9 0 1 0 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon(props: IconProps) {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3 2.5 20h19L12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function FieldShell({
  label,
  helper,
  error,
  children,
  wide = false,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-800">
        {label}
      </label>
      {children}
      {helper ? <p className="mt-1.5 text-xs leading-5 text-slate-500">{helper}</p> : null}
      {error ? <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
      aria-label={`Copy ${label}`}
      title={copied ? "Copied" : `Copy ${label}`}
    >
      <CopyIcon />
    </button>
  );
}

function PreviewRow({
  icon,
  label,
  value,
  valueClassName = "",
  copyValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  copyValue?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] items-start gap-4 border-b border-slate-100 py-3 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-blue-100 bg-blue-50 text-blue-600">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <div className={`flex items-start justify-between gap-3 text-sm text-slate-700 ${valueClassName}`}>
        <div className="min-w-0 flex-1 break-words">{value}</div>
        {copyValue ? <CopyButton value={copyValue} label={label} /> : null}
      </div>
    </div>
  );
}

function ExampleRow({
  icon,
  label,
  tone,
  message,
  action,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "blue" | "green" | "amber" | "red";
  message: string;
  action?: React.ReactNode;
  value?: React.ReactNode;
}) {
  const toneStyles = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-800",
    red: "border-rose-100 bg-rose-50 text-rose-700",
  } as const;

  return (
    <div className={`grid grid-cols-[minmax(0,120px)_minmax(0,1fr)] items-center gap-3 rounded-lg border px-3 py-2.5 ${toneStyles[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-current/10 bg-white/70 text-current shadow-sm">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <div className="flex min-h-9 items-center justify-between gap-3">
        <div className="min-w-0 flex-1 text-sm leading-5">{value ?? message}</div>
        {action}
      </div>
    </div>
  );
}

export default function CreateSale() {
  const formRef = useRef<HTMLFormElement>(null);
  const { isConnected, shortenedAddress, connectWallet } = useWallet();
  const {
    form,
    agreementHash,
    transactionState,
    createdSaleId,
    isSubmitting,
    handleChange,
    handleSubmit,
  } = useCreateSale();
  const [copyNotice, setCopyNotice] = useState<string | null>(null);

  const pricePreview = /^\d+$/.test(form.price.trim()) ? BigInt(form.price.trim()) : BigInt(0);
  const shortPrice = formatPrice(pricePreview);
  const txHashPreview =
    transactionState.transactionHash ?? "0x5f6a2b91e48c7a4e1d83c93e1a72be4d9e20a33f1db2a66b63cc8bb2d01a83eb2";
  const saleLinkId = createdSaleId ? createdSaleId.toString() : "0";

  const fieldCopy = async (value: string, label: string) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopyNotice(`${label} copied`);
      window.setTimeout(() => setCopyNotice(null), 1400);
    } catch {
      setCopyNotice(`Unable to copy ${label.toLowerCase()}`);
      window.setTimeout(() => setCopyNotice(null), 1400);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f4f7fb] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.06),_transparent_28%)] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <div className="mx-auto w-full max-w-[1024px]">
          <div className="mb-4 flex flex-col gap-2">
            <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[30px]">
              Create Sale Record
            </h1>
            <p className="max-w-2xl text-[14px] leading-6 text-slate-600">
              Record the agreed gadget details and sale terms before the buyer accepts.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-[12px] border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-5"
            >
              <div className="rounded-[10px] border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <SectionIcon>
                    <FileIcon />
                  </SectionIcon>
                  <h2 className="text-[14px] font-semibold text-slate-900">Sale Information</h2>
                </div>

                <div className="grid gap-3.5">
                  <FieldShell label="Gadget name" helper="Enter the common name of the gadget." error={form.validationErrors.gadgetName} wide>
                    <input
                      type="text"
                      name="gadgetName"
                      value={form.gadgetName}
                      onChange={handleChange}
                      placeholder="iPhone 14 Pro 128GB"
                      maxLength={80}
                      className="h-8 w-full rounded-[5px] border border-slate-300 bg-white px-3 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </FieldShell>

                  <FieldShell label="Brand / model" helper="Include brand and exact model details." error={form.validationErrors.brandModel} wide>
                    <input
                      type="text"
                      name="brandModel"
                      value={form.brandModel}
                      onChange={handleChange}
                      placeholder="Apple / A2890, Deep Purple"
                      maxLength={100}
                      className="h-8 w-full rounded-[5px] border border-slate-300 bg-white px-3 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </FieldShell>

                  <FieldShell label="Condition summary" helper="Describe the current condition and any notable wear." error={form.validationErrors.conditionSummary} wide>
                    <textarea
                      name="conditionSummary"
                      value={form.conditionSummary}
                      onChange={handleChange}
                      rows={3}
                      maxLength={160}
                      placeholder="Used, very good condition, minor frame wear, screen intact, battery health 89%"
                      className="w-full rounded-[5px] border border-slate-300 bg-white px-3 py-2 text-[13px] leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </FieldShell>

                  <div className="grid gap-3 sm:grid-cols-[0.46fr_0.54fr]">
                    <FieldShell label="Price" helper="Enter the agreed sale price." error={form.validationErrors.price}>
                      <div className="flex h-8 items-stretch overflow-hidden rounded-[5px] border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                        <span className="inline-flex items-center border-r border-slate-200 px-2.5 text-[13px] text-slate-500">
                          ₱
                        </span>
                        <input
                          type="number"
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          min="1"
                          step="1"
                          placeholder="38,500"
                          className="w-full border-0 bg-transparent px-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </FieldShell>

                    <FieldShell
                      label="Short notes"
                      helper="Add any additional terms or notes for the buyer."
                      error={form.validationErrors.notes}
                    >
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        maxLength={240}
                        placeholder="Includes original box and charging cable. Meet-up transaction."
                        className="w-full rounded-[5px] border border-slate-300 bg-white px-3 py-2 text-[13px] leading-5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </FieldShell>
                  </div>

                  <FieldShell
                    label="Optional proof hash"
                    helper="IPFS or other content hash for supporting proof (optional)."
                    error={form.validationErrors.proofHash}
                    wide
                  >
                    <div className="flex h-8 items-stretch overflow-hidden rounded-[5px] border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                      <input
                        type="text"
                        name="proofHash"
                        value={form.proofHash}
                        onChange={handleChange}
                        placeholder="QmX7p2R9cV8dL1nK4mH2tW9bF6sA3yZ8uR4eP1qT7hJ5mN"
                        maxLength={256}
                        className="min-w-0 flex-1 border-0 bg-transparent px-3 font-mono text-[12px] text-slate-800 outline-none placeholder:font-sans placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => void fieldCopy(form.proofHash, "Proof hash")}
                        className="inline-flex items-center justify-center border-l border-slate-200 px-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                        aria-label="Copy proof hash"
                      >
                        <CopyIcon />
                      </button>
                    </div>
                  </FieldShell>
                </div>

                <div className="mt-3 space-y-2 rounded-[8px] border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-[12px] leading-5 text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-200 text-blue-600">
                      <WarningIcon />
                    </span>
                    <p>Do not enter private information such as IMEI, serial numbers, home addresses, or personal IDs.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-200 text-blue-600">
                      <ShieldIcon />
                    </span>
                    <p>Only the agreement hash and required transaction fields should be stored on-chain.</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-[10px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-[14px] font-semibold text-slate-900">Transaction State (Examples)</h2>
                  <button
                    type="submit"
                    disabled={!isConnected || isSubmitting}
                    className="inline-flex h-8 items-center gap-2 rounded-[6px] bg-blue-600 px-4 text-[13px] font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/25 text-[11px]">
                      +
                    </span>
                    {isSubmitting ? "Submitting..." : "Create Sale"}
                  </button>
                </div>

                <div className="space-y-2.5">
                  <ExampleRow
                    icon={<FileIcon />}
                    label="Wallet setup"
                    tone="blue"
                    message="Connect your wallet to create a sale."
                    action={
                      <button
                        type="button"
                        onClick={() => void connectWallet()}
                        disabled={isConnected}
                        className="inline-flex h-7 items-center rounded-[5px] border border-blue-200 bg-white px-3 text-[12px] font-medium text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Connect Wallet
                      </button>
                    }
                    value={isConnected ? `Connected as ${shortenedAddress}` : undefined}
                  />

                  <ExampleRow
                    icon={<SparkIcon />}
                    label="Awaiting"
                    tone="blue"
                    message="Confirm in wallet."
                    action={
                      <button
                        type="button"
                        disabled
                        className="inline-flex h-7 items-center rounded-[5px] border border-slate-200 bg-slate-50 px-3 text-[12px] font-medium text-slate-400"
                      >
                        Confirm in wallet...
                      </button>
                    }
                  />

                  <ExampleRow
                    icon={<SpinnerIcon />}
                    label="Pending"
                    tone="amber"
                    message="Waiting for blockchain confirmation..."
                    action={
                      <button
                        type="button"
                        disabled
                        className="inline-flex h-7 items-center gap-1 rounded-[5px] border border-amber-200 bg-amber-50 px-3 text-[12px] font-medium text-amber-700"
                      >
                        <SpinnerIcon className="animate-spin" />
                        Waiting...
                      </button>
                    }
                  />

                  <ExampleRow
                    icon={<ShieldIcon />}
                    label="Success"
                    tone="green"
                    message="Sale created successfully on-chain."
                    value={
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-[5px] border border-emerald-200 bg-white px-2.5 py-1 text-[12px] text-emerald-800">
                          Tx: <span className="font-mono text-[11px]">{txHashPreview.slice(0, 10)}...{txHashPreview.slice(-4)}</span>
                        </span>
                        <CopyButton value={txHashPreview} label="Transaction hash" />
                      </div>
                    }
                    action={
                      <Link
                        href={`/sales/${saleLinkId}`}
                        className="inline-flex h-7 items-center gap-1 rounded-[5px] bg-emerald-100 px-3 text-[12px] font-medium text-emerald-700 transition hover:bg-emerald-200"
                      >
                        View Sale Detail <LinkIcon />
                      </Link>
                    }
                  />

                  <ExampleRow
                    icon={<WarningIcon />}
                    label="Error"
                    tone="red"
                    message={transactionState.errorMessage ?? "Transaction failed. Please retry after checking your wallet confirmation."}
                    action={
                      <button
                        type="button"
                        onClick={() => formRef.current?.requestSubmit()}
                        className="inline-flex h-7 items-center rounded-[5px] border border-rose-200 bg-white px-3 text-[12px] font-medium text-rose-600 transition hover:bg-rose-50"
                      >
                        Retry
                      </button>
                    }
                  />
                </div>

                {copyNotice ? (
                  <p className="mt-3 text-[12px] text-slate-500">{copyNotice}</p>
                ) : transactionState.status !== "idle" ? (
                  <p className="mt-3 text-[12px] text-slate-500">
                    {TRANSACTION_STATUS_LABELS[transactionState.status]} · {transactionState.transactionHash ?? "No transaction hash yet"}
                  </p>
                ) : null}
              </div>
            </form>

            <aside className="space-y-4">
              <div className="rounded-[12px] border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
                <div className="mb-3 flex items-center gap-3">
                  <SectionIcon>
                    <EyeIcon />
                  </SectionIcon>
                  <div>
                    <h2 className="text-[14px] font-semibold text-slate-900">Agreement Preview</h2>
                    <p className="text-[12px] text-slate-500">Review the details that will be recorded on-chain.</p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 rounded-[10px] border border-slate-200 bg-white px-4">
                  <PreviewRow icon={<FileIcon />} label="Gadget name" value={form.gadgetName || "iPhone 14 Pro 128GB"} />
                  <PreviewRow icon={<TagIcon />} label="Brand / model" value={form.brandModel || "Apple / A2890, Deep Purple"} />
                  <PreviewRow icon={<ShieldIcon />} label="Condition summary" value={form.conditionSummary || "Used, very good condition, minor frame wear, screen intact, battery health 89%"} />
                  <PreviewRow icon={<SparkIcon />} label="Price" value={shortPrice} />
                  <PreviewRow icon={<FileIcon />} label="Short notes" value={form.notes || "Includes original box and charging cable. Meet-up transaction."} />
                  <PreviewRow
                    icon={<LinkIcon />}
                    label="Proof hash"
                    value={form.proofHash || "QmX7p2R9cV8dL1nK4mH2tW9bF6sA3yZ8uR4eP1qT7hJ5mN"}
                    copyValue={form.proofHash || "QmX7p2R9cV8dL1nK4mH2tW9bF6sA3yZ8uR4eP1qT7hJ5mN"}
                  />
                </div>

                <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
                  <p className="text-[12px] font-medium text-slate-700">Generated agreement hash</p>
                  <div className="mt-2 flex items-center gap-2 rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="min-w-0 flex-1 break-all font-mono text-[12px] leading-5 text-slate-700">
                      {agreementHash || "Generating..."}
                    </p>
                    <CopyButton value={agreementHash} label="Agreement hash" />
                  </div>
                  <p className="mt-2 text-[12px] leading-5 text-slate-500">
                    The agreement hash represents the agreed details without storing long private content on-chain.
                  </p>
                  <div className="mt-3 rounded-[8px] border border-blue-100 bg-blue-50/60 px-3 py-2.5 text-[12px] leading-5 text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-blue-200 text-blue-600">
                        <ShieldIcon />
                      </span>
                      <p>This preview will be the exact data summary available to the buyer and third parties on-chain.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[12px] border border-slate-200 bg-white p-4 text-[13px] leading-6 text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
                <p className="font-semibold text-slate-900">On-chain storage reminder</p>
                <p className="mt-1">
                  The contract stores the agreement hash, price, status, timestamps, and proof reference. Full notes and private details stay off-chain.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

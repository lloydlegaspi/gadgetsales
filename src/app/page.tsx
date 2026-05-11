import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

type IconProps = React.SVGProps<SVGSVGElement>;

const verificationCards = [
  {
    title: "Tamper-resistant history",
    copy:
      "Every state change is recorded immutably, ensuring neither party can alter the past agreement without detection.",
    icon: HistoryIcon,
  },
  {
    title: "Shared agreement record",
    copy:
      "Both buyer and seller reference the exact same source of truth for terms, conditions, and device details.",
    icon: DocumentIcon,
  },
  {
    title: "Transparent status updates",
    copy:
      "Clear visibility into the current phase of the transaction, reducing communication overhead and anxiety.",
    icon: RefreshIcon,
  },
];

const scopeLimits = [
  "No escrow of funds",
  "No built-in chat",
  "No authenticity guarantee",
  "No IMEI verification",
];

const workflowSteps = [
  {
    label: "1. Create",
    copy: "Seller creates sale agreement.",
    icon: CreateIcon,
  },
  {
    label: "2. Accept",
    copy: "Buyer accepts transaction.",
    icon: HandshakeIcon,
  },
  {
    label: "3. Deliver",
    copy: "Seller marks as delivered.",
    icon: TruckIcon,
  },
  {
    label: "4. Resolve",
    copy: "Buyer completes or disputes.",
    icon: BadgeCheckIcon,
  },
];

function CircleIcon({
  children,
  className = "h-10 w-10 bg-white",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-blue-100 text-blue-700 shadow-sm ${className}`}
    >
      {children}
    </span>
  );
}

function CreateIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h6l4 4v12H7V4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 4v5h5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 13v5m-2.5-2.5h5" />
    </svg>
  );
}

function HandshakeIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.5 12.5 2.2 2.2a2 2 0 0 0 2.8 0l4.2-4.2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m7.5 15.5-3-3 5-5 3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.5 8.5 3 3-5 5-3-3" />
    </svg>
  );
}

function TruckIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.5 7.5h11v8h-11v-8Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 10h3l3 3v2.5h-6V10Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}

function BadgeCheckIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m12 3 2.3 1.7 2.8-.1.8 2.7 2.2 1.7-.9 2.7.9 2.7-2.2 1.7-.8 2.7-2.8-.1L12 21l-2.3-1.7-2.8.1-.8-2.7-2.2-1.7.9-2.7-.9-2.7 2.2-1.7.8-2.7 2.8.1L12 3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8.8 12.2 2.1 2.1 4.3-4.6" />
    </svg>
  );
}

function HistoryIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 1 0 2.35-5.65" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5.5v4h4" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2" />
    </svg>
  );
}

function DocumentIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h7l3 3v13H7V4Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 4v4h4M10 12h5M10 16h5" />
    </svg>
  );
}

function RefreshIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12a7 7 0 0 1-11.9 5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12a7 7 0 0 1 11.9-5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3v4h4M8 21v-4H4" />
    </svg>
  );
}

function PlusCircleIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8M8 12h8" />
    </svg>
  );
}

function GridIcon(props: IconProps) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h5v5H5V5Zm9 0h5v5h-5V5ZM5 14h5v5H5v-5Zm9 0h5v5h-5v-5Z" />
    </svg>
  );
}

function InfoIcon(props: IconProps) {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function XCircleIcon(props: IconProps) {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 9 6 6m0-6-6 6" />
    </svg>
  );
}

function PlayIcon(props: IconProps) {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" {...props}>
      <path d="M8 5.6v12.8L18.2 12 8 5.6Zm2 3.6 4.45 2.8L10 14.8V9.2Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="home-page flex-1 bg-slate-50 text-slate-950">
        <section className="mx-auto max-w-5xl px-5 pb-20 pt-20 text-center">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
            Trust Every Transfer.
            <br />
            Verify Every Sale.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-slate-700">
            Record agreed gadget sale details on-chain for a tamper-resistant history. Ensure
            transparency and accountability throughout your second-hand transactions without relying
            on central authorities.
          </p>

          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/create"
              className="inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-md bg-blue-700 px-6 text-xs font-bold text-white shadow-lg transition-colors hover:bg-blue-800"
            >
              <PlusCircleIcon />
              Create Sale
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-10 min-w-44 items-center justify-center gap-2 rounded-md border border-blue-200 bg-white px-6 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-50"
            >
              <GridIcon />
              View Dashboard
            </Link>
          </div>

          <div className="mx-auto mt-5 flex max-w-sm items-start justify-center gap-2 rounded border border-blue-100 bg-indigo-50 px-5 py-2.5 text-xs leading-5 text-slate-500">
            <InfoIcon className="mt-0.5 shrink-0 text-blue-700" />
            <p>Records agreement and transaction status. Does not verify physical authenticity.</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl border-y border-slate-200 px-5 py-7 text-center">
          <h2 className="text-xl font-extrabold">How it works</h2>
          <div className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {workflowSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div key={step.label} className="text-center">
                  <CircleIcon>
                    <StepIcon />
                  </CircleIcon>
                  <h3 className="mt-3 text-xs font-bold text-slate-950">{step.label}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{step.copy}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-16">
          <h2 className="text-center text-xl font-extrabold">
            Why use a verified ledger?
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {verificationCards.map((card) => {
              const CardIcon = card.icon;
              return (
                <article
                  key={card.title}
                  className="min-h-44 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                    <CardIcon />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{card.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-5xl rounded-lg border border-blue-100 bg-indigo-50 px-7 py-6">
          <div className="grid gap-7 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-xl font-extrabold">Scope of Verification</h2>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-700">
                GadgetSales is a utility for recording intent and status, not a comprehensive
                mediation service.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {scopeLimits.map((limit) => (
                <div
                  key={limit}
                  className="flex h-12 items-center gap-3 rounded border border-slate-200 bg-white px-4 text-sm text-slate-950"
                >
                  <XCircleIcon className="shrink-0 text-red-600" />
                  {limit}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-5 py-20 text-center">
          <div className="rounded-lg border border-blue-200 bg-white px-8 py-10 shadow-xl">
            <h2 className="text-xl font-extrabold">
              Ready to record your next sale?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-700">
              Create a clear, verifiable record of your transaction terms before handing over your
              device.
            </p>
            <Link
              href="/create"
              className="mx-auto mt-8 inline-flex min-h-11 w-full max-w-sm items-center justify-center gap-2 rounded-md bg-blue-700 px-6 text-xs font-bold text-white shadow-lg transition-colors hover:bg-blue-800"
            >
              <PlayIcon />
              Start a verifiable second-hand gadget transaction
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="font-bold text-blue-700">
              GadgetSales
            </Link>
            <p>&copy; 2024 GadgetSales Ledger. All transactions recorded on-chain.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-700">
                Terms of Service
              </a>
              <a href="#" className="hover:text-blue-700">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-700">
                Security Audit
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

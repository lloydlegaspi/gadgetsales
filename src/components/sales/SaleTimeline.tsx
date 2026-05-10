"use client";

import React from "react";
import type { SaleStatus } from "@/types/sale";
import { formatAddress, formatTimestamp } from "@/lib/format";

interface TimelineEvent {
  status: SaleStatus;
  timestamp: bigint | number;
  actor: string;
}

interface SaleTimelineProps {
  events: TimelineEvent[];
}

export function SaleTimeline({ events }: SaleTimelineProps) {
  if (events.length === 0) {
    return <div className="text-gray-500">No events recorded yet.</div>;
  }

  return (
    <div className="space-y-4">
      {events.map((event, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            {idx < events.length - 1 && <div className="w-0.5 h-12 bg-blue-200 my-2"></div>}
          </div>
          <div className="pb-4">
            <div className="font-semibold text-gray-900">{event.status}</div>
            <div className="text-sm text-gray-600">{formatTimestamp(event.timestamp)}</div>
            <div className="text-xs text-gray-500 font-mono">{formatAddress(event.actor)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

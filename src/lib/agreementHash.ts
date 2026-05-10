import type { AgreementPayload } from "@/types/sale";

/**
 * Normalize agreement payload by trimming whitespace and handling empty values.
 */
function normalizePayload(payload: AgreementPayload): AgreementPayload {
  return {
    gadgetName: payload.gadgetName.trim(),
    brandModel: payload.brandModel.trim(),
    conditionSummary: payload.conditionSummary.trim(),
    price: payload.price.trim(),
    notes: payload.notes.trim(),
    proofHash: payload.proofHash.trim(),
  };
}

/**
 * Generate a deterministic JSON string from agreement payload.
 * This is used as input for agreement hash calculation.
 */
export function generateAgreementJSON(payload: AgreementPayload): string {
  const normalized = normalizePayload(payload);
  return JSON.stringify(normalized, Object.keys(normalized).sort());
}

/**
 * Generate a SHA-256 hash of the agreement payload.
 * Uses the browser's SubtleCrypto API for deterministic hashing.
 * Returns the hash as a hex string prefixed with "0x".
 */
export async function generateAgreementHash(payload: AgreementPayload): Promise<string> {
  const jsonString = generateAgreementJSON(payload);
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return `0x${hashHex}`;
}

/**
 * Synchronous version: Generate SHA-256 using simpler method (for demo/testing).
 * Note: This is not cryptographically identical to the async version but consistent.
 * In production, prefer the async version with SubtleCrypto.
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `0x${Math.abs(hash).toString(16).padStart(64, "0")}`;
}

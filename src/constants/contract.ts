export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim() ?? "";
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "31337");
export const CONTRACT_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL?.trim() ?? "http://127.0.0.1:8545";

export function requireContractAddress(): string {
  if (!CONTRACT_ADDRESS) {
    throw new Error(
      "Missing NEXT_PUBLIC_CONTRACT_ADDRESS. Deploy the contract locally and copy the address into .env.local."
    );
  }

  return CONTRACT_ADDRESS;
}


/**
 * Format a wallet address to a shortened version.
 * Example: 0x1234567890123456789012345678901234567890 -> 0x1234...7890
 */
export function formatAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Format a timestamp (in seconds) to a readable date string.
 */
export function formatTimestamp(timestamp: bigint | number): string {
  const ms = typeof timestamp === "bigint" ? Number(timestamp) * 1000 : timestamp * 1000;
  const date = new Date(ms);
  return date.toLocaleString();
}

/**
 * Format a price value as a string, optionally with currency symbol.
 */
export function formatPrice(price: bigint | number, currency: string = "PHP"): string {
  const num = typeof price === "bigint" ? Number(price) : price;
  return `${currency} ${num.toLocaleString()}`;
}

/**
 * Truncate text to a maximum length and add ellipsis if needed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

// utils/dateUtils.ts
export function parseFirestoreTimestamp(tsString: string): Date | null {
  // Example input: "2025-06-02 at 12:00:00 PM UTC+8"
  // We’ll replace “ at ” with a space and strip the “UTC+X” part by letting Date parse it.
  try {
    // Remove the “ at ” substring
    const noAt = tsString.replace(" at ", " ");
    // Convert “UTC+8” into “GMT+0800” so that Date can parse it in JS
    const normalized = noAt.replace(/UTC([+-]\d+)$/, "GMT$100");
    const d = new Date(normalized);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}

// ============================================================================
// Formatting Utilities
// ============================================================================

export const fmt = (n: number | null | undefined): string =>
  n == null ? '—' : n.toLocaleString();

export const pct = (n: number | null | undefined): string =>
  n == null ? '—' : n.toFixed(1) + '%';

export const scr = (n: number | null | undefined): string =>
  n == null ? '—' : n.toFixed(1);

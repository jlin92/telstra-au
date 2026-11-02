/** Tiny classnames helper — filters falsy values and joins with spaces. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

/** Format points with thousands separators, e.g. "12,400". */
export function formatPoints(value: number): string {
  return Math.round(value).toLocaleString('en-AU');
}

/** Format an illustrative AUD amount. */
export function formatAud(value: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
}

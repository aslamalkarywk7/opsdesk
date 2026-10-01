// Money formatting (USD, no fractions). Demo data uses USD labels even though
// seed names/phones are Egyptian - cosmetic only, see tests/domain.test.mjs.
export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(n);
}

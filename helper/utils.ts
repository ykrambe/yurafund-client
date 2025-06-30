export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID').format(amount)
}
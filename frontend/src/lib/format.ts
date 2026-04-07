export function formatCurrency(value: number | null | undefined) {
  if (!value) {
    return "Liên hệ shop";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
}

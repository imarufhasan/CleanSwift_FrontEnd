export const formatOrderNumber = (orderId?: string | number | null) => {
  const value = String(orderId ?? "").trim();

  if (!value || value === "-") return "-";

  return value.length > 6 ? value.slice(-6).toUpperCase() : value.toUpperCase();
};

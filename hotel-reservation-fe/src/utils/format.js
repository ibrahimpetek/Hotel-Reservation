export const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const nightsBetween = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
};

export const todayIsoDate = () => new Date().toISOString().split("T")[0];

export const addDaysIso = (isoDate, days) => {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};


export const installmentOptions = (totalPrice) => {
  return [1, 3, 6, 9].map((count) => ({
    count,
    perInstallment: totalPrice / count,
    label: count === 1 ? "Tek Cekim" : `${count} Taksit`,
  }));
};

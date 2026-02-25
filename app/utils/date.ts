export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

export const fmt = (d: Date) => d.toISOString().split("T")[0];

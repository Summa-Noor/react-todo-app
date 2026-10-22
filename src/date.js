// Local-date helpers (avoid UTC shifts from toISOString)
export const toKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayKey = () => toKey(new Date());

export const formatDate = (key) =>
  new Date(key + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

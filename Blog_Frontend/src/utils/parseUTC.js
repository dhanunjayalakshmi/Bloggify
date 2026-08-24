// Supabase may return timestamps without 'Z' (timestamp without time zone columns).
// Append 'Z' so the browser treats them as UTC, not local time.
export const parseUTC = (iso) => {
  if (!iso) return null;
  const hasTimezone = iso.endsWith("Z") || /[+-]\d{2}:?\d{2}$/.test(iso);
  return new Date(hasTimezone ? iso : iso + "Z");
};

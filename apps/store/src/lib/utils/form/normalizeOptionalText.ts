/** Trims text and turns an empty value into `null`. */
export const normalizeOptionalText = (value?: string | null) =>
  value?.trim() || null;

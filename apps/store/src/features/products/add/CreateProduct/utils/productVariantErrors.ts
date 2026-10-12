export const getInvalidProductVariantIndexes = (fieldMeta: object) => {
  const invalidVariantIndexes = new Set<number>();

  Object.entries(fieldMeta).forEach(([fieldName, meta]) => {
    const match = /^productVariants\[(\d+)\]\./.exec(fieldName);

    if (
      !match ||
      !meta ||
      typeof meta !== 'object' ||
      !('errors' in meta) ||
      !Array.isArray(meta.errors) ||
      meta.errors.length === 0
    ) {
      return;
    }

    invalidVariantIndexes.add(Number(match[1]));
  });

  return Array.from(invalidVariantIndexes);
};

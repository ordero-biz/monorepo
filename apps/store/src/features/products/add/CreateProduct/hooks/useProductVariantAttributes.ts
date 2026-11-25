import { useState } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';

export const useProductVariantAttributes = (
  generatedAttributes: AttributeDropdown[]
) => {
  // Variant order is fixed during review. Each variant can edit its own attributes.
  const [attributesByVariant, setAttributesByVariant] = useState<
    Record<number, AttributeDropdown[]>
  >({});

  const getVariantAttributes = (variantIndex: number) =>
    attributesByVariant[variantIndex] ?? generatedAttributes;

  const updateVariantAttributes = (
    variantIndex: number,
    attributes: AttributeDropdown[]
  ) => {
    setAttributesByVariant((current) => ({
      ...current,
      [variantIndex]: attributes,
    }));
  };

  return { getVariantAttributes, updateVariantAttributes };
};

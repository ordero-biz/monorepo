import { useCallback, useState } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { ProductVariantsGeneratedArgs } from '../types';

export const useProductGenerationState = () => {
  const [generatedAttributes, setGeneratedAttributes] = useState<
    AttributeDropdown[]
  >([]);
  const [isProductVariantGenerationStage, setIsProductVariantGenerationStage] =
    useState(true);

  const onProductVariantsGenerated = useCallback(
    ({ attributes }: ProductVariantsGeneratedArgs) => {
      setGeneratedAttributes(attributes);
      setIsProductVariantGenerationStage(false);
    },
    []
  );

  return {
    generatedAttributes,
    isProductVariantGenerationStage,
    onProductVariantsGenerated,
  };
};

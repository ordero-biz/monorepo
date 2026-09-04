import { useCallback, useState } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { ProductVariantsGeneratedArgs } from '../types';

export const useProductGenerationState = () => {
  const [generatedAttributes, setGeneratedAttributes] = useState<
    AttributeDropdown[]
  >([]);
  const [generatedTemplateSignature, setGeneratedTemplateSignature] =
    useState<string>();
  const [generationVersion, setGenerationVersion] = useState(0);
  const onProductVariantsGenerated = useCallback(
    ({ attributes, generationSignature }: ProductVariantsGeneratedArgs) => {
      setGeneratedAttributes(attributes);
      setGeneratedTemplateSignature(generationSignature);
      setGenerationVersion((version) => version + 1);
    },
    []
  );

  return {
    generatedAttributes,
    generatedTemplateSignature,
    generationVersion,
    onProductVariantsGenerated,
  };
};

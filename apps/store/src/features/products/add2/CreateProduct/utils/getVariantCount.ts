import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import {
  DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
  PRODUCT_GENERATION_MODE,
} from '../../../add/CreateProduct';
import type { ProductGenerationMode } from '../types';

type GetVariantCountArgs = {
  attributes: Pick<AttributeDropdown, 'id'>[];
  attributeValues: Record<string, string[]>;
  generationMode: ProductGenerationMode;
};

export const getVariantCount = ({
  attributes,
  attributeValues,
  generationMode,
}: GetVariantCountArgs) => {
  if (generationMode === PRODUCT_GENERATION_MODE.one) {
    return 1;
  }

  let count = 0;

  for (const attribute of attributes) {
    const selectedCount = attributeValues[String(attribute.id)]?.length ?? 0;

    if (selectedCount === 0) {
      continue;
    }

    count = Math.max(count, 1) * selectedCount;

    if (count > DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS) {
      return DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS + 1;
    }
  }

  return count;
};

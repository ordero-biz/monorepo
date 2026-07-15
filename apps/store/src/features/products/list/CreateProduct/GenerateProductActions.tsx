import { Button, FieldHelperText } from '@ordero/ui';
import { PRODUCT_GENERATION_MODE } from './constants';
import type { GenerateProductActionsProps } from './types';
import {
  getGeneratedProductVariants,
  getGeneratedSingleProductVariant,
  getSelectedAttributeValueGroups,
  getSelectedAttributeValues,
} from './utils/cartesianProductGeneration';

export const GenerateProductActions = ({
  form,
  generationMode,
}: GenerateProductActionsProps) => {
  const isMultipleProducts = generationMode === PRODUCT_GENERATION_MODE.many;

  return (
    <form.Subscribe
      selector={(state) =>
        [
          state.values.productName,
          state.values.attributes,
          state.values.attributeValues,
          state.values.description,
          state.values.category,
        ] as const
      }
    >
      {([productName, attributes, attributeValues, description, category]) => {
        const selectedAttributeValueGroups = getSelectedAttributeValueGroups(
          attributes,
          attributeValues
        );
        const hasSelectedAttributeValues =
          selectedAttributeValueGroups.length > 0 &&
          selectedAttributeValueGroups.every((group) => group.length > 0);
        const isGenerateDisabled =
          !productName.trim() ||
          !category ||
          (isMultipleProducts && !hasSelectedAttributeValues);
        const helperText = isMultipleProducts
          ? 'You will proceed to configure products based on selected attributes'
          : 'You will proceed to configure 1 product';

        return (
          <div className="flex flex-col items-end gap-[var(--space-1)]">
            <Button
              color="primary"
              disabled={isGenerateDisabled}
              onClick={() => {
                if (isMultipleProducts) {
                  form.setFieldValue(
                    'productVariants',
                    getGeneratedProductVariants({
                      attributeValuesByAttributeId: attributeValues,
                      attributes,
                      description,
                      productName,
                    })
                  );

                  return;
                }

                const selectedAttributeValues = getSelectedAttributeValues(
                  attributes,
                  attributeValues
                );

                form.setFieldValue('productVariants', [
                  getGeneratedSingleProductVariant({
                    attributeValues: selectedAttributeValues,
                    description,
                    productName,
                  }),
                ]);
              }}
              size="l"
              type="button"
            >
              {isMultipleProducts
                ? 'Next: Configure products'
                : 'Next: Configure product'}
            </Button>
            <FieldHelperText align="end">{helperText}</FieldHelperText>
          </div>
        );
      }}
    </form.Subscribe>
  );
};

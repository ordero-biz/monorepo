import { Button, FieldHelperText } from '@ordero/ui';
import { PRODUCT_GENERATION_MODE } from './constants';
import type { GenerateProductActionsProps } from './types';
import { getSelectedAttributeValueGroups } from './utils/productGeneration';

export const GenerateProductActions = ({
  productVariantsGenerationForm,
  generationMode,
}: GenerateProductActionsProps) => {
  const isMultipleProducts = generationMode === PRODUCT_GENERATION_MODE.many;

  return (
    <productVariantsGenerationForm.Subscribe
      selector={(state) =>
        [state.values.attributes, state.values.attributeValues] as const
      }
    >
      {([attributes, attributeValues]) => {
        const selectedAttributeValueGroups = getSelectedAttributeValueGroups(
          attributes,
          attributeValues
        ).filter((group) => group.length > 0);
        const hasSelectedAttributeValues =
          selectedAttributeValueGroups.length > 0;
        const generatedProductsCount = hasSelectedAttributeValues
          ? selectedAttributeValueGroups.reduce(
              (count, group) => count * group.length,
              1
            )
          : 0;
        return (
          <div className="flex flex-col items-end gap-[var(--space-1)]">
            <Button color="primary" size="l" type="submit">
              {isMultipleProducts
                ? 'Next: Configure products'
                : 'Next: Configure product'}
            </Button>
            {isMultipleProducts ? (
              <FieldHelperText align="end">
                {generatedProductsCount} products will be generated
              </FieldHelperText>
            ) : null}
          </div>
        );
      }}
    </productVariantsGenerationForm.Subscribe>
  );
};

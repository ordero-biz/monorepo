import { Button, FieldHelperText } from '@ordero/ui';
import { PRODUCT_GENERATION_MODE } from './constants';
import type { GenerateProductActionsProps } from './types';
import { getGeneratedProductsCount } from './utils/productGeneration';

export const GenerateProductActions = ({
  productVariantsGenerationForm,
  generationMode,
  maxGeneratedProductVariants,
}: GenerateProductActionsProps) => {
  const isMultipleProducts = generationMode === PRODUCT_GENERATION_MODE.many;

  return (
    <productVariantsGenerationForm.Subscribe
      selector={(state) =>
        [state.values.attributes, state.values.attributeValues] as const
      }
    >
      {([attributes, attributeValues]) => {
        const generatedProductsCount = getGeneratedProductsCount(
          attributes,
          attributeValues
        );
        const exceedsLimit =
          generatedProductsCount > maxGeneratedProductVariants;

        return (
          <div className="flex flex-col items-end gap-[var(--space-1)]">
            <Button
              color="primary"
              disabled={isMultipleProducts && exceedsLimit}
              size="l"
              type="submit"
            >
              {isMultipleProducts
                ? 'Next: Configure products'
                : 'Next: Configure product'}
            </Button>
            {isMultipleProducts ? (
              <FieldHelperText align="end" invalid={exceedsLimit}>
                {generatedProductsCount} products will be generated
                {exceedsLimit
                  ? ` (maximum ${maxGeneratedProductVariants})`
                  : ''}
              </FieldHelperText>
            ) : null}
          </div>
        );
      }}
    </productVariantsGenerationForm.Subscribe>
  );
};

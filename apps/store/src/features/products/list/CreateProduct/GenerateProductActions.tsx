import { Button, FieldHelperText } from '@ordero/ui';
import { PRODUCT_GENERATION_MODE } from './constants';
import type { GenerateProductActionsProps } from './types';
import {
  getGeneratedProductVariants,
  getGeneratedSingleProductVariant,
  getProductVariantGenerationSignature,
  getSelectedAttributeValueGroups,
  getSelectedAttributeValues,
} from './utils/productGeneration';
import { validateProductTemplate } from './utils/validations';

export const GenerateProductActions = ({
  form,
  generatedTemplateSignature,
  generationMode,
  onProductVariantsGenerated,
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
        ] as const
      }
    >
      {([productName, attributes, attributeValues, description]) => {
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
        const generationSignature = getProductVariantGenerationSignature({
          attributeValuesByAttributeId: attributeValues,
          attributes,
          description,
          generationMode,
          productName,
        });

        return (
          <form.Subscribe
            selector={(state) => state.values.productVariants.length}
          >
            {(productVariantCount) => {
              const hasTemplateChanges =
                productVariantCount > 0 &&
                generatedTemplateSignature !== undefined &&
                generatedTemplateSignature !== generationSignature;

              return (
                <div className="flex flex-col items-end gap-[var(--space-1)]">
                  <Button
                    color="primary"
                    onClick={() => {
                      const templateValidationResult = validateProductTemplate({
                        value: form.state.values,
                      });

                      form.setErrorMap({
                        onSubmit: templateValidationResult,
                      });

                      if (templateValidationResult) {
                        return;
                      }

                      form.setFieldValue(
                        'productVariantsGenerationMode',
                        generationMode
                      );

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
                      } else {
                        const selectedAttributeValues =
                          getSelectedAttributeValues(
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
                      }

                      onProductVariantsGenerated({
                        attributes,
                        generationSignature,
                      });
                    }}
                    size="l"
                    type="button"
                  >
                    {hasTemplateChanges
                      ? isMultipleProducts
                        ? 'Regenerate products'
                        : 'Regenerate product'
                      : isMultipleProducts
                        ? 'Next: Configure products'
                        : 'Next: Configure product'}
                  </Button>
                  {hasTemplateChanges ? (
                    <FieldHelperText align="end">
                      Template changes apply when you regenerate. Existing
                      variants will be submitted unchanged.
                    </FieldHelperText>
                  ) : isMultipleProducts ? (
                    <FieldHelperText align="end">
                      {generatedProductsCount} products will be generated
                    </FieldHelperText>
                  ) : null}
                </div>
              );
            }}
          </form.Subscribe>
        );
      }}
    </form.Subscribe>
  );
};

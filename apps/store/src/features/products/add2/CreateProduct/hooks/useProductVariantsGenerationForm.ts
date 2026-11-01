import { revalidateLogic, useForm } from '@tanstack/react-form';
import {
  createProductGenerationDefaultValues,
  DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
  getProductVariantsGeneratedArgs,
  PRODUCT_GENERATION_MODE,
  type ProductVariantsGeneratedArgs,
  validateProductAttributes,
  validateProductTemplate,
} from '../../../add/CreateProduct';
import type { ProductGenerationValues } from '../types';

type UseProductVariantsGenerationFormArgs = {
  onProductVariantsGenerated: (args: ProductVariantsGeneratedArgs) => void;
};

const defaultValues: ProductGenerationValues = {
  ...createProductGenerationDefaultValues,
  generationMode: PRODUCT_GENERATION_MODE.one,
};

export const useProductVariantsGenerationForm = ({
  onProductVariantsGenerated,
}: UseProductVariantsGenerationFormArgs) => {
  const form = useForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) => {
        const templateErrors = validateProductTemplate({
          generationMode: value.generationMode,
          maxGeneratedProductVariants: DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
          value,
        });
        const attributesError =
          value.generationMode === PRODUCT_GENERATION_MODE.many
            ? validateProductAttributes({ value: value.attributes })
            : undefined;

        if (!templateErrors && !attributesError) {
          return undefined;
        }

        return {
          fields: {
            ...templateErrors?.fields,
            attributes: attributesError,
          },
        };
      },
    },
    onSubmit: ({ value }) => {
      onProductVariantsGenerated(
        getProductVariantsGeneratedArgs({
          generationMode: value.generationMode,
          value,
        })
      );
    },
  });

  return { form };
};

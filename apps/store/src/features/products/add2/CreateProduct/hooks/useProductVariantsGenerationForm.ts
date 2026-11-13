import { revalidateLogic, useForm } from '@tanstack/react-form';
import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import {
  createProductGenerationDefaultValues,
  DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
  getProductVariantsGeneratedArgs,
  PRODUCT_GENERATION_MODE,
  validateProductAttributes,
  validateProductStatus,
  validateProductTemplate,
} from '../../../add/CreateProduct';
import type {
  ProductGenerationValues,
  ProductVariantsGeneratedArgs,
} from '../types';

type UseProductVariantsGenerationFormArgs = {
  onProductVariantsGenerated: (args: ProductVariantsGeneratedArgs) => void;
};

const defaultValues: ProductGenerationValues = {
  ...createProductGenerationDefaultValues,
  generationMode: PRODUCT_GENERATION_MODE.one,
  status: PRODUCT_STATUS.DRAFT,
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

        const statusError = validateProductStatus({ value: value.status });

        if (!templateErrors && !attributesError && !statusError) {
          return undefined;
        }

        return {
          fields: {
            ...templateErrors?.fields,
            attributes: attributesError,
            status: statusError,
          },
        };
      },
    },
    onSubmit: ({ value }) => {
      onProductVariantsGenerated({
        ...getProductVariantsGeneratedArgs({
          generationMode: value.generationMode,
          value,
        }),
        status: value.status,
      });
    },
  });

  return { form };
};

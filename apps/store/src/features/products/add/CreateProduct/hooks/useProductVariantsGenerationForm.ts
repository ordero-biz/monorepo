import { revalidateLogic, useForm } from '@tanstack/react-form';
import { createProductGenerationDefaultValues } from '../constants';
import type {
  ProductGenerationMode,
  ProductVariantsGeneratedArgs,
} from '../types';
import { getProductVariantsGeneratedArgs } from '../utils/productGeneration';
import { validateProductTemplate } from '../utils/validations';

type UseProductVariantsGenerationFormArgs = {
  generationMode: ProductGenerationMode;
  maxGeneratedProductVariants: number;
  onProductVariantsGenerated: (args: ProductVariantsGeneratedArgs) => void;
};

export const useProductVariantsGenerationForm = ({
  generationMode,
  maxGeneratedProductVariants,
  onProductVariantsGenerated,
}: UseProductVariantsGenerationFormArgs) => {
  const form = useForm({
    defaultValues: createProductGenerationDefaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) =>
        validateProductTemplate({
          generationMode,
          maxGeneratedProductVariants,
          value,
        }),
    },
    onSubmit: ({ value }) => {
      onProductVariantsGenerated(
        getProductVariantsGeneratedArgs({ generationMode, value })
      );
    },
  });

  return { form };
};

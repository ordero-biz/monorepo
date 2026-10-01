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
  onProductVariantsGenerated: (args: ProductVariantsGeneratedArgs) => void;
};

export const useProductVariantsGenerationForm = ({
  generationMode,
  onProductVariantsGenerated,
}: UseProductVariantsGenerationFormArgs) => {
  const form = useForm({
    defaultValues: createProductGenerationDefaultValues,
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ({ value }) =>
        validateProductTemplate({ generationMode, value }),
    },
    onSubmit: ({ value }) => {
      onProductVariantsGenerated(
        getProductVariantsGeneratedArgs({ generationMode, value })
      );
    },
  });

  return { form };
};

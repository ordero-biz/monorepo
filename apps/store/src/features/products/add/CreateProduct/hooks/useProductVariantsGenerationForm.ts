import { revalidateLogic, useForm } from '@tanstack/react-form';
import {
  createProductGenerationDefaultValues,
  PRODUCT_GENERATION_MODE,
} from '../constants';
import type {
  ProductGenerationMode,
  ProductVariantsGeneratedArgs,
} from '../types';
import {
  getGeneratedProductVariants,
  getGeneratedSingleProductVariant,
  getSelectedAttributeValues,
} from '../utils/productGeneration';
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
      if (generationMode === PRODUCT_GENERATION_MODE.many) {
        onProductVariantsGenerated({
          attributes: value.attributes,
          category: value.category,
          description: value.description,
          name: value.name,
          productVariants: getGeneratedProductVariants({
            attributeValuesByAttributeId: value.attributeValues,
            attributes: value.attributes,
            description: value.description,
            productName: value.name,
          }),
        });

        return;
      }

      const selectedAttributeValues = getSelectedAttributeValues(
        value.attributes,
        value.attributeValues
      );

      onProductVariantsGenerated({
        attributes: value.attributes,
        category: value.category,
        description: value.description,
        name: value.name,
        productVariants: [
          getGeneratedSingleProductVariant({
            attributeValues: selectedAttributeValues,
            description: value.description,
            productName: value.name,
          }),
        ],
      });
    },
  });

  return { form };
};

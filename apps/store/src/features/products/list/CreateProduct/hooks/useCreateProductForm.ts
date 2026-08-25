import { useToastManager } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { useRef } from 'react';
import { createProductDefaultValues } from '../constants';
import { submitCreateProduct } from '../utils/submitAction';
import { validateCreateProduct } from '../utils/validations';

type UseCreateProductFormArgs = {
  onCreated: () => Promise<void> | void;
};

export const useCreateProductForm = ({
  onCreated,
}: UseCreateProductFormArgs) => {
  const { add: addToast } = useToastManager();
  const hasClientSubmitErrorsRef = useRef(false);
  const form = useForm({
    defaultValues: createProductDefaultValues,
    validators: {
      onSubmit: validateCreateProduct,
    },
    listeners: {
      onChange: ({ formApi }) => {
        if (!hasClientSubmitErrorsRef.current) {
          return;
        }

        const validationResult = formApi.validate('submit');

        if (validationResult instanceof Promise) {
          void validationResult.then(() => {
            hasClientSubmitErrorsRef.current = !formApi.state.isValid;
          });
        } else {
          hasClientSubmitErrorsRef.current = !formApi.state.isValid;
        }
      },
    },
    onSubmitInvalid: ({ formApi }) => {
      hasClientSubmitErrorsRef.current = true;
      void formApi.validate('submit');
    },
    onSubmit: async ({ formApi, value }) => {
      hasClientSubmitErrorsRef.current = false;
      const result = await submitCreateProduct(value);

      if (!result.ok) {
        formApi.setErrorMap({
          onSubmit: {
            fields: result.error.fieldErrors,
          },
        });

        if (result.error.formError) {
          addToast({
            description: result.error.formError,
            type: 'error',
          });
        }

        return;
      }

      addToast({
        description: `Product ${result.data.name} was created`,
        type: 'success',
      });

      formApi.reset();
      await onCreated();
    },
  });

  return {
    form,
  };
};

import { useCreateProductForm as useBaseCreateProductForm } from '../../../add/CreateProduct';

export const useCreateProductForm = (
  args: Parameters<typeof useBaseCreateProductForm>[0]
) => {
  const { form } = useBaseCreateProductForm(args);

  const submitProductForm = async () => {
    if (form.state.isSubmitting || form.state.isValidating) {
      return;
    }
    // Dialog Apply defers validation. Refresh errors before handleSubmit's
    // validity guard; handleSubmit validates again when the form is valid.
    await form.validate('submit');
    await form.handleSubmit();
  };

  return { form, submitProductForm };
};

import { useStore } from '@tanstack/react-form';
import { EditProductVariantAttributesDialog } from '../../add/CreateProduct/EditProductVariantAttributesDialog';
import type { ProductVariantAttributesUpdate } from '../../add/CreateProduct/types';
import type { EditGeneratedProductVariantAttributesProps } from './types';

export const EditGeneratedProductVariantAttributes = ({
  allowMultipleValuesPerAttribute,
  onAttributesUpdated,
  attributes,
  productVariantsCreationForm,
  onOpenChange,
  variantIndex,
}: EditGeneratedProductVariantAttributesProps) => {
  // Read parent values without registering another instance of its fields.
  const productVariant = useStore(
    productVariantsCreationForm.store,
    (state) => state.values.productVariants[variantIndex]
  );
  const applyAttributes = ({
    attributeValueIds: nextAttributeValueIds,
    attributes: updatedAttributes,
  }: ProductVariantAttributesUpdate) => {
    onAttributesUpdated(variantIndex, updatedAttributes);
    // Applying a dialog draft must not trigger form validation.
    productVariantsCreationForm.setFieldValue(
      `productVariants[${variantIndex}].attributeValueIds`,
      nextAttributeValueIds,
      { dontValidate: true }
    );
  };

  return (
    <EditProductVariantAttributesDialog
      allowMultipleValuesPerAttribute={allowMultipleValuesPerAttribute}
      attributes={attributes}
      attributeValueIds={productVariant?.attributeValueIds ?? []}
      onOpenChange={onOpenChange}
      onUpdate={applyAttributes}
      open
      productVariantName={productVariant?.name ?? ''}
    />
  );
};

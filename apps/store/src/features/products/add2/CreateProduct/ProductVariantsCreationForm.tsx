import { Button, ContextualActionBar, Typography } from '@ordero/ui';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import type { ProductVariantsCreationFormProps } from './types';

export const ProductVariantsCreationForm = ({
  onSubmit,
  commonProductFields,
  variantFields,
  isEditingProductDetails = false,
  productVariantsCreationForm,
}: ProductVariantsCreationFormProps) => {
  const handleSubmit = () => {
    if (!isEditingProductDetails) {
      onSubmit();
    }
  };

  return (
    <form
      aria-label="Product configuration"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      {commonProductFields}
      {variantFields}
      <productVariantsCreationForm.Subscribe
        selector={(state) => state.values.productVariants.length}
      >
        {(productVariantCount) =>
          productVariantCount > 0 ? (
            <>
              <div aria-hidden="true" className="h-[var(--space-12)]" />
              <BaseLayoutContextualActionBar>
                <ContextualActionBar.Root ariaLabel="Product creation actions">
                  <ContextualActionBar.Left>
                    <Typography variant="body2">
                      {productVariantCount === 1
                        ? 'You’re creating 1 product with 1 variant'
                        : `You’re creating 1 product with ${productVariantCount} variants`}
                    </Typography>
                  </ContextualActionBar.Left>
                  <ContextualActionBar.Right>
                    <productVariantsCreationForm.Subscribe
                      selector={(state) => state.isSubmitting}
                    >
                      {(isSubmitting) => (
                        <Button
                          color="primary"
                          disabled={isSubmitting || isEditingProductDetails}
                          onClick={handleSubmit}
                          size="m"
                          type="button"
                        >
                          {isSubmitting
                            ? 'Creating product...'
                            : 'Create product'}
                        </Button>
                      )}
                    </productVariantsCreationForm.Subscribe>
                  </ContextualActionBar.Right>
                </ContextualActionBar.Root>
              </BaseLayoutContextualActionBar>
            </>
          ) : null
        }
      </productVariantsCreationForm.Subscribe>
    </form>
  );
};

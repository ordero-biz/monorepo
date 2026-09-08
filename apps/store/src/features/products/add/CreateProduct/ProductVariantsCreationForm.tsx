import { Button, ContextualActionBar, Typography } from '@ordero/ui';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { CommonProductFields } from './CommonProductFields';
import { GeneratedProductVariants } from './GeneratedProductVariants';
import type { ProductVariantsCreationFormProps } from './types';

export const ProductVariantsCreationForm = ({
  productVariantsCreationForm,
  generatedAttributes,
  generationMode,
}: ProductVariantsCreationFormProps) => {
  const handleSubmit = () => {
    productVariantsCreationForm.handleSubmit();
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
      <CommonProductFields
        productVariantsCreationForm={productVariantsCreationForm}
      />
      <GeneratedProductVariants
        productVariantsCreationForm={productVariantsCreationForm}
        generatedAttributes={generatedAttributes}
        generationMode={generationMode}
      />
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
                        ? '1 product variant ready'
                        : `${productVariantCount} product variants ready`}
                    </Typography>
                  </ContextualActionBar.Left>
                  <ContextualActionBar.Right>
                    <productVariantsCreationForm.Subscribe
                      selector={(state) => state.isSubmitting}
                    >
                      {(isSubmitting) => (
                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          onClick={handleSubmit}
                          size="l"
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

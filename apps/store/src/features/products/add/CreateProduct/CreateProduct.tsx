'use client';

import {
  Accordion,
  Button,
  ContextualActionBar,
  PageHeader,
  Typography,
} from '@ordero/ui';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { GeneratedProductVariants } from './GeneratedProductVariants';
import { GenerateProductActions } from './GenerateProductActions';
import { ProductAttributeValuesField } from './ProductAttributeValuesField';
import type { CreateProductProps } from './types';

export const CreateProduct = ({
  generationMode,
  form,
  generation,
  onSubmit,
  TemplateFields,
}: CreateProductProps) => {
  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <PageHeader.Root>
        <PageHeader.Left>
          <Typography variant="h5">Create product</Typography>
        </PageHeader.Left>
        <PageHeader.Right></PageHeader.Right>
      </PageHeader.Root>

      <Accordion.Root
        aria-label="Product template"
        defaultValue={['product-template']}
      >
        <Accordion.Item value="product-template">
          <Accordion.Header>
            <Accordion.Trigger>Product template</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>
            <div className="flex flex-col gap-[var(--space-2)]">
              <TemplateFields form={form} />

              <ProductAttributeValuesField form={form} />

              <GenerateProductActions
                form={form}
                generatedTemplateSignature={
                  generation.generatedTemplateSignature
                }
                generationMode={generationMode}
                onProductVariantsGenerated={
                  generation.onProductVariantsGenerated
                }
              />
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <GeneratedProductVariants
        form={form}
        generatedAttributes={generation.generatedAttributes}
        generationMode={generationMode}
        generationVersion={generation.generationVersion}
      />
      <form.Subscribe selector={(state) => state.values.productVariants.length}>
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
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                      {(isSubmitting) => (
                        <Button
                          color="primary"
                          disabled={isSubmitting}
                          size="l"
                          onClick={onSubmit}
                          type="button"
                        >
                          {isSubmitting
                            ? 'Creating product...'
                            : 'Create product'}
                        </Button>
                      )}
                    </form.Subscribe>
                  </ContextualActionBar.Right>
                </ContextualActionBar.Root>
              </BaseLayoutContextualActionBar>
            </>
          ) : null
        }
      </form.Subscribe>
    </form>
  );
};

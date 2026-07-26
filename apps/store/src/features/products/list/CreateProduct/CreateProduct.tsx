'use client';

import { Accordion, Button, ContextualActionBar, Typography } from '@ordero/ui';
import { useState } from 'react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { CreateProductTemplateFields } from './CreateProductTemplateFields';
import { PRODUCT_GENERATION_MODE } from './constants';
import { GeneratedProductVariants } from './GeneratedProductVariants';
import { GenerateProductActions } from './GenerateProductActions';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import { ProductAttributeValuesField } from './ProductAttributeValuesField';
import type { ProductGenerationMode } from './types';

export const CreateProduct = () => {
  const [generationMode, setGenerationMode] = useState<ProductGenerationMode>(
    PRODUCT_GENERATION_MODE.one
  );
  const { form } = useCreateProductForm({
    onCreated: () => undefined,
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();

        if (form.state.values.productVariants.length > 0) {
          form.handleSubmit();
        }
      }}
    >
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
              <CreateProductTemplateFields
                form={form}
                generationMode={generationMode}
                onGenerationModeChange={setGenerationMode}
              />

              <ProductAttributeValuesField form={form} />

              <GenerateProductActions
                form={form}
                generationMode={generationMode}
              />
            </div>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>

      <GeneratedProductVariants form={form} />
      <form.Subscribe
        selector={(state) =>
          [
            state.values.productVariants,
            state.isSubmitting,
            state.canSubmit,
          ] as const
        }
      >
        {([productVariants, isSubmitting, canSubmit]) =>
          productVariants.length > 0 ? (
            <>
              <div aria-hidden="true" className="h-[var(--space-12)]" />
              <BaseLayoutContextualActionBar>
                <ContextualActionBar.Root ariaLabel="Product creation actions">
                  <ContextualActionBar.Left>
                    <Typography variant="body2">
                      {productVariants.length === 1
                        ? '1 product variant ready'
                        : `${productVariants.length} product variants ready`}
                    </Typography>
                  </ContextualActionBar.Left>
                  <ContextualActionBar.Right>
                    <Button
                      color="primary"
                      disabled={isSubmitting || !canSubmit}
                      size="l"
                      type="submit"
                    >
                      {isSubmitting ? 'Creating product...' : 'Create product'}
                    </Button>
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

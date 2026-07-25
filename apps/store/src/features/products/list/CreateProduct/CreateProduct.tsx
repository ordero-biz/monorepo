'use client';

import { Accordion, Button, Card } from '@ordero/ui';
import { useState } from 'react';
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
            <div className="flex justify-end">
              <Button
                color="primary"
                disabled={isSubmitting || !canSubmit}
                size="l"
                type="submit"
              >
                {isSubmitting ? 'Creating product...' : 'Create product'}
              </Button>
            </div>
          ) : null
        }
      </form.Subscribe>
    </form>
  );
};

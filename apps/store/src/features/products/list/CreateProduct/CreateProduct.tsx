'use client';

import { Button, Card, Typography } from '@ordero/ui';
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
      <Card.Root>
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-4)]">
            <Typography variant="h4">Create product template</Typography>

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
        </Card.Content>
      </Card.Root>

      <GeneratedProductVariants form={form} generationMode={generationMode} />
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

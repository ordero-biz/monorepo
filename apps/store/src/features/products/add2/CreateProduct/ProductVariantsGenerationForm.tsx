'use client';

import { Button, Card, ContextualActionBar, Typography } from '@ordero/ui';
import { ArrowRight } from 'lucide-react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import { ProductAttributeValuesField } from './ProductAttributeValuesField';
import { ProductGenerationModeSelector } from './ProductGenerationModeSelector';
import { ProductTemplateFields } from './ProductTemplateFields';
import type { ProductVariantsGenerationFormProps } from './types';

export const ProductVariantsGenerationForm = ({
  generationMode,
  onGenerationModeChange,
  productVariantsGenerationForm,
}: ProductVariantsGenerationFormProps) => (
  <form
    aria-label="Product generation"
    className="flex flex-col gap-[var(--space-3)]"
    noValidate
    onSubmit={(event) => {
      event.preventDefault();
      productVariantsGenerationForm.handleSubmit();
    }}
  >
    <div className="grid grid-cols-1 gap-[var(--space-2)] lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-[var(--space-2)]">
        <section aria-labelledby="common-product-data-title">
          <Card.Root variant="outlined">
            <Card.Header>
              <div>
                <Card.Title id="common-product-data-title">
                  Shared product details
                </Card.Title>
                <Card.Description>
                  Name, category, description, and photos are shared across all
                  variants.
                </Card.Description>
              </div>
            </Card.Header>
            <Card.Content>
              <ProductTemplateFields
                productVariantsGenerationForm={productVariantsGenerationForm}
              />
            </Card.Content>
          </Card.Root>
        </section>

        <section aria-labelledby="product-variants-title">
          <Card.Root variant="outlined">
            <Card.Header>
              <Card.Title id="product-variants-title">
                How should variants be created?
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-[var(--space-3)]">
                <ProductGenerationModeSelector
                  generationMode={generationMode}
                  onGenerationModeChange={onGenerationModeChange}
                />
                <ProductAttributeValuesField
                  generationMode={generationMode}
                  productVariantsGenerationForm={productVariantsGenerationForm}
                />
              </div>
            </Card.Content>
          </Card.Root>
        </section>
      </div>

      <aside aria-labelledby="product-structure-title" className="grid min-w-0">
        <Card.Root variant="outlined">
          <Card.Header>
            <Card.Title id="product-structure-title">
              Product structure preview
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="min-h-[calc(var(--space-20)*3)]" />
          </Card.Content>
        </Card.Root>
      </aside>
    </div>
    <div aria-hidden="true" className="h-[var(--space-12)]" />
    <BaseLayoutContextualActionBar>
      <ContextualActionBar.Root ariaLabel="Product generation actions">
        <ContextualActionBar.Left>
          <Typography variant="body2">Nothing has been created yet.</Typography>
        </ContextualActionBar.Left>
        <ContextualActionBar.Right>
          <productVariantsGenerationForm.Subscribe
            selector={(state) => state.isSubmitting}
          >
            {(isSubmitting) => (
              <Button
                color="primary"
                disabled={isSubmitting}
                endIcon={<ArrowRight aria-hidden="true" />}
                size="m"
                type="submit"
              >
                Continue to variants
              </Button>
            )}
          </productVariantsGenerationForm.Subscribe>
        </ContextualActionBar.Right>
      </ContextualActionBar.Root>
    </BaseLayoutContextualActionBar>
  </form>
);

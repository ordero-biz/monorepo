'use client';

import { Button, Card, ContextualActionBar, Typography } from '@ordero/ui';
import { ArrowRight } from 'lucide-react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import {
  DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS,
  PRODUCT_GENERATION_MODE,
} from '../../add/CreateProduct';
import { ProductAttributeValuesField } from './ProductAttributeValuesField';
import { ProductGenerationModeSelector } from './ProductGenerationModeSelector';
import { ProductTemplateFields } from './ProductTemplateFields';
import { ProductVariantSummary } from './ProductVariantSummary';
import type { ProductVariantsGenerationFormProps } from './types';
import { getVariantCount } from './utils/getVariantCount';

export const ProductVariantsGenerationForm = ({
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
          <Card.Root variant="filled">
            <Card.Header>
              <div>
                <Card.Title id="common-product-data-title">
                  Shared product details
                </Card.Title>
                <Card.Description>
                  Name, category, description, and photos are shared across all
                  variants
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
          <Card.Root variant="filled">
            <Card.Header>
              <div>
                <Card.Title id="product-variants-title">
                  Variant setup
                </Card.Title>
                <Card.Description>
                  Choose a mode, then select attributes and values
                </Card.Description>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="flex flex-col gap-[var(--space-3)]">
                <productVariantsGenerationForm.Field name="generationMode">
                  {(field) => (
                    <ProductGenerationModeSelector
                      generationMode={field.state.value}
                      onGenerationModeChange={field.handleChange}
                    />
                  )}
                </productVariantsGenerationForm.Field>
                <ProductAttributeValuesField
                  productVariantsGenerationForm={productVariantsGenerationForm}
                />
              </div>
            </Card.Content>
          </Card.Root>
        </section>
      </div>

      <productVariantsGenerationForm.Subscribe
        selector={(state) =>
          [
            state.values.attributes,
            state.values.attributeValues,
            state.values.generationMode,
          ] as const
        }
      >
        {([attributes, attributeValues, generationMode]) => (
          <ProductVariantSummary
            hasAttributes={attributes.length > 0}
            showSingleVariantExplanation={
              generationMode === PRODUCT_GENERATION_MODE.one &&
              attributes.some(
                (attribute) =>
                  (attributeValues[String(attribute.id)]?.length ?? 0) > 1
              )
            }
            variantCount={getVariantCount({
              attributes,
              attributeValues,
              generationMode,
            })}
          />
        )}
      </productVariantsGenerationForm.Subscribe>
    </div>
    <div aria-hidden="true" className="h-[var(--space-12)]" />
    <BaseLayoutContextualActionBar>
      <ContextualActionBar.Root ariaLabel="Product generation actions">
        <ContextualActionBar.Left>
          <Typography variant="body2">
            You’ll review variants before creating the product
          </Typography>
        </ContextualActionBar.Left>
        <ContextualActionBar.Right>
          <productVariantsGenerationForm.Subscribe
            selector={(state) =>
              [
                state.isSubmitting,
                state.values.attributes,
                state.values.attributeValues,
                state.values.generationMode,
              ] as const
            }
          >
            {([isSubmitting, attributes, attributeValues, generationMode]) => (
              <Button
                color="primary"
                disabled={
                  isSubmitting ||
                  getVariantCount({
                    attributes,
                    attributeValues,
                    generationMode,
                  }) > DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS
                }
                endIcon={<ArrowRight aria-hidden="true" />}
                size="m"
                type="submit"
              >
                Review variants
              </Button>
            )}
          </productVariantsGenerationForm.Subscribe>
        </ContextualActionBar.Right>
      </ContextualActionBar.Root>
    </BaseLayoutContextualActionBar>
  </form>
);

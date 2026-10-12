import { Card } from '@ordero/ui';
import { GenerateProductActions } from './GenerateProductActions';
import { ProductAttributeValuesField } from './ProductAttributeValuesField';
import { ProductTemplateFields } from './ProductTemplateFields';
import type { ProductVariantsGenerationFormProps } from './types';

export const ProductVariantsGenerationForm = ({
  productVariantsGenerationForm,
  generationMode,
  maxGeneratedProductVariants,
}: ProductVariantsGenerationFormProps) => (
  <Card.Root variant="filled">
    <Card.Content>
      <form
        aria-label="Product generation"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          productVariantsGenerationForm.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-[var(--space-2)]">
          <ProductTemplateFields
            productVariantsGenerationForm={productVariantsGenerationForm}
            generationMode={generationMode}
          />

          <ProductAttributeValuesField
            productVariantsGenerationForm={productVariantsGenerationForm}
          />

          <GenerateProductActions
            productVariantsGenerationForm={productVariantsGenerationForm}
            generationMode={generationMode}
            maxGeneratedProductVariants={maxGeneratedProductVariants}
          />
        </div>
      </form>
    </Card.Content>
  </Card.Root>
);

import { GeneratedProductVariantCard } from './GeneratedProductVariantCard';
import type { GeneratedProductVariantsProps } from './types';

export const GeneratedProductVariants = ({
  availableAttributes,
  form,
}: GeneratedProductVariantsProps) => (
  <form.Subscribe
    selector={(state) =>
      [state.values.attributes, state.values.productVariants] as const
    }
  >
    {([attributes, productVariants]) =>
      productVariants.length > 0 ? (
        <div className="mt-3 mb-2 flex flex-col gap-[var(--space-1)]">
          {productVariants.map((productVariant, variantIndex) => (
            <GeneratedProductVariantCard
              attributes={attributes}
              availableAttributes={availableAttributes}
              form={form}
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={variantIndex}
              productVariant={productVariant}
              variantIndex={variantIndex}
            />
          ))}
        </div>
      ) : null
    }
  </form.Subscribe>
);

import { Card, Typography } from '@ordero/ui';
import { Barcode, Eye, SlidersHorizontal } from 'lucide-react';
import { DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS } from '../../add/CreateProduct';
import type { ProductVariantSummaryProps } from './types';

const nextStepTasks = [
  { Icon: Eye, label: 'Review generated variants' },
  { Icon: Barcode, label: 'Add SKUs and barcodes' },
  { Icon: SlidersHorizontal, label: 'Set variant statuses' },
] as const;

export const ProductVariantSummary = ({
  hasAttributes,
  showSingleVariantExplanation = false,
  variantCount,
}: ProductVariantSummaryProps) => {
  const exceedsLimit = variantCount > DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS;
  const emptyGuidance = hasAttributes
    ? 'Select attribute values to generate variants'
    : 'Add an attribute and select its values to generate variants';

  return (
    <aside
      aria-labelledby="variant-summary-title"
      className="min-w-0 self-start lg:sticky lg:top-[calc(var(--space-9)+var(--space-2))]"
    >
      <Card.Root variant="filled">
        <div className="lg:max-h-[calc(100dvh-var(--space-9)-var(--space-2)-var(--space-16))] lg:overflow-y-auto">
          <Card.Header>
            <Card.Title id="variant-summary-title">Variant summary</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-[var(--space-3)]">
              <div className="flex flex-col gap-[var(--space-1)]">
                <div aria-atomic="true" aria-live="polite">
                  <p className="text-[length:var(--h3-size-desktop)] leading-[var(--h3-line-height-desktop)] font-[var(--h3-weight)] [font-family:var(--h3-family)]">
                    {exceedsLimit
                      ? `More than ${DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS} variants`
                      : `${variantCount} ${variantCount === 1 ? 'variant' : 'variants'}`}
                  </p>
                  <Typography
                    color={exceedsLimit ? 'error' : 'text-secondary'}
                    variant="body2"
                  >
                    {exceedsLimit
                      ? `Select fewer values. You can create up to ${DEFAULT_MAX_GENERATED_PRODUCT_VARIANTS} variants.`
                      : variantCount === 0
                        ? emptyGuidance
                        : 'will be generated when you continue'}
                  </Typography>
                  {showSingleVariantExplanation ? (
                    <Typography color="text-secondary" variant="body2">
                      Your selected values will stay together in one variant
                    </Typography>
                  ) : null}
                </div>
                <Typography color="text-secondary" variant="body2">
                  All variants belong to one product
                </Typography>
              </div>

              <Card.Divider variant="solid" />

              <section
                aria-labelledby="variant-next-step-title"
                className="flex flex-col gap-[var(--space-2)]"
              >
                <h4 className="font-semibold" id="variant-next-step-title">
                  On the next step
                </h4>
                <ul className="flex flex-col gap-[var(--space-2)]">
                  {nextStepTasks.map(({ Icon, label }) => (
                    <li
                      className="flex items-center gap-[var(--space-1-5)]"
                      key={label}
                    >
                      <Icon
                        aria-hidden="true"
                        className="size-[var(--space-2-5)] shrink-0 text-muted-foreground"
                      />
                      <Typography color="text-secondary" variant="body2">
                        {label}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </Card.Content>
        </div>
      </Card.Root>
    </aside>
  );
};

import { Radio, RadioGroup } from '@ordero/ui';
import { PRODUCT_GENERATION_MODE } from '../../add/CreateProduct';
import type { ProductGenerationModeSelectorProps } from './types';

const options = [
  {
    value: PRODUCT_GENERATION_MODE.one,
    label: 'Single variant',
    description: 'All selected values describe one item.',
  },
  {
    value: PRODUCT_GENERATION_MODE.many,
    label: 'Value combinations',
    description: 'Each combination becomes a separate variant.',
  },
] as const;

export const ProductGenerationModeSelector = ({
  generationMode,
  onGenerationModeChange,
}: ProductGenerationModeSelectorProps) => (
  <RadioGroup
    aria-labelledby="product-variants-title"
    name="generationMode"
    onValueChange={(value) => {
      if (
        value === PRODUCT_GENERATION_MODE.one ||
        value === PRODUCT_GENERATION_MODE.many
      ) {
        onGenerationModeChange(value);
      }
    }}
    value={generationMode}
  >
    <div className="grid grid-cols-1 gap-[var(--space-2)] md:grid-cols-2">
      {options.map((option) => (
        <div
          className={`rounded-[var(--radius)] border p-[var(--space-1-5)] transition-colors [&>label]:w-full [&>label]:max-w-none ${
            generationMode === option.value
              ? 'border-primary bg-[var(--color-primary-8)]'
              : 'border-border bg-card'
          }`}
          key={option.value}
        >
          <Radio
            aria-describedby={`generation-mode-${option.value}-description`}
            aria-label={option.label}
            color="primary"
            value={option.value}
          >
            <span className="flex flex-col">
              <span className="font-semibold">{option.label}</span>
              <span
                aria-hidden="true"
                className="text-muted-foreground"
                id={`generation-mode-${option.value}-description`}
              >
                {option.description}
              </span>
            </span>
          </Radio>
        </div>
      ))}
    </div>
  </RadioGroup>
);

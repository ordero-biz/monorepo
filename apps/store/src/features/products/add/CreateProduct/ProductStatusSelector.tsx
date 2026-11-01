import { Radio, RadioGroup, Typography } from '@ordero/ui';
import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import type { ProductStatusSelectorProps } from './types';

export const ProductStatusSelector = ({
  errorText,
  invalid = false,
  label,
  name,
  onValueChange,
  value,
}: ProductStatusSelectorProps) => (
  <RadioGroup
    errorText={errorText}
    invalid={invalid}
    label={label}
    name={name}
    onValueChange={(nextStatus) => onValueChange(nextStatus as typeof value)}
    orientation="vertical"
    required
    value={value}
  >
    <Radio align="start" value={PRODUCT_STATUS.DRAFT}>
      <div className="flex flex-col">
        Draft
        <Typography color="text-secondary" variant="caption">
          Editable only. Can be activated later
        </Typography>
      </div>
    </Radio>
    <Radio align="start" value={PRODUCT_STATUS.ACTIVE}>
      <div className="flex flex-col">
        Active
        <Typography color="text-secondary" variant="caption">
          Fully functional and available for sale
        </Typography>
      </div>
    </Radio>
  </RadioGroup>
);

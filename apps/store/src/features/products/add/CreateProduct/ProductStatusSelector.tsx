import { Radio, RadioGroup, Typography } from '@ordero/ui';
import { PRODUCT_STATUS } from '@/lib/domain/products/constants';
import type { ProductStatusSelectorProps } from './types';

export const ProductStatusSelector = ({
  draftDescription = 'Save for further editing. Cannot be supplied or sold. Can be activated later',
  activeDescription = 'Can be supplied and sold',
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
    <Radio
      align="start"
      tabIndex={value === PRODUCT_STATUS.DRAFT ? 0 : -1}
      value={PRODUCT_STATUS.DRAFT}
    >
      <div className="flex flex-col">
        Draft
        <Typography color="text-secondary" variant="caption">
          {draftDescription}
        </Typography>
      </div>
    </Radio>
    <Radio
      align="start"
      tabIndex={value === PRODUCT_STATUS.ACTIVE ? 0 : -1}
      value={PRODUCT_STATUS.ACTIVE}
    >
      <div className="flex flex-col">
        Active
        <Typography color="text-secondary" variant="caption">
          {activeDescription}
        </Typography>
      </div>
    </Radio>
  </RadioGroup>
);

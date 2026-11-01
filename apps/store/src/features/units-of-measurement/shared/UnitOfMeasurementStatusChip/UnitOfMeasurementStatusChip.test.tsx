import { screen } from '@testing-library/react';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import type { UnitOfMeasurementStatus } from '@/lib/domain/units-of-measurement/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UnitOfMeasurementStatusChip } from './UnitOfMeasurementStatusChip';

const { setup } = prepareStoreSetup({
  component: UnitOfMeasurementStatusChip,
  props: {
    status: UNIT_OF_MEASUREMENT_STATUS.DRAFT as UnitOfMeasurementStatus,
  },
});

describe('UnitOfMeasurementStatusChip', () => {
  it.each([
    [UNIT_OF_MEASUREMENT_STATUS.ACTIVE, 'Active'],
    [UNIT_OF_MEASUREMENT_STATUS.DRAFT, 'Draft'],
  ])('renders the %s status label', (status, label) => {
    setup({ status });

    expect(screen.getByText(label)).toBeVisible();
  });
});

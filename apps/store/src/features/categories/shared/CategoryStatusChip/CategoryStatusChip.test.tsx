import { screen } from '@testing-library/react';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { CategoryStatus } from '@/lib/domain/categories/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryStatusChip } from './CategoryStatusChip';

const { setup } = prepareStoreSetup({
  component: CategoryStatusChip,
  props: {
    status: CATEGORY_STATUS.DRAFT as CategoryStatus,
  },
});

describe('CategoryStatusChip', () => {
  it.each([
    [CATEGORY_STATUS.ACTIVE, 'Active'],
    [CATEGORY_STATUS.DRAFT, 'Draft'],
  ])('renders the %s status label', (status, label) => {
    setup({ status });

    expect(screen.getByText(label)).toBeVisible();
  });

  it('renders nothing when a category has no status', () => {
    setup({ status: undefined });

    expect(screen.queryByText('Active')).not.toBeInTheDocument();
    expect(screen.queryByText('Draft')).not.toBeInTheDocument();
  });
});

import { screen } from '@testing-library/react';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import type { AttributeStatus } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributeStatusChip } from './AttributeStatusChip';

const { setup } = prepareStoreSetup({
  component: AttributeStatusChip,
  props: {
    status: ATTRIBUTE_STATUS.DRAFT as AttributeStatus,
  },
});

describe('AttributeStatusChip', () => {
  it.each([
    [ATTRIBUTE_STATUS.ACTIVE, 'Active'],
    [ATTRIBUTE_STATUS.DRAFT, 'Draft'],
  ])('renders the %s status label', (status, label) => {
    setup({ status });

    expect(screen.getByText(label)).toBeVisible();
  });

  it('renders nothing when an attribute has no status', () => {
    setup({ status: undefined });

    expect(screen.queryByText('Active')).not.toBeInTheDocument();
    expect(screen.queryByText('Draft')).not.toBeInTheDocument();
  });
});

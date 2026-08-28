import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateWarehouseDialogTrigger } from './ActivateWarehouseDialogTrigger';

const { setup } = prepareStoreSetup({
  component: ActivateWarehouseDialogTrigger,
  props: {
    onUpdated: vi.fn(),
    warehouse: {
      id: 1,
      name: 'Main Warehouse',
      status: WAREHOUSE_STATUS.DRAFT,
      address: '123 Commerce Ave',
      comment: 'Primary stock location',
    },
  },
});

describe('ActivateWarehouseDialogTrigger', () => {
  it('opens a confirmation dialog before publishing', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish warehouse' })
    ).toBeVisible();
  });
});

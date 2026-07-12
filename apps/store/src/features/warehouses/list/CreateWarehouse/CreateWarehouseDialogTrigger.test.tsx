import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateWarehouseDialogTrigger } from './CreateWarehouseDialogTrigger';

const { setup } = prepareStoreSetup({
  component: CreateWarehouseDialogTrigger,
});

describe('CreateWarehouseDialogTrigger', () => {
  it('opens the add warehouse dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Warehouse' }));

    expect(screen.getByRole('dialog', { name: 'Add warehouse' })).toBeVisible();
  });
});

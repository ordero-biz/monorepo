import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateSupplierDialogTrigger } from './CreateSupplierDialogTrigger';

const { setup } = prepareStoreSetup({
  component: CreateSupplierDialogTrigger,
});

describe('CreateSupplierDialogTrigger', () => {
  it('opens the add supplier dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Add Supplier' }));

    expect(screen.getByRole('dialog', { name: 'Add supplier' })).toBeVisible();
  });
});

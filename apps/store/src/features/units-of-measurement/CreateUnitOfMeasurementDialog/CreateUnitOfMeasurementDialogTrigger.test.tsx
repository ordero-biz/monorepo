import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateUnitOfMeasurementDialogTrigger } from './CreateUnitOfMeasurementDialogTrigger';

const { setup } = prepareStoreSetup({
  component: CreateUnitOfMeasurementDialogTrigger,
});

describe('CreateUnitOfMeasurementDialogTrigger', () => {
  it('opens the add unit of measurement dialog', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Add Unit of Measurement' })
    );

    expect(
      screen.getByRole('dialog', { name: 'Add unit of measurement' })
    ).toBeVisible();
  });
});

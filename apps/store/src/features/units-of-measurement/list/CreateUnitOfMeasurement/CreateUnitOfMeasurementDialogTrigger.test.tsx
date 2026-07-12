import { screen, within } from '@testing-library/react';
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

  it('resets unsaved fields when the dialog is closed and reopened', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Add Unit of Measurement' })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Add unit of measurement',
    });
    const codeField = within(dialog).getByRole('textbox', { name: 'Code' });

    await user.type(codeField, 'KG');
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Add unit of measurement' })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Add Unit of Measurement' })
    );

    expect(
      within(
        screen.getByRole('dialog', { name: 'Add unit of measurement' })
      ).getByRole('textbox', { name: 'Code' })
    ).toHaveValue('');
  });
});

import { Dialog } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { WarehouseFormDialogContent } from './WarehouseFormDialogContent';
import type { WarehouseFormValues } from '../validations';

type WarehouseFormDialogContentTestFixtureProps = {
  onSubmit?: () => Promise<void> | void;
  pendingText?: string;
  submitText?: string;
};

const defaultValues: WarehouseFormValues = {
  code: '',
  name: '',
  address: '',
  comment: '',
};

const WarehouseFormDialogContentTestFixture = ({
  onSubmit,
  pendingText = 'Adding...',
  submitText = 'Add',
}: WarehouseFormDialogContentTestFixtureProps) => {
  const form = useForm({
    defaultValues,
    onSubmit: async () => {
      await onSubmit?.();
    },
  });

  return (
    <Dialog.Root defaultOpen>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup size="xs">
            <Dialog.Header>
              <Dialog.Title>Warehouse form</Dialog.Title>
            </Dialog.Header>
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <WarehouseFormDialogContent
                form={form}
                pendingText={pendingText}
                submitText={submitText}
              />
            </form>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const { setup } = prepareStoreSetup({
  component: WarehouseFormDialogContentTestFixture,
  props: {},
});

describe('WarehouseFormDialogContent', () => {
  it('renders every warehouse field and prevents submission until required values are present', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Warehouse form' });

    expect(within(dialog).getByRole('textbox', { name: 'Code' })).toHaveValue(
      ''
    );
    expect(within(dialog).getByRole('textbox', { name: 'Name' })).toHaveValue(
      ''
    );
    expect(
      within(dialog).getByRole('textbox', { name: 'Address' })
    ).toHaveValue('');
    expect(
      within(dialog).getByRole('textbox', { name: 'Comment' })
    ).toHaveValue('');
    expect(within(dialog).getByRole('button', { name: 'Add' })).toBeDisabled();
  });

  it('reveals client validation after blur and clears it as the field is corrected', async () => {
    const user = userEvent.setup();

    setup();

    const dialog = screen.getByRole('dialog', { name: 'Warehouse form' });
    const codeField = within(dialog).getByRole('textbox', { name: 'Code' });

    await user.type(codeField, ' ');

    expect(
      within(dialog).queryByText('Warehouse code is required')
    ).not.toBeInTheDocument();

    await user.tab();

    expect(
      within(dialog).getByText('Warehouse code is required')
    ).toBeVisible();

    await user.clear(codeField);
    await user.type(codeField, 'WH-001');

    await waitFor(() =>
      expect(
        within(dialog).queryByText('Warehouse code is required')
      ).not.toBeInTheDocument()
    );
  });

  it('disables the submit button and displays pending text while submission is in progress', async () => {
    let resolveSubmit: (() => void) | undefined;
    const user = userEvent.setup();
    const { onSubmit } = setup({
      onSubmit: vi.fn(
        () =>
          new Promise<void>((resolve) => {
            resolveSubmit = resolve;
          })
      ),
    });

    const dialog = screen.getByRole('dialog', { name: 'Warehouse form' });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Code' }),
      'WH-001'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Main Warehouse'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Address' }),
      '123 Commerce Ave'
    );
    await user.click(within(dialog).getByRole('button', { name: 'Add' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    expect(
      within(dialog).getByRole('button', { name: 'Adding...' })
    ).toBeDisabled();

    resolveSubmit?.();

    await within(dialog).findByRole('button', { name: 'Add' });
  });
});

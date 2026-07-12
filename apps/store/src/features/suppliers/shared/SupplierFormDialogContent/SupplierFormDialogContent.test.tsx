import { Dialog } from '@ordero/ui';
import { useForm } from '@tanstack/react-form';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierFormDialogContent } from './SupplierFormDialogContent';
import type { SupplierEntityFormValues } from './validations';

type SupplierFormDialogContentTestFixtureProps = {
  onSubmit?: () => Promise<void> | void;
  pendingText?: string;
  submitText?: string;
};

const defaultValues: SupplierEntityFormValues = {
  name: '',
  email: '',
  phone: '',
  address: '',
  comment: '',
};

const SupplierFormDialogContentTestFixture = ({
  onSubmit,
  pendingText = 'Adding...',
  submitText = 'Add',
}: SupplierFormDialogContentTestFixtureProps) => {
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
              <Dialog.Title>Supplier form</Dialog.Title>
            </Dialog.Header>
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
              }}
            >
              <SupplierFormDialogContent
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
  component: SupplierFormDialogContentTestFixture,
  props: {},
});

describe('SupplierFormDialogContent', () => {
  it('renders every supplier field and prevents submission until required values are present', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Supplier form' });

    expect(within(dialog).getByRole('textbox', { name: 'Name' })).toHaveValue(
      ''
    );
    expect(within(dialog).getByRole('textbox', { name: 'Email' })).toHaveValue(
      ''
    );
    expect(within(dialog).getByRole('textbox', { name: 'Phone' })).toHaveValue(
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

    const dialog = screen.getByRole('dialog', { name: 'Supplier form' });
    const emailField = within(dialog).getByRole('textbox', { name: 'Email' });

    await user.type(emailField, 'not-an-email');

    expect(
      within(dialog).queryByText('Enter a valid supplier email')
    ).not.toBeInTheDocument();

    await user.tab();

    expect(
      within(dialog).getByText('Enter a valid supplier email')
    ).toBeVisible();

    await user.clear(emailField);
    await user.type(emailField, 'orders@fresh.example');

    await waitFor(() =>
      expect(
        within(dialog).queryByText('Enter a valid supplier email')
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

    const dialog = screen.getByRole('dialog', { name: 'Supplier form' });

    await user.type(
      within(dialog).getByRole('textbox', { name: 'Name' }),
      'Fresh Farms'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Email' }),
      'orders@fresh.example'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Phone' }),
      '+1 555 0100'
    );
    await user.type(
      within(dialog).getByRole('textbox', { name: 'Address' }),
      '123 Market St'
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

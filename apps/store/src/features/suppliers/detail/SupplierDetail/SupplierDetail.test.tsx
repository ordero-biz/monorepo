import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupplier, updateSupplier } from '@/lib/client/api/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierDetail } from './SupplierDetail';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  getSupplier: vi.fn(),
  updateSupplier: vi.fn(),
}));

const getSupplierMock = vi.mocked(getSupplier);
const updateSupplierMock = vi.mocked(updateSupplier);

const { setup } = prepareStoreSetup({
  component: SupplierDetail,
  props: {
    supplierId: '1',
  },
});

const supplier = {
  id: 1,
  name: 'Fresh Farms',
  status: SUPPLIER_STATUS.DRAFT,
  email: 'orders@fresh.example',
  phone: '+1 555 0100',
  address: '123 Market St',
  comment: 'Preferred produce supplier',
};

describe('SupplierDetail', () => {
  beforeEach(() => {
    getSupplierMock.mockReset();
    updateSupplierMock.mockReset();
  });

  it('requests the supplier while loading', async () => {
    getSupplierMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading supplier...')).toBeVisible();
    await waitFor(() => expect(getSupplierMock).toHaveBeenCalledWith('1'));
  });

  it('refreshes the supplier once after editing', async () => {
    const updatedSupplier = {
      ...supplier,
      name: 'Green Farms',
      email: 'orders@green.example',
    };
    getSupplierMock
      .mockResolvedValueOnce({ ok: true, data: supplier })
      .mockResolvedValue({ ok: true, data: updatedSupplier });
    updateSupplierMock.mockResolvedValue({ ok: true, data: updatedSupplier });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Fresh Farms' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Edit supplier' })
    );

    const dialog = screen.getByRole('dialog', { name: 'Edit supplier' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Green Farms');
    const emailField = within(dialog).getByRole('textbox', { name: 'Email' });

    await user.clear(emailField);
    await user.type(emailField, 'orders@green.example');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByRole('heading', { name: 'Green Farms' })
    ).toBeVisible();
    expect(screen.getByText('orders@green.example')).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Edit supplier' })
    ).not.toBeInTheDocument();
    expect(updateSupplierMock).toHaveBeenCalledExactlyOnceWith({
      supplierId: 1,
      name: 'Green Farms',
      email: 'orders@green.example',
    });
    expect(getSupplierMock).toHaveBeenCalledTimes(2);
  });

  it('refreshes the supplier once after publishing', async () => {
    const activeSupplier = { ...supplier, status: SUPPLIER_STATUS.ACTIVE };
    getSupplierMock
      .mockResolvedValueOnce({ ok: true, data: supplier })
      .mockResolvedValue({ ok: true, data: activeSupplier });
    updateSupplierMock.mockResolvedValue({ ok: true, data: activeSupplier });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Publish' }));
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Publish supplier' })
      ).getByRole('button', { name: 'Publish' })
    );

    expect(await screen.findByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', { name: 'Publish supplier' })
    ).not.toBeInTheDocument();
    expect(updateSupplierMock).toHaveBeenCalledExactlyOnceWith({
      supplierId: 1,
      status: SUPPLIER_STATUS.ACTIVE,
    });
    expect(getSupplierMock).toHaveBeenCalledTimes(2);
  });

  it('renders supplier details', async () => {
    getSupplierMock.mockResolvedValue({
      ok: true,
      data: supplier,
    });
    setup();

    expect(
      await screen.findByRole('heading', { name: 'Fresh Farms' })
    ).toBeVisible();
    expect(screen.getByText('Supplier details')).toBeVisible();
    expect(screen.getByText('orders@fresh.example')).toBeVisible();
  });

  it('renders an error state and retries loading the supplier', async () => {
    getSupplierMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load supplier.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: supplier,
      });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this supplier right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(
      await screen.findByRole('heading', { name: 'Fresh Farms' })
    ).toBeVisible();
    expect(getSupplierMock).toHaveBeenCalledTimes(2);
  });
});

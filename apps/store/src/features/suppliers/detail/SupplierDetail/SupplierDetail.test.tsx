import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupplier, updateSupplier } from '@/lib/client/api/suppliers';
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

describe('SupplierDetail', () => {
  beforeEach(() => {
    getSupplierMock.mockReset();
    updateSupplierMock.mockReset();
  });

  it('requests the supplier when loaded', async () => {
    getSupplierMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading supplier...')).toBeVisible();
    await waitFor(() => {
      expect(getSupplierMock).toHaveBeenCalledWith('1');
    });
  });

  it('renders the supplier name as the page title and read-only details', async () => {
    getSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: 'Preferred produce supplier',
      },
    });

    setup();

    expect(
      await screen.findByRole('heading', { name: 'Fresh Farms' })
    ).toBeVisible();
    expect(screen.getByText('Email')).toBeVisible();
    expect(screen.getByText('orders@fresh.example')).toBeVisible();
    expect(screen.getByText('Phone')).toBeVisible();
    expect(screen.getByText('+1 555 0100')).toBeVisible();
    expect(screen.getByText('Address')).toBeVisible();
    expect(screen.getByText('123 Market St')).toBeVisible();
    expect(screen.getByText('Comment')).toBeVisible();
    expect(screen.getByText('Preferred produce supplier')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Edit Fresh Farms' })
    ).toBeVisible();
  });

  it('renders a placeholder when optional text is not provided', async () => {
    getSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Fresh Farms',
        email: 'orders@fresh.example',
        phone: '+1 555 0100',
        address: '123 Market St',
        comment: '',
      },
    });

    setup();

    expect(await screen.findByText('-')).toBeVisible();
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
        data: {
          id: 1,
          name: 'Fresh Farms',
          email: 'orders@fresh.example',
          phone: '+1 555 0100',
          address: '123 Market St',
          comment: 'Preferred produce supplier',
        },
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

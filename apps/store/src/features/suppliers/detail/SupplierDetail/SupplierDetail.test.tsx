import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupplier } from '@/lib/client/api/suppliers';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplierDetail } from './SupplierDetail';
import type { SupplierDetailHeaderProps } from './types';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  getSupplier: vi.fn(),
}));

vi.mock('./SupplierDetailHeader', () => ({
  SupplierDetailHeader: ({ onUpdated }: SupplierDetailHeaderProps) => (
    <button onClick={() => void onUpdated()} type="button">
      Refresh supplier
    </button>
  ),
}));

vi.mock('./SupplierDetailInfo', () => ({
  SupplierDetailInfo: () => <div>Supplier detail information</div>,
}));

const getSupplierMock = vi.mocked(getSupplier);

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
  });

  it('requests the supplier while loading', async () => {
    getSupplierMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading supplier...')).toBeVisible();
    await waitFor(() => expect(getSupplierMock).toHaveBeenCalledWith('1'));
  });

  it('composes supplier details and refreshes them after an update', async () => {
    getSupplierMock.mockResolvedValue({
      ok: true,
      data: supplier,
    });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByRole('button', { name: 'Refresh supplier' })
    ).toBeVisible();
    expect(screen.getByText('Supplier detail information')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Refresh supplier' }));

    await waitFor(() => expect(getSupplierMock).toHaveBeenCalledTimes(2));
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
      await screen.findByRole('button', { name: 'Refresh supplier' })
    ).toBeVisible();
    expect(getSupplierMock).toHaveBeenCalledTimes(2);
  });
});

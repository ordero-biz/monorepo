import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSuppliers } from '@/lib/client/api/suppliers';
import { getSupplierDetailRoute } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SuppliersList } from './SuppliersList';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  getSuppliers: vi.fn(),
}));

const getSuppliersMock = vi.mocked(getSuppliers);

const { setup } = prepareStoreSetup({
  component: SuppliersList,
});

describe('SuppliersList', () => {
  beforeEach(() => {
    getSuppliersMock.mockReset();
  });

  it('renders a loading state while suppliers are loading', () => {
    getSuppliersMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading suppliers...')).toBeVisible();
  });

  it('renders an error state and retries loading suppliers', async () => {
    getSuppliersMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load suppliers.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              name: 'Fresh Farms',
              email: 'orders@fresh.example',
              phone: '+1 555 0100',
              address: '123 Market St',
              comment: 'Preferred produce supplier',
            },
          ],
          page: {
            size: 25,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        },
      });

    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load your suppliers right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Fresh Farms')).toBeVisible();
    expect(getSuppliersMock).toHaveBeenCalledTimes(2);
  });

  it('renders the suppliers table rows', async () => {
    getSuppliersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Fresh Farms',
            email: 'orders@fresh.example',
            phone: '+1 555 0100',
            address: '123 Market St',
            comment: 'Preferred produce supplier',
          },
        ],
        page: {
          size: 25,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    setup();

    expect(
      await screen.findByRole('table', { name: 'Suppliers list' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Fresh Farms' })).toHaveAttribute(
      'href',
      getSupplierDetailRoute(1)
    );
    expect(screen.getByText('orders@fresh.example')).toBeVisible();
    expect(screen.getByText('+1 555 0100')).toBeVisible();
    expect(screen.getByText('123 Market St')).toBeVisible();
    expect(screen.getByText('Preferred produce supplier')).toBeVisible();
  });

  it('requests suppliers with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getSuppliersMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 2,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });

    setup({
      paginationInput,
    });

    await waitFor(() => {
      expect(getSuppliersMock).toHaveBeenCalledWith(paginationInput);
    });
  });
});

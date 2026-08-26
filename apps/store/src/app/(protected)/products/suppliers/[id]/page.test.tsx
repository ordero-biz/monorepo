import { SUPPLIER_STATUS } from '@/lib/domain/suppliers';
import { render, screen } from '@testing-library/react';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { getServerSupplier } from '@/lib/server/api/suppliers';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import SupplierDetailPage from './page';

vi.mock('@/features/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/features/suppliers')>(
    '@/features/suppliers'
  )),
  SupplierDetail: ({ supplierId }: { supplierId: string }) => (
    <div>Supplier detail {supplierId}</div>
  ),
}));

vi.mock('@/lib/server/api/suppliers', () => ({
  getServerSupplier: vi.fn(),
}));

const getServerSupplierMock = vi.mocked(getServerSupplier);

describe('SupplierDetailPage', () => {
  beforeEach(() => {
    getServerSupplierMock.mockReset();
  });

  it('prefetches supplier details and hydrates the query cache', async () => {
    const supplier = {
      id: 1,
      name: 'Fresh Farms',
      status: SUPPLIER_STATUS.DRAFT,
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    };
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerSupplierMock.mockResolvedValue({
      ok: true,
      data: supplier,
    });

    render(
      await SupplierDetailPage({
        params: Promise.resolve({ id: '1' }),
      }),
      {
        wrapper: TestQueryProvider,
      }
    );

    expect(screen.getByText('Supplier detail 1')).toBeVisible();
    expect(getServerSupplierMock).toHaveBeenCalledWith('1');
    expect(queryClient.getQueryData(suppliersQueryKeys.detail('1'))).toEqual(
      supplier
    );
  });
});

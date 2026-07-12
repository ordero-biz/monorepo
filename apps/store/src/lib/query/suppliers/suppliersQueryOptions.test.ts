import { QueryClient } from '@tanstack/react-query';
import {
  supplierQueryOptions,
  suppliersListQueryOptions,
} from './suppliersQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('supplier query options', () => {
  it('uses a stable paginated list key and unwraps fetched suppliers', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const suppliers = {
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
      page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
    };
    const fetchSuppliers = vi.fn(async () => ({
      ok: true as const,
      data: suppliers,
    }));
    const options = suppliersListQueryOptions(fetchSuppliers, input);

    expect(suppliersListQueryOptions(fetchSuppliers).queryKey).toEqual([
      'suppliers',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['suppliers', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      suppliers
    );
    expect(fetchSuppliers).toHaveBeenCalledWith(input);
  });

  it('uses the supplier id for detail queries', async () => {
    const supplier = {
      id: 1,
      name: 'Fresh Farms',
      email: 'orders@fresh.example',
      phone: '+1 555 0100',
      address: '123 Market St',
      comment: 'Preferred produce supplier',
    };
    const fetchSupplier = vi.fn(async () => ({
      ok: true as const,
      data: supplier,
    }));
    const options = supplierQueryOptions(1, fetchSupplier);

    expect(options.queryKey).toEqual(['suppliers', 'detail', '1']);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      supplier
    );
    expect(fetchSupplier).toHaveBeenCalledWith(1);
  });

  it('throws the normalized API error from the list fetcher', async () => {
    const error = { status: 500, message: 'Could not load suppliers.' };
    const options = suppliersListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });
});

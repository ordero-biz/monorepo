import { QueryClient } from '@tanstack/react-query';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import {
  unitOfMeasurementQueryOptions,
  unitsOfMeasurementListQueryOptions,
} from './unitsOfMeasurementQueryOptions';

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

describe('unitsOfMeasurementListQueryOptions', () => {
  it('uses a stable paginated key and unwraps fetched units', async () => {
    const input = { page: 1, size: 10, sort: ['name,asc'] };
    const units = {
      content: [
        {
          id: 1,
          status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
        },
      ],
      page: { size: 10, number: 1, totalElements: 11, totalPages: 2 },
    };
    const fetchUnits = vi.fn(async () => ({ ok: true as const, data: units }));
    const options = unitsOfMeasurementListQueryOptions(fetchUnits, input);

    expect(unitsOfMeasurementListQueryOptions(fetchUnits).queryKey).toEqual([
      'units-of-measurement',
      'list',
      {},
    ]);
    expect(options.queryKey).toEqual(['units-of-measurement', 'list', input]);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      units
    );
    expect(fetchUnits).toHaveBeenCalledWith(input);
  });

  it('throws the normalized API error from the fetcher', async () => {
    const error = { status: 500, message: 'Could not load units.' };
    const options = unitsOfMeasurementListQueryOptions(async () => ({
      ok: false as const,
      error,
    }));

    await expect(createQueryClient().fetchQuery(options)).rejects.toEqual(
      error
    );
  });

  it('uses a stable detail key and unwraps a fetched unit of measurement', async () => {
    const unitOfMeasurement = {
      id: 1,
      status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    };
    const fetchUnitOfMeasurement = vi.fn(async () => ({
      ok: true as const,
      data: unitOfMeasurement,
    }));
    const options = unitOfMeasurementQueryOptions('1', fetchUnitOfMeasurement);

    expect(options.queryKey).toEqual(['units-of-measurement', 'detail', '1']);
    await expect(createQueryClient().fetchQuery(options)).resolves.toEqual(
      unitOfMeasurement
    );
    expect(fetchUnitOfMeasurement).toHaveBeenCalledWith('1');
  });
});

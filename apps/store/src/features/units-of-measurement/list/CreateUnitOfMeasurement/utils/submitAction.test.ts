import { createUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { submitCreateUnitOfMeasurement } from './submitAction';

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  createUnitOfMeasurement: vi.fn(),
}));

const createUnitOfMeasurementMock = vi.mocked(createUnitOfMeasurement);

describe('submitCreateUnitOfMeasurement', () => {
  beforeEach(() => {
    createUnitOfMeasurementMock.mockReset();
  });

  it('normalizes form values before creating the unit of measurement', async () => {
    const unitOfMeasurement = {
      id: 1,
      status: 'ACTIVE' as const,
      name: 'Kilogram',
      symbol: 'kg',
      comment: 'Weight unit',
    };
    createUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });

    await expect(
      submitCreateUnitOfMeasurement({
        status: 'ACTIVE',
        name: ' Kilogram ',
        symbol: ' kg ',
        comment: ' Weight unit ',
      })
    ).resolves.toEqual({
      ok: true,
      data: unitOfMeasurement,
    });

    expect(createUnitOfMeasurementMock).toHaveBeenCalledWith({
      name: 'Kilogram',
      status: 'ACTIVE',
      symbol: 'kg',
      comment: 'Weight unit',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    createUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Unit of measurement creation failed.',
        fieldErrors: { status: 'Invalid status.' },
      },
    });

    await expect(
      submitCreateUnitOfMeasurement({
        status: 'ACTIVE',
        name: 'Kilogram',
        symbol: 'kg',
        comment: '',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: { status: 'Invalid status.' },
        formError: 'Unit of measurement creation failed.',
      },
    });
  });
});

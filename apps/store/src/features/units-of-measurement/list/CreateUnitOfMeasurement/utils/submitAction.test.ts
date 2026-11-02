import { createUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
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
      status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
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
        comment: ' Weight unit ',
      })
    ).resolves.toEqual({
      ok: true,
      data: unitOfMeasurement,
    });

    expect(createUnitOfMeasurementMock).toHaveBeenCalledWith({
      name: 'Kilogram',
      status: 'ACTIVE',
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
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: { status: 'Invalid status.' },
        formError: 'Unit of measurement creation failed.',
      },
    });
  });

  it('maps a duplicate unit name error to the shared message', async () => {
    createUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.UNIT_OF_MEASUREMENT_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      },
    });

    await expect(
      submitCreateUnitOfMeasurement({
        status: 'DRAFT',
        name: 'Kilogram',
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: undefined,
        formError: 'Unit name already exists.',
      },
    });
  });
});

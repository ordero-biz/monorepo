import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/unitsOfMeasurement';
import {
  getUnitOfMeasurementUpdateChanges,
  submitUpdateUnitOfMeasurement,
} from './submitAction';

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  updateUnitOfMeasurement: vi.fn(),
}));

const updateUnitOfMeasurementMock = vi.mocked(updateUnitOfMeasurement);

describe('submitUpdateUnitOfMeasurement', () => {
  beforeEach(() => {
    updateUnitOfMeasurementMock.mockReset();
  });

  it('normalizes changed form values before updating the unit of measurement', async () => {
    const unitOfMeasurement = {
      id: 1,
      status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      name: 'Gram',
      symbol: 'g',
      comment: 'Metric weight',
    };
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });

    await expect(
      submitUpdateUnitOfMeasurement({
        unitOfMeasurementId: 1,
        submitData: {
          name: 'Gram',
          symbol: 'g',
        },
      })
    ).resolves.toEqual({
      ok: true,
      data: unitOfMeasurement,
    });

    expect(updateUnitOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementId: 1,
      name: 'Gram',
      symbol: 'g',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Unit of measurement update failed.',
        fieldErrors: { status: 'Invalid status.' },
      },
    });

    await expect(
      submitUpdateUnitOfMeasurement({
        unitOfMeasurementId: 1,
        submitData: { name: 'Gram' },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: { status: 'Invalid status.' },
        formError: 'Unit of measurement update failed.',
      },
    });
  });

  it('returns only normalized values that changed', () => {
    expect(
      getUnitOfMeasurementUpdateChanges({
        initialValues: {
          status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
          name: 'Kilogram',
          symbol: 'kg',
          comment: 'Weight unit',
        },
        formValue: {
          status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
          name: ' Kilogram ',
          symbol: 'g',
          comment: ' Weight unit ',
        },
      })
    ).toEqual({ symbol: 'g' });
  });
});

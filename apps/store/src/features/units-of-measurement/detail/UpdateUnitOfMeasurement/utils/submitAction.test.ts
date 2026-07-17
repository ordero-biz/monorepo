import { updateUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { submitUpdateUnitOfMeasurement } from './submitAction';

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

  it('normalizes form values before updating the unit of measurement', async () => {
    const unitOfMeasurement = {
      id: 1,
      code: 'G',
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
        value: {
          code: ' G ',
          name: ' Gram ',
          symbol: ' g ',
          comment: ' Metric weight ',
        },
      })
    ).resolves.toEqual({
      ok: true,
      data: unitOfMeasurement,
    });

    expect(updateUnitOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementId: 1,
      code: 'G',
      name: 'Gram',
      symbol: 'g',
      comment: 'Metric weight',
    });
  });

  it('maps backend errors to submit action errors', async () => {
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Unit of measurement update failed.',
        fieldErrors: {
          code: 'Unit code already exists.',
        },
      },
    });

    await expect(
      submitUpdateUnitOfMeasurement({
        unitOfMeasurementId: 1,
        value: {
          code: 'G',
          name: 'Gram',
          symbol: 'g',
          comment: '',
        },
      })
    ).resolves.toEqual({
      ok: false,
      error: {
        fieldErrors: {
          code: 'Unit code already exists.',
        },
        formError: 'Unit of measurement update failed.',
      },
    });
  });
});

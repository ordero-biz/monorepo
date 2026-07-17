import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getUnitOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UnitOfMeasurementDetail } from './UnitOfMeasurementDetail';

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  getUnitOfMeasurement: vi.fn(),
}));

const getUnitOfMeasurementMock = vi.mocked(getUnitOfMeasurement);

const { setup } = prepareStoreSetup({
  component: UnitOfMeasurementDetail,
  props: {
    unitOfMeasurementId: '1',
  },
});

const unitOfMeasurement = {
  id: 1,
  code: 'KG',
  name: 'Kilogram',
  symbol: 'kg',
  comment: 'Weight unit',
};

describe('UnitOfMeasurementDetail', () => {
  beforeEach(() => {
    getUnitOfMeasurementMock.mockReset();
  });

  it('renders unit of measurement details', async () => {
    getUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });

    setup();

    expect(
      await screen.findByRole('heading', { name: 'Kilogram' })
    ).toBeVisible();
    expect(screen.getByText('Unit of measurement details')).toBeVisible();
    expect(screen.getByText('KG')).toBeVisible();
    expect(screen.getByText('kg')).toBeVisible();
    expect(screen.getByText('Weight unit')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Edit Kilogram' })).toBeVisible();
  });

  it('renders an error state and retries loading the unit of measurement', async () => {
    getUnitOfMeasurementMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load unit of measurement.' },
      })
      .mockResolvedValueOnce({ ok: true, data: unitOfMeasurement });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText(
        "We couldn't load this unit of measurement right now."
      )
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() =>
      expect(getUnitOfMeasurementMock).toHaveBeenCalledTimes(2)
    );
  });
});

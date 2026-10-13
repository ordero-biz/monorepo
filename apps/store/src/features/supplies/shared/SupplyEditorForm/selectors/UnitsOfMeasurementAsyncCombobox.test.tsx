import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { UnitsOfMeasurementAsyncComboboxProps } from './types';
import { UnitsOfMeasurementAsyncCombobox } from './UnitsOfMeasurementAsyncCombobox';

const mocks = vi.hoisted(() => ({
  getUnitsOfMeasurement: vi.fn(),
}));

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  getUnitsOfMeasurement: mocks.getUnitsOfMeasurement,
}));

const getUnitsOfMeasurementMock = vi.mocked(getUnitsOfMeasurement);

const { setup } = prepareStoreSetup<UnitsOfMeasurementAsyncComboboxProps>({
  component: UnitsOfMeasurementAsyncCombobox,
  props: {
    'aria-label': 'Unit',
    placeholder: 'Unit',
  },
});

describe('UnitsOfMeasurementAsyncCombobox', () => {
  beforeEach(() => {
    getUnitsOfMeasurementMock.mockReset();
  });

  it('shows Draft only for draft units while preserving the selected display value', async () => {
    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Box',
            status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
            symbol: 'box',
          },
          {
            id: 2,
            name: 'Piece',
            status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
            symbol: 'pc',
          },
        ],
        page: {
          number: 0,
          size: 100,
          totalElements: 2,
          totalPages: 1,
        },
      },
    });
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('combobox', { name: 'Unit' }));

    const draftOption = await screen.findByRole('option', {
      name: /Box \(box\)/,
    });
    const activeOption = screen.getByRole('option', { name: /Piece \(pc\)/ });

    expect(within(draftOption).getByText('Draft')).toBeVisible();
    expect(within(activeOption).queryByText('Draft')).toBeNull();

    await user.click(draftOption);

    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveValue(
      'Box (box)'
    );
  });
});

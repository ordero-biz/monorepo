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

  it.each([
    undefined,
    null,
    '',
  ])('displays a saved unit without a symbol (%s) before loading', (symbol) => {
    setup({
      value: {
        id: 2,
        name: 'Piece',
        symbol,
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      },
    });
    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveValue('Piece');
    expect(getUnitsOfMeasurementMock).not.toHaveBeenCalled();
  });

  it('retains the saved name and symbol when loading fails', async () => {
    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Unavailable' },
    });
    const user = userEvent.setup();
    const { onValueChange } = setup({
      value: {
        id: 2,
        name: 'Bag',
        symbol: 'bag',
        status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
      },
      onValueChange: vi.fn(),
    });
    const input = screen.getByRole('combobox', { name: 'Unit' });
    expect(input).toHaveValue('Bag (bag)');
    await user.click(input);
    expect(
      await screen.findByText(
        "We couldn't load units of measurement right now."
      )
    ).toBeVisible();
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('Bag (bag)');
    expect(onValueChange).not.toHaveBeenCalled();
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

    const { onValueChange } = setup({ onValueChange: vi.fn() });
    await user.click(screen.getByRole('combobox', { name: 'Unit' }));

    const draftOption = await screen.findByRole('option', {
      name: /Box \(box\)/,
    });
    const activeOption = screen.getByRole('option', { name: /Piece \(pc\)/ });

    expect(within(draftOption).getByText('Draft')).toBeVisible();
    expect(within(activeOption).queryByText('Draft')).toBeNull();

    await user.click(draftOption);
    expect(onValueChange).toHaveBeenCalledWith(
      {
        id: 1,
        name: 'Box',
        symbol: 'box',
        status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
      },
      expect.any(Object)
    );

    expect(screen.getByRole('combobox', { name: 'Unit' })).toHaveValue(
      'Box (box)'
    );
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getUnitOfMeasurement,
  updateUnitOfMeasurement,
} from '@/lib/client/api/units-of-measurement';
import { UNIT_OF_MEASUREMENT_STATUS } from '@/lib/domain/units-of-measurement/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UnitOfMeasurementDetail } from './UnitOfMeasurementDetail';

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  getUnitOfMeasurement: vi.fn(),
  updateUnitOfMeasurement: vi.fn(),
}));

const getUnitOfMeasurementMock = vi.mocked(getUnitOfMeasurement);
const updateUnitOfMeasurementMock = vi.mocked(updateUnitOfMeasurement);

const { setup } = prepareStoreSetup({
  component: UnitOfMeasurementDetail,
  props: {
    unitOfMeasurementId: '1',
  },
});

const unitOfMeasurement = {
  id: 1,
  status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
  name: 'Kilogram',
  symbol: 'kg',
  comment: 'Weight unit',
};

describe('UnitOfMeasurementDetail', () => {
  beforeEach(() => {
    getUnitOfMeasurementMock.mockReset();
    updateUnitOfMeasurementMock.mockReset();
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
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('kg')).toBeVisible();
    expect(screen.getByText('Weight unit')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Actions for Kilogram' })
    ).toBeVisible();
  });

  it('opens the delete dialog from the actions menu', async () => {
    getUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Kilogram' })
    );
    await user.click(
      await screen.findByRole('menuitem', {
        name: 'Delete unit of measurement',
      })
    );

    expect(
      screen.getByRole('dialog', { name: 'Delete unit of measurement' })
    ).toBeVisible();
  });

  it('opens an edit dialog without a name field for an active unit of measurement', async () => {
    getUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Kilogram' })
    );

    await user.click(
      await screen.findByRole('menuitem', {
        name: 'Edit unit of measurement',
      })
    );

    screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });

    expect(
      screen.queryByRole('textbox', { name: 'Name' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Symbol' })).toBeVisible();
  });

  it('opens the edit dialog for a draft unit of measurement', async () => {
    getUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        ...unitOfMeasurement,
        status: 'DRAFT',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Kilogram' })
    );
    await user.click(
      await screen.findByRole('menuitem', {
        name: 'Edit unit of measurement',
      })
    );

    expect(
      screen.getByRole('dialog', { name: 'Edit unit of measurement' })
    ).toBeVisible();
  });

  it('opens a confirmation dialog before publishing a draft unit of measurement', async () => {
    getUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        ...unitOfMeasurement,
        status: 'DRAFT',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish unit of measurement' })
    ).toBeVisible();
  });

  it('refreshes the header and details once after editing a unit of measurement', async () => {
    const draftUnitOfMeasurement = {
      ...unitOfMeasurement,
      status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
    };
    const updatedUnitOfMeasurement = {
      ...draftUnitOfMeasurement,
      name: 'Gram',
      symbol: 'g',
    };
    getUnitOfMeasurementMock
      .mockResolvedValueOnce({ ok: true, data: draftUnitOfMeasurement })
      .mockResolvedValue({ ok: true, data: updatedUnitOfMeasurement });
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: updatedUnitOfMeasurement,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Kilogram' })
    );
    await user.click(
      await screen.findByRole('menuitem', {
        name: 'Edit unit of measurement',
      })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Edit unit of measurement',
    });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });
    const symbolField = within(dialog).getByRole('textbox', { name: 'Symbol' });

    await user.clear(nameField);
    await user.type(nameField, 'Gram');
    await user.clear(symbolField);
    await user.type(symbolField, 'g');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('heading', { name: 'Gram' })).toBeVisible();
    expect(screen.getByText('g')).toBeVisible();
    expect(screen.getByText('Weight unit')).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Edit unit of measurement' })
    ).not.toBeInTheDocument();
    expect(updateUnitOfMeasurementMock).toHaveBeenCalledExactlyOnceWith({
      unitOfMeasurementId: 1,
      name: 'Gram',
      symbol: 'g',
    });
    expect(getUnitOfMeasurementMock).toHaveBeenCalledTimes(2);
  });

  it('refreshes the status once after publishing a unit of measurement', async () => {
    getUnitOfMeasurementMock
      .mockResolvedValueOnce({
        ok: true,
        data: {
          ...unitOfMeasurement,
          status: UNIT_OF_MEASUREMENT_STATUS.DRAFT,
        },
      })
      .mockResolvedValue({ ok: true, data: unitOfMeasurement });
    updateUnitOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: unitOfMeasurement,
    });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Publish' }));

    const dialog = screen.getByRole('dialog', {
      name: 'Publish unit of measurement',
    });

    await user.click(within(dialog).getByRole('button', { name: 'Publish' }));

    expect(await screen.findByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('dialog', { name: 'Publish unit of measurement' })
    ).not.toBeInTheDocument();
    expect(updateUnitOfMeasurementMock).toHaveBeenCalledExactlyOnceWith({
      unitOfMeasurementId: 1,
      status: UNIT_OF_MEASUREMENT_STATUS.ACTIVE,
    });
    expect(getUnitOfMeasurementMock).toHaveBeenCalledTimes(2);
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

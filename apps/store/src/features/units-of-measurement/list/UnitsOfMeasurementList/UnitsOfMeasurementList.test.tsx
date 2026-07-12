import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getUnitsOfMeasurement } from '@/lib/client/api/units-of-measurement';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UnitsOfMeasurementList } from './UnitsOfMeasurementList';

const mocks = vi.hoisted(() => ({
  pathname: '/products/units-of-measurement',
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({
    push: mocks.push,
  }),
  useSearchParams: () => mocks.searchParams,
}));

vi.mock('@/lib/client/api/units-of-measurement', async () => ({
  ...(await vi.importActual<
    typeof import('@/lib/client/api/units-of-measurement')
  >('@/lib/client/api/units-of-measurement')),
  getUnitsOfMeasurement: vi.fn(),
}));

const getUnitsOfMeasurementMock = vi.mocked(getUnitsOfMeasurement);

const { setup } = prepareStoreSetup({
  component: UnitsOfMeasurementList,
});

describe('UnitsOfMeasurementList', () => {
  beforeEach(() => {
    getUnitsOfMeasurementMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while units of measurement are loading', () => {
    getUnitsOfMeasurementMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading units of measurement...')).toBeVisible();
  });

  it('renders an error state and retries loading units of measurement', async () => {
    getUnitsOfMeasurementMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load units of measurement.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              code: 'KG',
              name: 'Kilogram',
              symbol: 'kg',
              comment: 'Weight unit',
            },
          ],
          page: {
            size: 10,
            number: 0,
            totalElements: 1,
            totalPages: 1,
          },
        },
      });

    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText(
        "We couldn't load your units of measurement right now."
      )
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Kilogram')).toBeVisible();
    expect(getUnitsOfMeasurementMock).toHaveBeenCalledTimes(2);
  });

  it('renders the units of measurement table rows', async () => {
    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            code: 'KG',
            name: 'Kilogram',
            symbol: 'kg',
            comment: 'Weight unit',
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    setup();

    expect(
      await screen.findByRole('table', {
        name: 'Units of measurement list',
      })
    ).toBeVisible();
    expect(screen.getByText('KG')).toBeVisible();
    expect(screen.getByText('Kilogram')).toBeVisible();
    expect(screen.getByText('kg')).toBeVisible();
    expect(screen.getByText('Weight unit')).toBeVisible();
  });

  it('requests units of measurement with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 2,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });

    setup({
      paginationInput,
    });

    await waitFor(() => {
      expect(getUnitsOfMeasurementMock).toHaveBeenCalledWith(paginationInput);
    });
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  deleteUnitsOfMeasurement,
  getUnitsOfMeasurement,
} from '@/lib/client/api/units-of-measurement';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { UnitsOfMeasurementList } from './UnitsOfMeasurementList';

const mocks = vi.hoisted(() => ({
  pathname: '/products/units-of-measurement',
  push: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
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
  deleteUnitsOfMeasurement: vi.fn(),
  getUnitsOfMeasurement: vi.fn(),
}));

const deleteUnitsOfMeasurementMock = vi.mocked(deleteUnitsOfMeasurement);
const getUnitsOfMeasurementMock = vi.mocked(getUnitsOfMeasurement);

const { setup } = prepareStoreSetup({
  component: UnitsOfMeasurementList,
});

describe('UnitsOfMeasurementList', () => {
  beforeEach(() => {
    deleteUnitsOfMeasurementMock.mockReset();
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

  it('shows bulk delete actions for selected units of measurement', async () => {
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
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Kilogram' })
    );

    expect(screen.getByText('1 selected')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Clear selection' })
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      screen.getByRole('dialog', { name: 'Delete unit of measurement' })
    ).toHaveTextContent(
      'Are you sure you want to delete the "Kilogram" unit of measurement?'
    );
  });

  it('preserves other selections when deleting from a unit row action', async () => {
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
          {
            id: 2,
            code: 'L',
            name: 'Liter',
            symbol: 'l',
            comment: 'Volume unit',
          },
        ],
        page: {
          size: 10,
          number: 0,
          totalElements: 2,
          totalPages: 1,
        },
      },
    });
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Liter' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Actions for Kilogram' })
    );
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(
      screen.getByRole('dialog', { name: 'Delete unit of measurement' })
    ).toHaveTextContent(
      'Are you sure you want to delete the "Kilogram" unit of measurement?'
    );
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Delete unit of measurement' })
      ).getByRole('button', { name: 'Delete' })
    );

    expect(deleteUnitsOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementIds: [1],
    });
    await waitFor(() => expect(screen.getByText('1 selected')).toBeVisible());
  });

  it('selects only units on the current server page', async () => {
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
          {
            id: 2,
            code: 'L',
            name: 'Liter',
            symbol: 'l',
            comment: 'Volume unit',
          },
        ],
        page: {
          size: 2,
          number: 0,
          totalElements: 3,
          totalPages: 2,
        },
      },
    });
    const user = userEvent.setup();

    setup({
      paginationInput: {
        page: 0,
        size: 2,
      },
    });

    await user.click(
      await screen.findByRole('checkbox', {
        name: 'Select all units of measurement',
      })
    );

    expect(screen.getByText('2 selected')).toBeVisible();
    expect(screen.queryByText('3 selected')).not.toBeInTheDocument();
  });

  it('deletes selected units and clears the selection after success', async () => {
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
    deleteUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();

    const { queryClient } = setup();
    const removeQueriesSpy = vi.spyOn(queryClient, 'removeQueries');

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Kilogram' })
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Delete unit of measurement' })
      ).getByRole('button', { name: 'Delete' })
    );

    expect(deleteUnitsOfMeasurementMock).toHaveBeenCalledWith({
      unitOfMeasurementIds: [1],
    });
    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ['units-of-measurement', 'detail', '1'],
    });
    await waitFor(() =>
      expect(screen.queryByText('1 selected')).not.toBeInTheDocument()
    );
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

  it('renders the current server page without client-side pagination', async () => {
    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            code: 'L',
            name: 'Liter',
            symbol: 'l',
            comment: 'Volume unit',
          },
        ],
        page: {
          size: 1,
          number: 1,
          totalElements: 2,
          totalPages: 2,
        },
      },
    });

    setup({
      paginationInput: {
        page: 1,
        size: 1,
      },
    });

    expect(await screen.findByText('Liter')).toBeVisible();
    expect(screen.getByText('2-2 of 2')).toBeVisible();
  });

  it('renders an empty state when there are no units of measurement', async () => {
    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 0,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });

    setup();

    expect(
      await screen.findByText('No units of measurement found.')
    ).toBeVisible();
  });

  it('pushes pagination changes to the URL', async () => {
    mocks.searchParams = new URLSearchParams('page=0&size=25&sort=name%2Casc');
    getUnitsOfMeasurementMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 10,
          number: 0,
          totalElements: 51,
          totalPages: 3,
        },
      },
    });
    const user = userEvent.setup();

    setup({
      paginationInput: {
        page: 0,
        size: 10,
        sort: ['name,asc'],
      },
    });

    await user.click(
      await screen.findByRole('button', { name: 'Go to next page' })
    );

    expect(mocks.push).toHaveBeenCalledWith(
      '/products/units-of-measurement?page=1&size=25&sort=name%2Casc',
      { scroll: false }
    );
  });
});

import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteAttributes, getAttributes } from '@/lib/client/api/attributes';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributesList } from './AttributesList';

const mocks = vi.hoisted(() => ({
  pathname: '/products/attributes',
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

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  deleteAttributes: vi.fn(),
  getAttributes: vi.fn(),
}));

const deleteAttributesMock = vi.mocked(deleteAttributes);
const getAttributesMock = vi.mocked(getAttributes);

const { setup } = prepareStoreSetup({
  component: AttributesList,
});

describe('AttributesList', () => {
  beforeEach(() => {
    deleteAttributesMock.mockReset();
    getAttributesMock.mockReset();
    mocks.push.mockReset();
    mocks.searchParams = new URLSearchParams();
  });

  it('renders a loading state while attributes are loading', () => {
    getAttributesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading attributes...')).toBeVisible();
  });

  it('renders an error state and retries loading attributes', async () => {
    getAttributesMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load attributes.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              name: 'Size',
              sortOrder: 10,
              status: 'DRAFT' as const,
              values: ['S', 'M', 'L'],
              createdAt: '2026-05-26T20:55:51.542Z',
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
      await screen.findByText("We couldn't load your attributes right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Size')).toBeVisible();
    expect(getAttributesMock).toHaveBeenCalledTimes(2);
  });

  it('renders the attributes table rows', async () => {
    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            status: 'ACTIVE',
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
          },
          {
            id: 2,
            name: 'Material',
            sortOrder: 20,
            status: 'DRAFT' as const,
            values: ['Cotton'],
            createdAt: '2026-05-27T20:55:51.542Z',
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

    setup();

    expect(
      await screen.findByRole('table', { name: 'Attributes list' })
    ).toBeVisible();
    expect(
      screen.queryByRole('columnheader', { name: 'Sort order' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    expect(screen.getByText('Size')).toBeVisible();
    expect(screen.getByText('26 May 2026')).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('Draft')).toBeVisible();
  });

  it('renders attribute names as detail page links', async () => {
    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            status: 'DRAFT' as const,
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
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

    expect(await screen.findByRole('link', { name: 'Size' })).toHaveAttribute(
      'href',
      getAttributeDetailRoute(1)
    );
  });

  it('shows bulk delete actions for selected attributes', async () => {
    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            status: 'ACTIVE',
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
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
      await screen.findByRole('checkbox', { name: 'Select Size' })
    );

    expect(screen.getByText('1 selected')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Clear selection' })
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(
      screen.getByRole('dialog', { name: 'Delete attribute' })
    ).toHaveTextContent(
      'Are you sure you want to delete the "Size" attribute and all its associated values?'
    );
  });

  it('preserves other selections when deleting from an attribute row action', async () => {
    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            status: 'ACTIVE',
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
          },
          {
            id: 2,
            name: 'Material',
            sortOrder: 20,
            status: 'DRAFT' as const,
            values: ['Cotton'],
            createdAt: '2026-05-27T20:55:51.542Z',
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
    deleteAttributesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Material' })
    );
    await user.click(screen.getByRole('button', { name: 'Actions for Size' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }));
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Delete attribute' })
      ).getByRole('button', { name: 'Delete' })
    );

    expect(deleteAttributesMock).toHaveBeenCalledWith({
      attributeIds: [1],
    });
    await waitFor(() => expect(screen.getByText('1 selected')).toBeVisible());
  });

  it('selects only attributes on the current server page', async () => {
    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            status: 'ACTIVE',
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
          },
          {
            id: 2,
            name: 'Material',
            sortOrder: 20,
            status: 'DRAFT' as const,
            values: ['Cotton'],
            createdAt: '2026-05-27T20:55:51.542Z',
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
        page: 1,
        size: 2,
      },
    });

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select all attributes' })
    );

    expect(screen.getByText('2 selected')).toBeVisible();
    expect(screen.queryByText('3 selected')).not.toBeInTheDocument();
  });

  it('clears selection and closes the dialog before the list refresh finishes', async () => {
    const refresh =
      Promise.withResolvers<Awaited<ReturnType<typeof getAttributes>>>();

    getAttributesMock.mockResolvedValueOnce({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            status: 'ACTIVE',
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
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
    getAttributesMock.mockReturnValue(refresh.promise);
    deleteAttributesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Size' })
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Delete attribute' })
      ).getByRole('button', { name: 'Delete' })
    );

    expect(deleteAttributesMock).toHaveBeenCalledWith({
      attributeIds: [1],
    });
    await waitFor(() => expect(getAttributesMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(screen.queryByText('1 selected')).not.toBeInTheDocument()
    );
    expect(
      screen.queryByRole('dialog', { name: 'Delete attribute' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Select Size' })
    ).not.toBeChecked();

    await act(async () => {
      refresh.resolve({
        ok: true,
        data: {
          content: [],
          page: { size: 10, number: 0, totalElements: 0, totalPages: 0 },
        },
      });
    });

    expect(await screen.findByText('No attributes found.')).toBeVisible();
  });

  it('preserves selection and the dialog while deletion is pending and after failure', async () => {
    const deletion =
      Promise.withResolvers<Awaited<ReturnType<typeof deleteAttributes>>>();

    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Size',
            sortOrder: 10,
            status: 'ACTIVE',
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
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
    deleteAttributesMock.mockReturnValue(deletion.promise);
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('checkbox', { name: 'Select Size' })
    );
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(
      within(
        screen.getByRole('dialog', { name: 'Delete attribute' })
      ).getByRole('button', { name: 'Delete' })
    );

    expect(deleteAttributesMock).toHaveBeenCalledWith({
      attributeIds: [1],
    });
    expect(screen.getByText('1 selected')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled();

    await act(async () => {
      deletion.resolve({
        ok: false,
        error: { status: 500, message: 'Deletion failed' },
      });
    });

    expect(await screen.findByText('Deletion failed')).toBeVisible();
    const dialog = screen.getByRole('dialog', { name: 'Delete attribute' });

    expect(dialog).toBeVisible();
    expect(
      within(dialog).getByRole('button', { name: 'Delete' })
    ).toBeEnabled();
    expect(screen.getByText('1 selected')).toBeVisible();
    expect(
      screen.getByRole('checkbox', { name: 'Select Size', hidden: true })
    ).toBeChecked();
    expect(getAttributesMock).toHaveBeenCalledTimes(1);
  });

  it('renders an empty state when no attributes are available', async () => {
    getAttributesMock.mockResolvedValue({
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

    expect(await screen.findByText('No attributes found.')).toBeVisible();
  });

  it('requests attributes with pagination input', async () => {
    const paginationInput = {
      page: 2,
      size: 10,
      sort: ['name,asc'],
    };

    getAttributesMock.mockResolvedValue({
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
      expect(getAttributesMock).toHaveBeenCalledWith(paginationInput);
    });
  });

  it('renders current server page rows without client-side pagination', async () => {
    getAttributesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 2,
            name: 'Material',
            sortOrder: 20,
            status: 'DRAFT' as const,
            values: ['Cotton'],
            createdAt: '2026-05-27T20:55:51.542Z',
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
        page: 2,
        size: 1,
      },
    });

    expect(await screen.findByText('Material')).toBeVisible();
    expect(await screen.findByText('2-2 of 2')).toBeVisible();
  });
});

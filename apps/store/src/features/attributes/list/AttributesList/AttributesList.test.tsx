import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttributes } from '@/lib/client/api/attributes';
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
  getAttributes: vi.fn(),
}));

const getAttributesMock = vi.mocked(getAttributes);

const { setup } = prepareStoreSetup({
  component: AttributesList,
});

describe('AttributesList', () => {
  beforeEach(() => {
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

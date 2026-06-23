import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttributes } from '@/lib/client/api/attributes';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributesList } from './AttributesList';

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
              values: ['S', 'M', 'L'],
              createdAt: '2026-05-26T20:55:51.542Z',
            },
          ],
          page: {
            size: 25,
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
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
          },
        ],
        page: {
          size: 25,
          number: 0,
          totalElements: 1,
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
    expect(screen.getByText('Size')).toBeVisible();
    expect(screen.getByText('26 May 2026')).toBeVisible();
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
            values: ['S', 'M', 'L'],
            createdAt: '2026-05-26T20:55:51.542Z',
          },
        ],
        page: {
          size: 25,
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
});

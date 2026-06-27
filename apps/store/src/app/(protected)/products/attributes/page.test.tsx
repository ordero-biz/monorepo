import { screen } from '@testing-library/react';
import { getAttributes } from '@/lib/client/api/attributes';
import { getAttributeDetailRoute } from '@/lib/client/routes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import AttributesPage from './page';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributes: vi.fn(),
}));

const getAttributesMock = vi.mocked(getAttributes);

const { setup } = prepareStoreSetup({
  component: AttributesPage,
});

describe('AttributesPage', () => {
  beforeEach(() => {
    getAttributesMock.mockReset();
    routerPushMock.mockClear();
  });

  it('renders the attributes route with create action and loaded attributes', async () => {
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
      screen.getByRole('heading', { name: 'Attributes list' })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Create attribute' })
    ).toBeVisible();
    expect(
      await screen.findByRole('table', { name: 'Attributes list' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Size' })).toHaveAttribute(
      'href',
      getAttributeDetailRoute(1)
    );
    expect(screen.getByText('26 May 2026')).toBeVisible();
  });
});

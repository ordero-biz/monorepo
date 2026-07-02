import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategories } from '@/lib/client/api/categories';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryList } from './CategoryList';

const mocks = vi.hoisted(() => ({
  createCategory: vi.fn(),
  getCategories: vi.fn(),
}));

vi.mock('@/lib/client/api/categories', () => ({
  createCategory: mocks.createCategory,
  getCategories: mocks.getCategories,
}));

const getCategoriesMock = vi.mocked(getCategories);

const { setup } = prepareStoreSetup({
  component: CategoryList,
});

describe('CategoryList', () => {
  beforeEach(() => {
    getCategoriesMock.mockReset();
  });

  it('renders a loading state while categories are loading', () => {
    getCategoriesMock.mockReturnValue(new Promise(() => {}));

    setup();

    expect(screen.getByText('Loading categories...')).toBeVisible();
  });

  it('renders an error state and retries loading categories', async () => {
    getCategoriesMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load categories.',
        },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: {
          content: [
            {
              id: 1,
              name: 'Shoes',
              sortOrder: 10,
              color: '#2563eb',
              createdAt: '2026-07-01T10:54:34.839Z',
              parentCategory: {
                id: 2,
                name: 'Fashion',
                createdAt: '2026-06-30T10:54:34.839Z',
              },
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
      await screen.findByText("We couldn't load your categories right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Shoes')).toBeVisible();
    expect(getCategoriesMock).toHaveBeenCalledTimes(2);
  });

  it('renders the categories table rows', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            color: '#2563eb',
            createdAt: '2026-07-01T10:54:34.839Z',
            parentCategory: {
              id: 2,
              name: 'Fashion',
              createdAt: '2026-06-30T10:54:34.839Z',
            },
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
      await screen.findByRole('table', { name: 'Category list' })
    ).toBeVisible();
    expect(screen.getByText('Shoes')).toBeVisible();
    expect(screen.getByText('Fashion')).toBeVisible();
    expect(screen.getByText('01 Jul 2026')).toBeVisible();
  });

  it('renders an empty state when there are no categories', async () => {
    getCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [],
        page: {
          size: 25,
          number: 0,
          totalElements: 0,
          totalPages: 0,
        },
      },
    });

    setup();

    expect(await screen.findByText('No categories found.')).toBeVisible();
  });
});

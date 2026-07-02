import { screen } from '@testing-library/react';
import { getCategories } from '@/lib/client/api/categories';
import { prepareStoreSetup } from '@/test/prepareSetup';
import CategoriesPage from './page';

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
  component: CategoriesPage,
});

describe('CategoriesPage', () => {
  beforeEach(() => {
    getCategoriesMock.mockReset();
  });

  it('renders the categories route with loaded categories', async () => {
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
      screen.getByRole('heading', { name: 'Category list' })
    ).toBeVisible();
    expect(
      await screen.findByRole('table', { name: 'Category list' })
    ).toBeVisible();
    expect(screen.getByText('Shoes')).toBeVisible();
    expect(screen.getByText('Fashion')).toBeVisible();
    expect(screen.getByText('01 Jul 2026')).toBeVisible();
  });
});

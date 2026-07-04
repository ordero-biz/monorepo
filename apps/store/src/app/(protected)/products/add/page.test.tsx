import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { productsCategoriesQueryInput } from '@/lib/hooks/products/productsCategoriesQueryConfig';
import { getServerCategories } from '@/lib/server/api/categories';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import AddProductPage from './page';

const routerPushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('@/lib/server/api/categories', () => ({
  getServerCategories: vi.fn(),
}));

const getServerCategoriesMock = vi.mocked(getServerCategories);

describe('AddProductPage', () => {
  beforeEach(() => {
    getServerCategoriesMock.mockReset();
    routerPushMock.mockReset();
  });

  it('renders the add product form with category options', async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

    getServerCategoriesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            id: 1,
            name: 'Shoes',
            sortOrder: 10,
            color: '#2563eb',
            createdAt: '2026-07-01T10:54:34.839Z',
          },
        ],
        page: {
          size: 100,
          number: 0,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    render(await AddProductPage(), {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByRole('heading', { name: 'Add product' })).toBeVisible();
    expect(getServerCategoriesMock).toHaveBeenCalledWith(
      productsCategoriesQueryInput
    );
    expect(
      screen.getByRole('textbox', { name: 'Product name' })
    ).toHaveAttribute('placeholder', 'Product name');
    expect(screen.getByRole('textbox', { name: 'Product name' })).toHaveValue(
      ''
    );
    expect(
      screen.getByRole('combobox', { name: 'Category' })
    ).toHaveTextContent('Select category');
    expect(
      screen.getByRole('combobox', { name: 'Attributes' })
    ).toHaveTextContent('Select attributes');
    await user.click(screen.getByRole('combobox', { name: 'Category' }));
    expect(screen.getByRole('option', { name: 'Shoes' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Add product image' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add product' })).toBeVisible();
  });
});

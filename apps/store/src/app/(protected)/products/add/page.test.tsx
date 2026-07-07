import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategories } from '@/lib/client/api/categories';
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

vi.mock('@/lib/client/api/categories', () => ({
  getCategories: vi.fn(),
}));

const getCategoriesMock = vi.mocked(getCategories);

describe('AddProductPage', () => {
  beforeEach(() => {
    getCategoriesMock.mockReset();
    routerPushMock.mockReset();
  });

  it('renders the add product form and loads category options when opened', async () => {
    const user = userEvent.setup();
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);

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

    render(<AddProductPage />, {
      wrapper: TestQueryProvider,
    });

    expect(screen.getByRole('heading', { name: 'Add product' })).toBeVisible();
    expect(getCategoriesMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole('textbox', { name: 'Product name' })
    ).toHaveAttribute('placeholder', 'Product name');
    expect(screen.getByRole('textbox', { name: 'Product name' })).toHaveValue(
      ''
    );
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
      ''
    );
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveAttribute(
      'placeholder',
      'Select category'
    );
    expect(
      screen.getByRole('combobox', { name: 'Attributes' })
    ).toHaveTextContent('Select attributes');
    expect(
      screen.getByRole('button', { name: 'Add product image' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add product' })).toBeVisible();

    await user.click(screen.getByRole('combobox', { name: 'Category' }));

    expect(getCategoriesMock).toHaveBeenCalledWith({
      page: 0,
      size: 100,
      sort: ['name,asc'],
    });
    expect(await screen.findByRole('option', { name: 'Shoes' })).toBeVisible();
  });
});

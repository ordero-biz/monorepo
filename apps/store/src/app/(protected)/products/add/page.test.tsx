import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategories } from '@/lib/client/api/categories';
import { useAttributesQuery } from '@/lib/hooks/attributes/useAttributesQuery';
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

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  getCategories: vi.fn(),
}));

vi.mock('@/lib/hooks/attributes/useAttributesQuery', () => ({
  useAttributesQuery: vi.fn(),
}));

const getCategoriesMock = vi.mocked(getCategories);
const useAttributesQueryMock = vi.mocked(useAttributesQuery);

describe('AddProductPage', () => {
  beforeEach(() => {
    getCategoriesMock.mockReset();
    useAttributesQueryMock.mockReset();
    routerPushMock.mockReset();
  });

  it('renders the add product form with category and attribute options', async () => {
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
    useAttributesQueryMock.mockReturnValue({
      data: {
        content: [
          {
            id: 3,
            name: 'Size',
            sortOrder: 10,
            createdAt: '2026-07-01T10:54:34.839Z',
          },
        ],
      },
      isError: false,
      isPending: false,
    } as never);

    render(<AddProductPage />, {
      wrapper: TestQueryProvider,
    });

    expect(
      screen.getByRole('heading', { name: 'Create product template' })
    ).toBeVisible();
    expect(getCategoriesMock).not.toHaveBeenCalled();
    expect(
      screen.getByRole('textbox', { name: 'Base product name' })
    ).toHaveValue('');
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
      screen.getByText(
        'Optional: Add attributes for a single product'
      )
    ).toBeVisible();
    expect(screen.getByRole('group', { name: 'Creation mode' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Single product' })
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Multiple products' })
    ).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('button', { name: 'Add product image' })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Next: Configure product' })
    ).toBeVisible();
    expect(
      screen.getByText('You will proceed to configure 1 product')
    ).toBeVisible();

    await user.click(screen.getByRole('combobox', { name: 'Category' }));

    expect(getCategoriesMock).toHaveBeenCalledWith({
      page: 0,
      size: 100,
      sort: ['name,asc'],
    });

    const shoesOption = await screen.findByRole('option', { name: 'Shoes' });

    expect(shoesOption).toBeVisible();

    await user.click(shoesOption);
    await user.click(screen.getByRole('button', { name: 'Multiple products' }));

    expect(
      screen.getByRole('button', { name: 'Next: Configure products' })
    ).toBeVisible();
    expect(
      screen.getByText(
        'You must select attributes to generate multiple products'
      )
    ).toBeVisible();
  });
});

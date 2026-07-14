import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createProduct } from '@/lib/client/api/products';
import { clientRoutes } from '@/lib/client/routes';
import type { AttributeDropdown } from '@/lib/domain/attributes';
import { productsQueryKeys } from '@/lib/query/products/productsQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateProduct } from './CreateProduct';

const mocks = vi.hoisted(() => ({
  createProduct: vi.fn(),
  push: vi.fn(),
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: mocks.push,
  }),
}));

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  createProduct: mocks.createProduct,
}));

vi.mock('./CategoriesAsyncCombobox', () => ({
  CategoriesAsyncCombobox: ({
    label,
    onValueChange,
  }: {
    label: string;
    onValueChange: (value: string | null) => void;
  }) => (
    <button onClick={() => onValueChange('2')} type="button">
      Select {label}
    </button>
  ),
}));

vi.mock('./AttributesAsyncCombobox', () => ({
  AttributesAsyncCombobox: ({
    label,
    onSelectedAttributesChange,
  }: {
    label: string;
    onSelectedAttributesChange?: (attributes: AttributeDropdown[]) => void;
  }) => (
    <button
      onClick={() =>
        onSelectedAttributesChange?.([
          {
            id: 7,
            name: 'Color',
            sortOrder: 0,
            createdAt: '2026-07-14T17:54:42.035Z',
            attributeValues: [
              {
                id: 70,
                name: 'Red',
                sortOrder: 0,
                createdAt: '2026-07-14T17:54:42.036Z',
              },
              {
                id: 71,
                name: 'Blue',
                sortOrder: 1,
                createdAt: '2026-07-14T17:54:42.036Z',
              },
            ],
          },
        ])
      }
      type="button"
    >
      Select {label}
    </button>
  ),
}));

const createProductMock = vi.mocked(createProduct);

const { setup } = prepareStoreSetup({
  component: CreateProduct,
});

const completeRequiredFields = async (
  user: ReturnType<typeof userEvent.setup>
) => {
  await user.type(
    screen.getByRole('textbox', { name: 'Base product name' }),
    'Running Shoes'
  );
  await user.click(screen.getByRole('button', { name: 'Select Category' }));
};

describe('CreateProduct', () => {
  beforeEach(() => {
    createProductMock.mockReset();
    mocks.push.mockReset();
  });

  it('requires a product name and category before continuing', async () => {
    const user = userEvent.setup();

    setup();

    const continueButton = screen.getByRole('button', {
      name: 'Next: Configure product',
    });

    expect(continueButton).toBeDisabled();

    await user.type(
      screen.getByRole('textbox', { name: 'Base product name' }),
      'Running Shoes'
    );

    expect(continueButton).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Select Category' }));

    expect(continueButton).toBeEnabled();
  });

  it('creates a product, invalidates the list, and returns to products', async () => {
    createProductMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Running Shoes',
        description: '',
        createdAt: '2026-07-03T07:20:30.291Z',
        category: {
          id: 2,
          name: 'Footwear',
          createdAt: '2026-07-01T07:20:30.291Z',
        },
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await completeRequiredFields(user);
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    expect(createProductMock).toHaveBeenCalledWith({
      categoryId: 2,
      description: '',
      name: 'Running Shoes',
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: productsQueryKeys.list,
      })
    );
    expect(mocks.push).toHaveBeenCalledWith(clientRoutes.products);
  });

  it('renders values for selected attributes', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));

    expect(screen.getByText('Color:')).toBeVisible();

    const blueValue = screen.getByRole('button', { name: 'Blue' });

    await user.click(blueValue);

    expect(screen.getByRole('button', { name: 'Red' })).toBeVisible();
    expect(blueValue).toHaveAttribute('aria-pressed', 'true');
  });

  it('prevents another product creation while the request is in flight', async () => {
    let resolveCreate:
      | ((value: Awaited<ReturnType<typeof createProduct>>) => void)
      | undefined;

    createProductMock.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    expect(
      screen.getByRole('button', { name: 'Generating products...' })
    ).toBeDisabled();

    resolveCreate?.({
      ok: true,
      data: {
        id: 3,
        name: 'Running Shoes',
        description: '',
        createdAt: '2026-07-03T07:20:30.291Z',
        category: {
          id: 2,
          name: 'Footwear',
          createdAt: '2026-07-01T07:20:30.291Z',
        },
      },
    });

    await screen.findByRole('button', { name: 'Next: Configure product' });
  });

  it('shows backend field errors without leaving the page', async () => {
    createProductMock.mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Product creation failed.',
        fieldErrors: {
          name: 'Product name already exists.',
        },
      },
    });
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    const nameField = screen.getByRole('textbox', {
      name: 'Base product name',
    });

    expect(
      await screen.findByText('Product name already exists.')
    ).toBeVisible();
    expect(nameField).toHaveAccessibleDescription(
      'Product name already exists.'
    );
    expect(
      await screen.findByRole('dialog', { name: 'Product creation failed.' })
    ).toBeVisible();
    expect(mocks.push).not.toHaveBeenCalled();
  });
});

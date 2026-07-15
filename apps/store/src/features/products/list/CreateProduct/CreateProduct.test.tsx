import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createProduct } from '@/lib/client/api/products';
import type { AttributeDropdown } from '@/lib/domain/attributes';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateProduct } from './CreateProduct';

const mocks = vi.hoisted(() => ({
  createProduct: vi.fn(),
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

  it('generates a single product preview without creating the product', async () => {
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    expect(screen.getByDisplayValue('Running Shoes Blue')).toBeInTheDocument();
    expect(screen.getByText('Attributes')).toBeVisible();
    expect(screen.getAllByText('Blue')).toHaveLength(2);
    expect(createProductMock).not.toHaveBeenCalled();
  });

  it('submits the generated product variant collection', async () => {
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

    setup();

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );
    const variantAttributes = screen.getByRole('group', {
      name: 'Attributes for Running Shoes Blue',
    });
    const removeBlueVariantAttribute = within(variantAttributes).getByRole(
      'button',
      {
        name: 'Remove Blue',
      }
    );

    await user.click(removeBlueVariantAttribute);
    await user.type(screen.getByRole('textbox', { name: 'SKU' }), 'SHOE-BLUE');
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode' }),
      'barcode-1'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    await waitFor(() =>
      expect(createProductMock).toHaveBeenCalledWith({
        name: 'Running Shoes',
        description: '',
        categoryId: 2,
        productVariants: [
          {
            name: 'Running Shoes Blue',
            description: '',
            sku: 'SHOE-BLUE',
            barcode: 'barcode-1',
            attributeValueIds: [],
          },
        ],
      })
    );
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
});

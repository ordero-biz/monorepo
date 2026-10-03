import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getProductVariants } from '@/lib/client/api/products';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductVariantsAsyncCombobox } from './ProductVariantsAsyncCombobox';
import type { ProductVariantsAsyncComboboxProps } from './types';

const mocks = vi.hoisted(() => ({
  getProductVariants: vi.fn(),
  onOptionSelect: vi.fn(),
  onValueChange: vi.fn(),
}));

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  getProductVariants: mocks.getProductVariants,
}));

const getProductVariantsMock = vi.mocked(getProductVariants);

const { setup } = prepareStoreSetup<ProductVariantsAsyncComboboxProps>({
  component: ProductVariantsAsyncCombobox,
  props: {
    'aria-label': 'Product',
    onOptionSelect: mocks.onOptionSelect,
    onValueChange: mocks.onValueChange,
    placeholder: 'Select product',
  },
});

describe('ProductVariantsAsyncCombobox', () => {
  beforeEach(() => {
    getProductVariantsMock.mockReset();
    mocks.onOptionSelect.mockReset();
    mocks.onValueChange.mockReset();
  });

  it('lets the user select a product variant and returns its resource data', async () => {
    const variant = {
      barcode: '123456789',
      createdAt: '2026-09-01T00:00:00Z',
      description: '',
      id: 11,
      name: 'Jasmine Rice 5kg',
      productVariantAttributeValues: [],
      sku: 'RICE-5KG',
    };
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [variant],
        page: {
          number: 0,
          size: 100,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Product' }));
    await user.click(
      await screen.findByRole('option', { name: 'Jasmine Rice 5kg · RICE-5KG' })
    );

    expect(getProductVariantsMock).toHaveBeenCalledWith({
      page: 1,
      size: 100,
      sort: ['name,asc'],
    });
    expect(mocks.onValueChange).toHaveBeenCalledWith('11', expect.any(Object));
    expect(mocks.onOptionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ data: variant, value: '11' })
    );
  });

  it('shows Draft only for draft product variants', async () => {
    getProductVariantsMock.mockResolvedValue({
      ok: true,
      data: {
        content: [
          {
            barcode: '111',
            createdAt: '2026-09-01T00:00:00Z',
            description: '',
            id: 11,
            name: 'Draft rice',
            productVariantAttributeValues: [],
            sku: 'RICE-DRAFT',
            status: 'DRAFT',
          },
          {
            barcode: '222',
            createdAt: '2026-09-01T00:00:00Z',
            description: '',
            id: 12,
            name: 'Active rice',
            productVariantAttributeValues: [],
            sku: 'RICE-ACTIVE',
            status: 'ACTIVE',
          },
        ],
        page: {
          number: 0,
          size: 100,
          totalElements: 2,
          totalPages: 1,
        },
      },
    });
    const user = userEvent.setup();

    setup();
    await user.click(screen.getByRole('combobox', { name: 'Product' }));

    const draftOption = await screen.findByRole('option', {
      name: /Draft rice/,
    });
    const activeOption = screen.getByRole('option', { name: /Active rice/ });

    expect(
      within(draftOption).getByText('Draft', { exact: true })
    ).toBeVisible();
    expect(
      within(activeOption).queryByText('Draft', { exact: true })
    ).toBeNull();
  });
});

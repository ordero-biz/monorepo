import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getProductVariants } from '@/lib/client/api/products';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductVariantsAsyncCombobox } from './ProductVariantsAsyncCombobox';
import type { ProductVariantsAsyncComboboxProps } from './types';

const mocks = vi.hoisted(() => ({
  getProductVariants: vi.fn(),
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
    onValueChange: mocks.onValueChange,
    placeholder: 'Product',
  },
});

describe('ProductVariantsAsyncCombobox', () => {
  beforeEach(() => {
    getProductVariantsMock.mockReset();
    mocks.onValueChange.mockReset();
  });

  it.each([
    { sku: 'RICE-5KG', displayValue: 'Jasmine Rice 5kg · RICE-5KG' },
    { sku: '', displayValue: 'Jasmine Rice 5kg' },
  ])('selects a variant and displays "$displayValue"', async ({
    sku,
    displayValue,
  }) => {
    const variant = {
      barcode: '123456789',
      createdAt: '2026-09-01T00:00:00Z',
      description: '',
      id: 11,
      name: 'Jasmine Rice 5kg',
      productVariantAttributeValues: [],
      sku,
      status: 'ACTIVE',
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
    await user.click(await screen.findByRole('option', { name: displayValue }));

    expect(screen.getByRole('combobox', { name: 'Product' })).toHaveValue(
      displayValue
    );
    expect(getProductVariantsMock).toHaveBeenCalledWith({
      page: 1,
      size: 100,
      sort: ['name,asc'],
    });
    expect(mocks.onValueChange).toHaveBeenCalledWith(
      { id: 11, name: variant.name, sku },
      expect.any(Object)
    );

    await user.clear(screen.getByRole('combobox', { name: 'Product' }));
    expect(mocks.onValueChange).toHaveBeenLastCalledWith(
      null,
      expect.any(Object)
    );
  });

  it('keeps the saved name and SKU visible when loading fails', async () => {
    getProductVariantsMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Unavailable' },
    });
    const user = userEvent.setup();
    const { onValueChange } = setup({
      value: { id: 11, name: 'Rice', sku: 'RICE' },
    });
    const input = screen.getByRole('combobox', { name: 'Product' });
    expect(input).toHaveValue('Rice · RICE');
    expect(getProductVariantsMock).not.toHaveBeenCalled();
    await user.click(input);
    expect(
      await screen.findByText("We couldn't load products right now.")
    ).toBeVisible();
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('Rice · RICE');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows Draft only for draft options and omits status from the form value', async () => {
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

    await user.click(draftOption);
    expect(mocks.onValueChange).toHaveBeenCalledWith(
      { id: 11, name: 'Draft rice', sku: 'RICE-DRAFT' },
      expect.any(Object)
    );
  });
});

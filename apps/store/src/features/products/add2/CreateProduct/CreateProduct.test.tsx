import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import type { CategoriesAsyncCombobox } from '@/features/categories';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import { createProductGroup } from '@/lib/client/api/products';
import { clientRoutes } from '@/lib/client/routes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import type { CategorySelection } from '@/lib/domain/categories/types';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateProduct } from './CreateProduct';

const mocks = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  createProductGroup: vi.fn(),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributesDropdown: vi.fn(),
}));

const color: AttributeDropdown = {
  id: 1,
  name: 'Color',
  sortOrder: 0,
  status: 'DRAFT',
  createdAt: '2026-10-21T00:00:00Z',
  attributeValues: [
    { id: 11, name: 'Blue', sortOrder: 0, createdAt: '2026-10-21T00:00:00Z' },
    { id: 12, name: 'Red', sortOrder: 1, createdAt: '2026-10-21T00:00:00Z' },
  ],
};
const material: AttributeDropdown = {
  ...color,
  id: 2,
  name: 'Material',
  attributeValues: [
    { ...color.attributeValues[0], id: 21, name: 'Cotton' },
    { ...color.attributeValues[1], id: 22, name: 'Linen' },
  ],
};

const addAttribute = async (
  user: ReturnType<typeof userEvent.setup>,
  name: string
) => {
  await user.click(screen.getByRole('button', { name: 'Add attribute' }));
  await user.click(await screen.findByRole('option', { name }));
};

const selectValues = async (
  user: ReturnType<typeof userEvent.setup>,
  { attribute, values }: { attribute: string; values: string[] }
) => {
  await user.click(
    screen.getByRole('combobox', { name: `${attribute} values` })
  );
  for (const name of values) {
    await user.click(await screen.findByRole('option', { name }));
  }
  await user.keyboard('{Escape}');
};

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock('@/features/categories', async () => ({
  ...(await vi.importActual<typeof import('@/features/categories')>(
    '@/features/categories'
  )),
  CategoriesAsyncCombobox: ({
    errorText,
    onValueChange,
    value,
  }: Pick<
    ComponentProps<typeof CategoriesAsyncCombobox>,
    'errorText' | 'value'
  > & {
    onValueChange: (value: CategorySelection | null) => void;
  }) => (
    <>
      <button
        onClick={() => onValueChange({ id: 2, name: 'Coffee and tea' })}
        type="button"
      >
        {value?.name ?? 'Select category'}
      </button>
      {errorText ? <span>{errorText}</span> : null}
    </>
  ),
}));

const { setup } = prepareStoreSetup({ component: CreateProduct });

describe('New product creation design', () => {
  beforeEach(() => {
    mocks.push.mockReset();
    vi.mocked(createProductGroup).mockReset();
    vi.mocked(getAttributesDropdown).mockReset();
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: [color, material],
    });
  });

  it('shows a load error and lets users cancel when attributes cannot be loaded', async () => {
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: false,
      error: { status: 503, message: 'Attributes unavailable' },
    });
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    expect(
      await screen.findByText("We couldn't load attributes right now.")
    ).toBeVisible();
    await user.keyboard('{Escape}');
    await user.click(
      screen.getByRole('button', { name: 'Cancel adding attribute' })
    );
    expect(screen.getByRole('button', { name: 'Add attribute' })).toBeVisible();
  });

  it('explains when no attributes are available without adding an empty group', async () => {
    vi.mocked(getAttributesDropdown).mockResolvedValue({ ok: true, data: [] });
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    expect(await screen.findByText('No attributes found')).toBeVisible();
    await user.keyboard('{Escape}');
    await user.click(
      screen.getByRole('button', { name: 'Cancel adding attribute' })
    );
    expect(
      screen.queryByRole('button', { name: /Remove .* attribute/ })
    ).not.toBeInTheDocument();
  });

  it('blocks review above the variant limit and allows it again at the limit', async () => {
    const limitAttributes: AttributeDropdown[] = [
      { id: 1, name: 'Color', count: 10 },
      { id: 2, name: 'Material', count: 10 },
      { id: 3, name: 'Size', count: 6 },
    ].map(({ id, name, count }) => ({
      ...color,
      id,
      name,
      attributeValues: Array.from({ length: count }, (_, index) => ({
        ...color.attributeValues[0],
        id: id * 100 + index,
        name: `${name} ${index + 1}`,
      })),
    }));
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: limitAttributes,
    });
    const user = userEvent.setup();
    setup();
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    for (const attribute of limitAttributes) {
      await addAttribute(user, attribute.name);
      await selectValues(user, {
        attribute: attribute.name,
        values: attribute.attributeValues.map((value) => value.name),
      });
    }
    expect(screen.getByText('More than 500 variants')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Review variants' })
    ).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Remove Size 6' }));
    expect(screen.getByText('500 variants')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Review variants' })
    ).toBeEnabled();
  }, 30000);

  it('saves the reviewed product, refreshes product lists, and returns to products', async () => {
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Shirt',
        description: '',
        createdAt: '2026-10-25T00:00:00Z',
        category: {
          id: 2,
          name: 'Coffee and tea',
          createdAt: '2026-10-25T00:00:00Z',
        },
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    await screen.findByRole('form', { name: 'Product configuration' });
    await user.type(screen.getByRole('textbox', { name: 'SKU' }), 'SHIRT-1');
    await user.type(screen.getByRole('textbox', { name: 'Barcode' }), '123456');
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    await waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith(clientRoutes.products)
    );
    expect(createProductGroup).toHaveBeenCalledWith({
      categoryId: 2,
      name: 'Shirt',
      status: 'DRAFT',
      productVariants: [
        {
          name: 'Shirt',
          status: 'DRAFT',
          sku: 'SHIRT-1',
          barcode: '123456',
          attributeValueIds: [],
        },
      ],
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: productGroupsQueryKeys.list,
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: productVariantsQueryKeys.list,
    });
  }, 15000);

  it('keeps the review open and shows backend field errors when saving fails', async () => {
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: false,
      error: {
        status: 422,
        message: 'Product creation failed.',
        fieldErrors: { 'productVariants[0].sku': 'SKU already exists.' },
      },
    });
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    await screen.findByRole('form', { name: 'Product configuration' });
    await user.type(screen.getByRole('textbox', { name: 'SKU' }), 'SHIRT-1');
    await user.type(screen.getByRole('textbox', { name: 'Barcode' }), '123456');
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(await screen.findByText('SKU already exists.')).toBeVisible();
    expect(
      screen.getByRole('form', { name: 'Product configuration' })
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Product generation' })
    ).not.toBeInTheDocument();
    expect(mocks.push).not.toHaveBeenCalled();
  }, 15000);

  it('replaces the attribute picker with values, prevents duplicates, and clears removed values', async () => {
    const user = userEvent.setup();
    setup();

    expect(
      screen.queryByRole('combobox', { name: 'Attribute' })
    ).not.toBeInTheDocument();
    await addAttribute(user, 'Color');
    expect(
      screen.queryByRole('combobox', { name: 'Attribute' })
    ).not.toBeInTheDocument();
    const values = screen.getByRole('combobox', { name: 'Color values' });
    expect(values).toBeVisible();
    expect(values).toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Color' })).toBeVisible();
    expect(screen.queryByText('Values for Color')).not.toBeInTheDocument();
    expect(values).toHaveAccessibleDescription(
      'Choose one or more color values'
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      'Color added. Select its values.'
    );
    await user.tab({ shift: true });
    expect(values).not.toHaveFocus();
    await user.click(screen.getByText('Color'));
    expect(values).toHaveFocus();
    await user.keyboard('{Escape}');
    await selectValues(user, { attribute: 'Color', values: ['Blue'] });
    expect(
      screen.queryByText('Choose one or more color values')
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    expect(
      await screen.findByRole('option', { name: 'Color' })
    ).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('option', { name: 'Material' }));
    await selectValues(user, { attribute: 'Material', values: ['Cotton'] });
    await user.click(
      screen.getByRole('button', { name: 'Remove Color attribute' })
    );
    expect(
      screen.queryByRole('combobox', { name: 'Color values' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Cotton' })).toBeVisible();

    await addAttribute(user, 'Color');
    expect(
      screen.queryByRole('button', { name: 'Remove Blue' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Cotton' })).toBeVisible();
  }, 15000);

  it('can cancel adding an attribute without changing existing selections', async () => {
    const user = userEvent.setup();
    setup();
    await addAttribute(user, 'Color');
    await selectValues(user, { attribute: 'Color', values: ['Blue'] });
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    await user.keyboard('{Escape}');
    await user.click(
      screen.getByRole('button', { name: 'Cancel adding attribute' })
    );
    expect(
      screen.queryByRole('combobox', { name: 'Attribute' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add attribute' })).toBeVisible();
  });

  it('requires an attribute and selected values for combinations, then generates their combinations', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      await screen.findByText('Select at least one attribute.')
    ).toBeVisible();
    await addAttribute(user, 'Color');
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      await screen.findByText('Select at least one attribute value.')
    ).toBeVisible();
    await selectValues(user, { attribute: 'Color', values: ['Blue', 'Red'] });
    await addAttribute(user, 'Material');
    await selectValues(user, {
      attribute: 'Material',
      values: ['Cotton', 'Linen'],
    });
    expect(
      screen.queryByText('Select at least one attribute.')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Select at least one attribute value.')
    ).not.toBeInTheDocument();
    expect(
      within(
        screen.getByRole('complementary', { name: 'Variant summary' })
      ).getByText('4 variants')
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Review variants' }));

    const configuration = await screen.findByRole('form', {
      name: 'Product configuration',
    });
    for (const name of [
      'Shirt Blue Cotton',
      'Shirt Blue Linen',
      'Shirt Red Cotton',
      'Shirt Red Linen',
    ]) {
      expect(within(configuration).getByRole('button', { name })).toBeVisible();
    }
  }, 15000);

  it('keeps all selected values on a single generated variant in single mode', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await addAttribute(user, 'Color');
    await selectValues(user, { attribute: 'Color', values: ['Blue', 'Red'] });
    expect(
      screen.getByText('Your selected values will stay together in one variant')
    ).toBeVisible();
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    expect(
      screen.queryByText(
        'Your selected values will stay together in one variant'
      )
    ).not.toBeInTheDocument();
    expect(screen.getByText('2 variants')).toBeVisible();
    await user.click(screen.getByRole('radio', { name: 'Single variant' }));
    expect(
      screen.getByText('Your selected values will stay together in one variant')
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Review variants' }));

    const configuration = await screen.findByRole('form', {
      name: 'Product configuration',
    });
    expect(
      within(configuration).getByRole('button', {
        name: 'Shirt Blue Red',
      })
    ).toBeVisible();
    expect(screen.getByText('1 product variant ready')).toBeVisible();
    expect(screen.getByText('Step 2 of 2 · Review & create')).toBeVisible();
    expect(
      screen.queryByText('Step 1 of 2 · Product setup')
    ).not.toBeInTheDocument();
  });

  it('lets users choose how variants are generated', async () => {
    const user = userEvent.setup();
    setup();
    expect(screen.getByText('Step 1 of 2 · Product setup')).toBeVisible();
    expect(
      within(
        screen.getByRole('complementary', {
          name: 'Product generation actions',
        })
      ).getByText('You’ll review variants before creating the product')
    ).toBeVisible();

    const singleVariant = screen.getByRole('radio', { name: 'Single variant' });
    const valueCombinations = screen.getByRole('radio', {
      name: 'Multiple variants',
    });
    expect(singleVariant).toBeChecked();
    expect(valueCombinations).not.toBeChecked();
    expect(singleVariant).toHaveAccessibleDescription(
      'Create one variant containing all selected values'
    );
    expect(valueCombinations).toHaveAccessibleDescription(
      'Create a separate variant for each combination of selected values'
    );
    expect(
      screen.queryByText(
        'Your selected values will stay together in one variant'
      )
    ).not.toBeInTheDocument();
    expect(screen.getByText('1 variant')).toBeVisible();

    await user.click(valueCombinations);
    expect(valueCombinations).toBeChecked();
    expect(singleVariant).not.toBeChecked();
    expect(
      screen.getByText(
        'Add an attribute and select its values to generate variants'
      )
    ).toBeVisible();

    await user.click(screen.getByText('Single variant'));
    expect(singleVariant).toBeChecked();
    expect(valueCombinations).not.toBeChecked();
  });

  it('validates required shared details before continuing to variants', async () => {
    const user = userEvent.setup();
    setup();

    expect(
      screen.queryByText('Product name is required')
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Review variants' }));

    expect(await screen.findByText('Product name is required')).toBeVisible();
    expect(screen.getByText('Category is required')).toBeVisible();
    expect(
      screen.getByRole('form', { name: 'Product generation' })
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Product configuration' })
    ).not.toBeInTheDocument();
  });

  it('clears attribute errors when switching to single mode after a failed submission', async () => {
    const user = userEvent.setup();
    setup();

    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      await screen.findByText('Select at least one attribute.')
    ).toBeVisible();

    await user.click(screen.getByRole('radio', { name: 'Single variant' }));
    expect(
      screen.queryByText('Select at least one attribute.')
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      await screen.findByRole('form', { name: 'Product configuration' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Shirt' })).toBeVisible();
  });

  it('clears value errors in single mode and restores them when switching back to multiple mode', async () => {
    const user = userEvent.setup();
    setup();

    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await addAttribute(user, 'Color');
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      await screen.findByText('Select at least one attribute value.')
    ).toBeVisible();

    await user.click(screen.getByRole('radio', { name: 'Single variant' }));
    expect(
      screen.queryByText('Select at least one attribute value.')
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    expect(
      await screen.findByText('Select at least one attribute value.')
    ).toBeVisible();
    await user.click(screen.getByRole('radio', { name: 'Single variant' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      await screen.findByRole('form', { name: 'Product configuration' })
    ).toBeVisible();
  });

  it('reveals name validation on blur and updates it while correcting the name', async () => {
    const user = userEvent.setup();
    setup();
    const name = screen.getByRole('textbox', { name: 'Product name' });

    await user.type(name, ' ');
    expect(
      screen.queryByText('Product name is required')
    ).not.toBeInTheDocument();
    await user.tab();
    expect(await screen.findByText('Product name is required')).toBeVisible();
    await user.type(name, 'Shirt');
    expect(
      screen.queryByText('Product name is required')
    ).not.toBeInTheDocument();
    await user.clear(name);
    expect(await screen.findByText('Product name is required')).toBeVisible();
  });

  it('continues to variant configuration with the entered shared details', async () => {
    const user = userEvent.setup();
    setup();

    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Kilograms coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'Freshly roasted coffee.'
    );
    await user.click(screen.getByRole('button', { name: 'Review variants' }));

    const configuration = await screen.findByRole('form', {
      name: 'Product configuration',
    });
    expect(
      within(configuration).getByRole('textbox', { name: 'Base product name' })
    ).toHaveValue('Kilograms coffee');
    expect(
      within(
        within(configuration).getByRole('region', { name: 'Common product' })
      ).getByRole('textbox', {
        name: 'Description',
      })
    ).toHaveValue('Freshly roasted coffee.');
    expect(
      within(configuration).getByRole('button', { name: 'Coffee and tea' })
    ).toBeVisible();
    expect(
      within(configuration).getByRole('button', { name: 'Kilograms coffee' })
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Product generation' })
    ).not.toBeInTheDocument();
  });
});

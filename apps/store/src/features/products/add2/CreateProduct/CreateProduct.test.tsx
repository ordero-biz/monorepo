import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import type { CategoriesAsyncCombobox } from '@/features/categories';
import {
  getAttribute,
  getAttributesDropdown,
  getAttributeValues,
  updateAttributeValue,
} from '@/lib/client/api/attributes';
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
  getAttribute: vi.fn(),
  getAttributeValues: vi.fn(),
  updateAttributeValue: vi.fn(),
}));

const color: AttributeDropdown = {
  id: 1,
  name: 'Color',
  sortOrder: 0,
  status: 'ACTIVE',
  createdAt: '2026-10-21T00:00:00Z',
  attributeValues: [
    {
      id: 11,
      name: 'Blue',
      sortOrder: 0,
      status: 'ACTIVE',
      createdAt: '2026-10-21T00:00:00Z',
    },
    {
      id: 12,
      name: 'Red',
      sortOrder: 1,
      status: 'ACTIVE',
      createdAt: '2026-10-21T00:00:00Z',
    },
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
  await user.click(
    await screen.findByRole('option', { name: new RegExp(`^${name}\\b`) })
  );
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
    invalid,
    errorText,
    onValueChange,
    value,
  }: Pick<
    ComponentProps<typeof CategoriesAsyncCombobox>,
    'errorText' | 'invalid' | 'value'
  > & {
    onValueChange: (value: CategorySelection | null) => void;
  }) => (
    <>
      <button
        aria-invalid={invalid}
        onClick={() =>
          onValueChange({ id: 2, name: 'Coffee and tea', status: 'ACTIVE' })
        }
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
    vi.mocked(getAttribute).mockReset();
    vi.mocked(getAttributeValues).mockReset();
    vi.mocked(updateAttributeValue).mockReset();
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: [color, material],
    });
  });

  it.each([
    'DRAFT',
    'ACTIVE',
  ] as const)('generates variants with the reviewed value name when its current status is %s', async (status) => {
    const draft = { ...color.attributeValues[0], status: 'DRAFT' as const };
    const renamed = { ...draft, name: 'Navy', status };
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: [{ ...color, attributeValues: [draft, color.attributeValues[1]] }],
    });
    vi.mocked(getAttribute).mockResolvedValue({ ok: true, data: color });
    vi.mocked(getAttributeValues).mockResolvedValue({
      ok: true,
      data: [renamed, color.attributeValues[1]],
    });
    vi.mocked(updateAttributeValue).mockResolvedValue({
      ok: true,
      data: { ...renamed, status: 'ACTIVE' },
    });
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    await addAttribute(user, 'Color');
    await selectValues(user, { attribute: 'Color', values: ['Red'] });
    await user.click(screen.getByRole('combobox', { name: 'Color values' }));
    await user.click(screen.getByRole('option', { name: 'Blue Draft' }));
    const dialog = await screen.findByRole('dialog', {
      name:
        status === 'ACTIVE'
          ? 'Select attribute value'
          : 'Activate attribute value?',
    });
    const confirm = within(dialog).getByRole('button', {
      name: status === 'ACTIVE' ? 'Select value' : 'Activate and select',
    });
    await waitFor(() => expect(confirm).toBeEnabled());
    expect(within(dialog).getByText('Navy')).toBeVisible();
    await user.click(confirm);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(screen.getByRole('button', { name: 'Remove Navy' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      await screen.findByRole('button', { name: 'Show details: Shirt Navy' })
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Show details: Shirt Red' })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Show details: Shirt Blue' })
    ).not.toBeInTheDocument();
  });

  it('submits reviewed attribute changes only for the edited variant', async () => {
    const draftCotton = {
      ...material.attributeValues[0],
      status: 'DRAFT' as const,
    };
    const draftMaterial = {
      ...material,
      attributeValues: [draftCotton, material.attributeValues[1]],
    };
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: [color, draftMaterial],
    });
    vi.mocked(getAttribute).mockResolvedValue({
      ok: true,
      data: draftMaterial,
    });
    vi.mocked(getAttributeValues).mockResolvedValue({
      ok: true,
      data: draftMaterial.attributeValues,
    });
    vi.mocked(updateAttributeValue).mockResolvedValue({
      ok: true,
      data: { ...draftCotton, name: 'Pima Cotton', status: 'ACTIVE' },
    });
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: false,
      error: { status: 503, message: 'Unavailable' },
    });
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    await addAttribute(user, 'Color');
    await selectValues(user, { attribute: 'Color', values: ['Blue', 'Red'] });
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    await user.click(
      await screen.findByRole('button', { name: 'Show details: Shirt Blue' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Edit attributes for Shirt Blue' })
    );
    await addAttribute(user, 'Material');
    await user.click(screen.getByRole('combobox', { name: 'Material' }));
    await user.click(screen.getByRole('option', { name: 'Cotton Draft' }));
    const review = await screen.findByRole('dialog', {
      name: 'Activate attribute value?',
    });
    const activate = within(review).getByRole('button', {
      name: 'Activate and select',
    });
    await waitFor(() => expect(activate).toBeEnabled());
    await user.click(activate);
    await waitFor(() => expect(review).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      screen.getByRole('button', { name: 'Remove Pima Cotton' })
    ).toBeVisible();
    expect(screen.queryByText('SKU is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Barcode is required')).not.toBeInTheDocument();
    expect(createProductGroup).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeVisible();
    await user.click(
      screen.getByRole('button', { name: 'Edit attributes for Shirt Blue' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Remove Color attribute' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(screen.queryByText('SKU is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Barcode is required')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove Blue' })
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Edit attributes for Shirt Blue' })
    );
    expect(screen.getByRole('combobox', { name: 'Material' })).toHaveValue(
      'Pima Cotton'
    );
    expect(
      screen.queryByRole('combobox', { name: 'Color' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await user.click(
      screen.getByRole('button', { name: 'Show details: Shirt Red' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Edit attributes for Shirt Red' })
    );
    expect(screen.getByRole('combobox', { name: 'Color' })).toHaveValue('Red');
    expect(
      screen.queryByRole('combobox', { name: 'Material' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    await user.click(
      screen.getByRole('button', { name: 'Hide details: Shirt Blue' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Hide details: Shirt Red' })
    );
    for (const index of [1, 2]) {
      await user.type(
        screen.getByRole('textbox', { name: `SKU for variant ${index}` }),
        `SHIRT-${index}`
      );
      await user.type(
        screen.getByRole('textbox', { name: `Barcode for variant ${index}` }),
        `100${index}`
      );
    }
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    await waitFor(() =>
      expect(createProductGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          productVariants: [
            expect.objectContaining({
              name: 'Shirt Blue',
              attributeValueIds: [21],
            }),
            expect.objectContaining({
              name: 'Shirt Red',
              attributeValueIds: [12],
            }),
          ],
        })
      )
    );
  }, 15000);

  it('allows adding attributes in review when none were selected in setup', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    await user.click(
      await screen.findByRole('button', { name: 'Show details: Shirt' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Add attributes for Shirt' })
    );
    await addAttribute(user, 'Color');
    await user.click(screen.getByRole('combobox', { name: 'Color' }));
    await user.click(screen.getByRole('option', { name: 'Blue' }));
    await user.click(screen.getByRole('option', { name: 'Red' }));
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove Red' })).toBeVisible();
    await user.click(
      screen.getByRole('button', { name: 'Edit attributes for Shirt' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Remove Color attribute' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    await user.click(
      screen.getByRole('button', { name: 'Add attributes for Shirt' })
    );
    expect(
      screen.queryByRole('combobox', { name: 'Color' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add attribute' })).toBeVisible();
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

  it('carries the product status from setup into creation while generated variants remain Draft', async () => {
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: false,
      error: { message: 'Try again', status: 500 },
    });
    const user = userEvent.setup();
    setup();
    expect(screen.getByRole('radio', { name: /^Draft/ })).toBeChecked();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: /^Active/ }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      screen.getByText('Only active variants can be supplied and sold.')
    ).toBeVisible();
    const variantStatus = screen.getByRole('combobox', {
      name: 'Status for variant 1',
    });
    expect(variantStatus).toHaveTextContent('Draft');
    await user.click(variantStatus);
    expect(
      await screen.findByRole('option', { name: 'Active' })
    ).not.toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Escape}');
    await user.type(
      screen.getByRole('textbox', { name: 'SKU for variant 1' }),
      'COFFEE'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode for variant 1' }),
      '1001'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    await waitFor(() =>
      expect(createProductGroup).toHaveBeenCalledWith({
        categoryId: 2,
        name: 'Coffee',
        status: 'ACTIVE',
        productVariants: [
          {
            name: 'Coffee',
            sku: 'COFFEE',
            barcode: '1001',
            status: 'DRAFT',
            attributeValueIds: [],
          },
        ],
      })
    );
  });

  it('explains the draft restriction and enables active variants only after applying an active product status', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    expect(
      screen.getByText(
        'Cannot be supplied or sold. All variants must remain Draft.'
      )
    ).toBeVisible();
    const variantStatus = screen.getByRole('combobox', {
      name: 'Status for variant 1',
    });
    await user.click(variantStatus);
    expect(
      await screen.findByRole('option', { name: 'Active' })
    ).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.getByRole('option', { name: 'Active' })
    ).toHaveAccessibleDescription(
      'Product is Draft. Change its status in Product details.'
    );
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    const details = screen.getByRole('region', { name: 'Product details' });
    await waitFor(() =>
      expect(
        within(details).getByRole('textbox', { name: 'Product name' })
      ).toHaveFocus()
    );
    expect(
      within(details).getByText(
        'Save for further editing. The product cannot be supplied or sold, and all variants must remain Draft.'
      )
    ).toBeVisible();
    expect(
      within(details).getByText(
        'Allow active variants to be supplied and sold. Draft variants remain unavailable and can be activated later.'
      )
    ).toBeVisible();
    await user.click(within(details).getByRole('radio', { name: /^Active/ }));
    await user.click(variantStatus);
    expect(
      await screen.findByRole('option', { name: 'Active' })
    ).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Escape}');
    await user.click(within(details).getByRole('button', { name: 'Cancel' }));
    expect(
      screen.getByText(
        'Cannot be supplied or sold. All variants must remain Draft.'
      )
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    await user.click(within(details).getByRole('radio', { name: /^Active/ }));
    await user.click(
      within(details).getByRole('button', { name: 'Apply changes' })
    );
    expect(
      screen.getByText('Only active variants can be supplied and sold.')
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Edit product status' })
    ).not.toBeInTheDocument();
    expect(variantStatus).toHaveTextContent('Draft');
    await user.click(variantStatus);
    expect(
      await screen.findByRole('option', { name: 'Active' })
    ).not.toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.queryByText(
        'Product is Draft. Change its status in Product details.'
      )
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Active' }));
    expect(variantStatus).toHaveTextContent('Active');
    expect(createProductGroup).not.toHaveBeenCalled();
  });

  it('confirms active variant changes only on Apply and preserves variants on Cancel or invalid shared details', async () => {
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: false,
      error: { message: 'Try again', status: 500 },
    });
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Shirt'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: 'Multiple variants' }));
    await addAttribute(user, 'Color');
    await selectValues(user, { attribute: 'Color', values: ['Blue', 'Red'] });
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    const details = screen.getByRole('region', { name: 'Product details' });
    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    await user.click(within(details).getByRole('radio', { name: /^Active/ }));
    await user.click(
      within(details).getByRole('button', { name: 'Apply changes' })
    );
    for (const index of [1, 2]) {
      await user.type(
        screen.getByRole('textbox', { name: `SKU for variant ${index}` }),
        `SKU-${index}`
      );
      await user.type(
        screen.getByRole('textbox', { name: `Barcode for variant ${index}` }),
        `100${index}`
      );
    }
    const firstStatus = screen.getByRole('combobox', {
      name: 'Status for variant 1',
    });
    const secondStatus = screen.getByRole('combobox', {
      name: 'Status for variant 2',
    });
    await user.click(firstStatus);
    await user.click(screen.getByRole('option', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    await waitFor(() =>
      expect(createProductGroup).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ACTIVE',
          productVariants: [
            expect.objectContaining({ status: 'ACTIVE' }),
            expect.objectContaining({ status: 'DRAFT' }),
          ],
        })
      )
    );
    vi.mocked(createProductGroup).mockClear();
    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    await user.click(within(details).getByRole('radio', { name: /^Draft/ }));
    expect(
      screen.getByText('1 active variant will also be changed to Draft.')
    ).toBeVisible();
    expect(firstStatus).toHaveTextContent('Active');
    await user.click(within(details).getByRole('radio', { name: /^Active/ }));
    expect(
      screen.queryByText('1 active variant will also be changed to Draft.')
    ).not.toBeInTheDocument();
    expect(
      within(details).getByRole('button', { name: 'Apply changes' })
    ).toBeVisible();
    await user.click(within(details).getByRole('radio', { name: /^Draft/ }));
    await user.click(within(details).getByRole('button', { name: 'Cancel' }));
    expect(firstStatus).toHaveTextContent('Active');
    expect(
      screen.getByText('Only active variants can be supplied and sold.')
    ).toBeVisible();
    await user.click(secondStatus);
    await user.click(screen.getByRole('option', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    await user.click(within(details).getByRole('radio', { name: /^Draft/ }));
    expect(
      screen.getByText('2 active variants will also be changed to Draft.')
    ).toBeVisible();
    const name = within(details).getByRole('textbox', { name: 'Product name' });
    await user.clear(name);
    await user.click(
      within(details).getByRole('button', {
        name: 'Apply and set 2 variants to Draft',
      })
    );
    expect(screen.getByText('Product name is required')).toBeVisible();
    expect(firstStatus).toHaveTextContent('Active');
    expect(secondStatus).toHaveTextContent('Active');
    await user.type(name, 'Shirt');
    await user.click(
      within(details).getByRole('button', {
        name: 'Apply and set 2 variants to Draft',
      })
    );
    expect(firstStatus).toHaveTextContent('Draft');
    expect(secondStatus).toHaveTextContent('Draft');
    expect(
      screen.getByText(
        'Cannot be supplied or sold. All variants must remain Draft.'
      )
    ).toBeVisible();
    expect(createProductGroup).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    await waitFor(() =>
      expect(createProductGroup).toHaveBeenCalledWith({
        categoryId: 2,
        name: 'Shirt',
        status: 'DRAFT',
        productVariants: [
          {
            name: 'Shirt Blue',
            sku: 'SKU-1',
            barcode: '1001',
            status: 'DRAFT',
            attributeValueIds: [11],
          },
          {
            name: 'Shirt Red',
            sku: 'SKU-2',
            barcode: '1002',
            status: 'DRAFT',
            attributeValueIds: [12],
          },
        ],
      })
    );
  }, 15000);

  it.each([
    false,
    true,
  ])('retries after setting a rejected active variant to Draft (unrelated SKU error: %s)', async (hasSkuError) => {
    vi.mocked(createProductGroup).mockResolvedValueOnce({
      ok: false,
      error: {
        status: 422,
        message: 'Product creation failed.',
        fieldErrors: {
          'productVariants[0].status': 'Variant cannot be activated.',
          ...(hasSkuError
            ? { 'productVariants[0].sku': 'SKU already exists.' }
            : {}),
        },
      },
    });
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Try again' },
    });
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('radio', { name: /^Active/ }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    const sku = screen.getByRole('textbox', { name: 'SKU for variant 1' });
    await user.type(sku, 'COFFEE');
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode for variant 1' }),
      '1001'
    );
    const variantStatus = screen.getByRole('combobox', {
      name: 'Status for variant 1',
    });
    await user.click(variantStatus);
    await user.click(screen.getByRole('option', { name: 'Active' }));
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(
      await screen.findByText('Variant cannot be activated.')
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    const details = screen.getByRole('region', { name: 'Product details' });
    await user.click(within(details).getByRole('radio', { name: /^Draft/ }));
    await user.click(
      within(details).getByRole('button', {
        name: 'Apply and set 1 variant to Draft',
      })
    );
    expect(variantStatus).toHaveTextContent('Draft');
    expect(
      screen.queryByText('Variant cannot be activated.')
    ).not.toBeInTheDocument();
    if (hasSkuError) {
      expect(screen.getByText('SKU already exists.')).toBeVisible();
      await user.click(screen.getByRole('button', { name: 'Create product' }));
      expect(createProductGroup).toHaveBeenCalledTimes(1);
      await user.type(sku, '-NEW');
    }
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    await waitFor(() => expect(createProductGroup).toHaveBeenCalledTimes(2));
    expect(createProductGroup).toHaveBeenLastCalledWith({
      categoryId: 2,
      name: 'Coffee',
      status: 'DRAFT',
      productVariants: [
        {
          name: 'Coffee',
          sku: hasSkuError ? 'COFFEE-NEW' : 'COFFEE',
          barcode: '1001',
          status: 'DRAFT',
          attributeValueIds: [],
        },
      ],
    });
  });

  it('saves applied product details without changing variants, refreshes lists, and returns to products', async () => {
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
    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    const product = screen.getByRole('region', { name: 'Product details' });
    const productName = within(product).getByRole('textbox', {
      name: 'Product name',
    });
    await user.clear(productName);
    await user.type(productName, 'Updated shirt');
    await user.type(
      within(product).getByRole('textbox', { name: 'Description' }),
      'Product description'
    );
    await user.click(within(product).getByRole('radio', { name: /^Active/ }));
    await user.keyboard('{Enter}');
    expect(createProductGroup).not.toHaveBeenCalled();
    await user.click(
      within(product).getByRole('button', { name: 'Apply changes' })
    );
    const variantName = screen.getByRole('textbox', {
      name: 'Variant name for variant 1',
    });
    await user.clear(variantName);
    await user.type(variantName, 'Updated shirt variant');
    await user.type(
      screen.getByRole('textbox', { name: 'SKU for variant 1' }),
      'SHIRT-1'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode for variant 1' }),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    await waitFor(() =>
      expect(mocks.push).toHaveBeenCalledWith(clientRoutes.products)
    );
    expect(createProductGroup).toHaveBeenCalledWith({
      categoryId: 2,
      name: 'Updated shirt',
      description: 'Product description',
      status: 'ACTIVE',
      productVariants: [
        {
          name: 'Updated shirt variant',
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
    await user.type(
      screen.getByRole('textbox', { name: 'SKU for variant 1' }),
      'SHIRT-1'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode for variant 1' }),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(await screen.findByText('SKU already exists.')).toBeVisible();
    expect(
      screen.getByRole('form', { name: 'Product configuration' })
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Product generation' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Product summary' })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Apply changes' })
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
      await screen.findByRole('option', { name: /^Color\b/ })
    ).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('option', { name: /^Material\b/ }));
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
    expect(screen.getByText('4 variants')).toBeVisible();
    for (const name of [
      'Shirt Blue Cotton',
      'Shirt Blue Linen',
      'Shirt Red Cotton',
      'Shirt Red Linen',
    ]) {
      expect(
        within(configuration).getByRole('button', {
          name: new RegExp(`^(Show|Hide) details: ${name}$`),
        })
      ).toBeVisible();
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
    const detailsToggle = within(configuration).getByRole('button', {
      name: /^(Show|Hide) details: Shirt Blue Red$/,
    });
    await user.click(detailsToggle);
    await user.click(screen.getByRole('button', { name: 'Remove Blue' }));
    await user.click(detailsToggle);
    expect(
      screen.queryByRole('button', { name: 'Remove Red', hidden: true })
    ).not.toBeInTheDocument();
    await user.click(detailsToggle);
    expect(screen.getByRole('button', { name: 'Remove Red' })).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Remove Blue' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('You’re creating 1 product with 1 variant')
    ).toBeVisible();
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
    expect(
      screen.getByRole('button', { name: /^(Show|Hide) details: Shirt$/ })
    ).toBeVisible();
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
    const product = within(configuration).getByRole('region', {
      name: 'Product details',
    });
    const summary = within(product).getByRole('region', {
      name: 'Product summary',
    });
    for (const label of [
      'Product name',
      'Category',
      'Description',
      'Product status after creation',
    ]) {
      expect(within(summary).getByText(label)).toBeVisible();
    }
    expect(within(summary).getByText('Draft')).toBeVisible();
    expect(within(summary).getByText('Kilograms coffee')).toBeVisible();
    expect(within(summary).getByText('Coffee and tea')).toBeVisible();
    expect(within(summary).getByText('Freshly roasted coffee.')).toBeVisible();
    expect(within(product).getByText('1 variant')).toBeVisible();
    expect(within(product).getByText('No image')).toBeVisible();
    expect(within(product).queryByRole('textbox')).not.toBeInTheDocument();

    await user.click(
      within(product).getByRole('button', { name: 'Edit details' })
    );
    expect(
      within(product).queryByRole('region', { name: 'Product summary' })
    ).not.toBeInTheDocument();
    await waitFor(() =>
      expect(
        within(product).getByRole('textbox', { name: 'Product name' })
      ).toHaveFocus()
    );
    expect(
      within(product).getByRole('textbox', { name: 'Product name' })
    ).toHaveValue('Kilograms coffee');
    expect(
      within(product).getByRole('textbox', { name: 'Description' })
    ).toHaveValue('Freshly roasted coffee.');
    expect(
      within(product).getByRole('button', { name: 'Coffee and tea' })
    ).toBeVisible();
    expect(
      within(configuration).getByRole('button', {
        name: /^(Show|Hide) details: Kilograms coffee$/,
      })
    ).toBeVisible();
    expect(
      screen.queryByRole('form', { name: 'Product generation' })
    ).not.toBeInTheDocument();
  });

  it('updates shared details without regenerating variants and keeps invalid fields open', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    const product = await screen.findByRole('region', {
      name: 'Product details',
    });
    expect(within(product).getByText('No description added')).toBeVisible();
    await user.click(
      within(product).getByRole('button', { name: 'Edit details' })
    );
    const name = within(product).getByRole('textbox', {
      name: 'Product name',
    });
    await user.clear(name);
    await user.tab();
    expect(
      await within(product).findByText('Product name is required')
    ).toBeVisible();
    expect(
      within(product).getByRole('button', { name: 'Apply changes' })
    ).toBeEnabled();
    await user.click(
      within(product).getByRole('button', { name: 'Apply changes' })
    );
    expect(name).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Create product' })
    ).toBeDisabled();
    await user.type(name, 'Roasted coffee');
    await user.type(
      within(product).getByRole('textbox', { name: 'Description' }),
      'Fresh coffee.'
    );
    await user.click(within(product).getByRole('radio', { name: /^Active/ }));
    expect(
      within(product).queryByRole('region', { name: 'Product summary' })
    ).not.toBeInTheDocument();
    expect(within(product).getByText('Editing')).toBeVisible();
    expect(
      within(product).getByRole('radiogroup', { name: 'Status after creation' })
    ).toBeVisible();
    await user.click(
      within(product).getByRole('button', { name: 'Apply changes' })
    );
    const summary = within(product).getByRole('region', {
      name: 'Product summary',
    });
    expect(within(summary).getByText('Active')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Create product' })
    ).toBeEnabled();
    expect(within(product).getByText('Roasted coffee')).toBeVisible();
    expect(
      within(
        within(product).getByRole('region', { name: 'Product summary' })
      ).getByText('Fresh coffee.')
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: /^(Show|Hide) details: Coffee$/ })
    ).toBeVisible();
    expect(within(product).queryByRole('textbox')).not.toBeInTheDocument();
    await user.click(
      within(product).getByRole('button', { name: 'Edit details' })
    );
    expect(
      within(product).getByRole('textbox', { name: 'Product name' })
    ).toHaveValue('Roasted coffee');
    expect(
      within(product).getByRole('textbox', { name: 'Description' })
    ).toHaveValue('Fresh coffee.');
    expect(createProductGroup).not.toHaveBeenCalled();
  });

  it('discards edits and validation errors on Cancel without changing product or variant details', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'Original description'
    );
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    const product = await screen.findByRole('region', {
      name: 'Product details',
    });
    await user.click(
      within(product).getByRole('button', { name: 'Edit details' })
    );
    await user.clear(
      within(product).getByRole('textbox', { name: 'Product name' })
    );
    await user.type(
      within(product).getByRole('textbox', { name: 'Description' }),
      ' changed'
    );
    await user.click(within(product).getByRole('radio', { name: /^Active/ }));
    await user.click(
      within(product).getByRole('button', { name: 'Apply changes' })
    );
    expect(
      await within(product).findByText('Product name is required')
    ).toBeVisible();
    await user.click(within(product).getByRole('button', { name: 'Cancel' }));
    const summary = within(product).getByRole('region', {
      name: 'Product summary',
    });
    expect(within(summary).getByText('Coffee')).toBeVisible();
    expect(within(summary).getByText('Original description')).toBeVisible();
    expect(within(summary).getByText('Draft')).toBeVisible();
    expect(
      within(product).queryByText('Product name is required')
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create product' })
    ).toBeEnabled();
    expect(
      within(product).getByRole('button', { name: 'Edit details' })
    ).toHaveFocus();
    await user.click(
      within(product).getByRole('button', { name: 'Edit details' })
    );
    expect(
      within(product).getByRole('textbox', { name: 'Product name' })
    ).toHaveValue('Coffee');
    expect(
      within(product).getByRole('textbox', { name: 'Description' })
    ).toHaveValue('Original description');
    expect(
      within(product).getByRole('radio', { name: /^Draft/ })
    ).toBeChecked();
    expect(createProductGroup).not.toHaveBeenCalled();
  });

  it('keeps the summary visible when the service returns only a general error', async () => {
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: false,
      error: { status: 503, message: 'Service unavailable. Try again.' },
    });
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    await user.type(
      screen.getByRole('textbox', { name: 'SKU for variant 1' }),
      'COFFEE-1'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode for variant 1' }),
      '123456'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(
      await screen.findByText('Service unavailable. Try again.')
    ).toBeVisible();
    expect(
      screen.getByRole('region', { name: 'Product summary' })
    ).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Apply changes' })
    ).not.toBeInTheDocument();
  });
  it('edits variant names inline and preserves collapsed details without opening them for name errors', async () => {
    const user = userEvent.setup();
    setup();
    await user.type(
      screen.getByRole('textbox', { name: 'Product name' }),
      'Coffee'
    );
    await user.click(screen.getByRole('button', { name: 'Select category' }));
    await user.click(screen.getByRole('button', { name: 'Review variants' }));
    const table = screen.getByRole('table', { name: 'Product variants' });
    const toggle = within(table).getByRole('button', {
      name: /^(Show|Hide) details: Coffee$/,
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(
      within(table).getByRole('columnheader', { name: 'Variant name *' })
    ).toBeVisible();
    const name = within(table).getByRole('textbox', {
      name: 'Variant name for variant 1',
    });
    expect(name).toHaveValue('Coffee');
    await user.type(
      within(table).getByRole('textbox', { name: 'SKU for variant 1' }),
      'COFFEE-1'
    );
    await user.type(
      within(table).getByRole('textbox', { name: 'Barcode for variant 1' }),
      '123456'
    );
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(
      within(table).queryByRole('textbox', { name: 'Product variant name' })
    ).not.toBeInTheDocument();
    await user.type(
      within(table).getByRole('textbox', { name: 'Description' }),
      'Variant description'
    );
    await user.clear(name);
    await user.click(
      within(table).getByRole('button', {
        name: /^(Show|Hide) details: Variant 1$/,
      })
    );
    expect(
      within(table).queryByRole('textbox', {
        name: 'Description',
        hidden: true,
      })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(
      await within(table).findByText('Product variant name is required')
    ).toBeVisible();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(
      within(table).getByRole('textbox', { name: 'Description' })
    ).toHaveValue('Variant description');
    expect(
      within(table).getByRole('textbox', { name: 'SKU for variant 1' })
    ).toHaveValue('COFFEE-1');
    expect(createProductGroup).not.toHaveBeenCalled();
    await user.type(
      within(table).getByRole('textbox', {
        name: 'Variant name for variant 1',
      }),
      'Roasted coffee'
    );
    expect(
      within(table).queryByText('Product variant name is required')
    ).not.toBeInTheDocument();
    expect(
      within(table).getByRole('textbox', { name: 'Description' })
    ).toBeVisible();
  });
});

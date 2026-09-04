import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createProductGroup } from '@/lib/client/api/products';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { PRODUCT_CREATION_MODE } from '@/lib/domain/products/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateProduct } from './CreateProduct';
import {
  CreateMultipleProductsTemplateFields,
  CreateSingleProductTemplateFields,
} from './CreateProductTemplateFields';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import type { CreateProductProps } from './types';
import {
  validateMultipleProducts,
  validateSingleProduct,
} from './utils/validations';

const mocks = vi.hoisted(() => ({
  createProductGroup: vi.fn(),
  push: vi.fn(),
}));

const intersectionObserverCallbacks: IntersectionObserverCallback[] = [];

class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    intersectionObserverCallbacks.push(callback);
  }

  disconnect = vi.fn();
  observe = vi.fn();
}

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
  createProductGroup: mocks.createProductGroup,
}));

vi.mock('@/features/categories', () => ({
  CategoriesAsyncCombobox: ({
    errorText,
    label,
    onValueChange,
  }: {
    errorText?: string;
    label: string;
    onValueChange: (value: string | null) => void;
  }) => (
    <>
      <button onClick={() => onValueChange('2')} type="button">
        Select {label}
      </button>
      {errorText ? <span>{errorText}</span> : null}
    </>
  ),
}));

vi.mock('./AttributesAsyncCombobox', () => ({
  AttributesAsyncCombobox: ({
    label,
    onSelectedAttributesChange,
  }: {
    label: string;
    onSelectedAttributesChange?: (attributes: AttributeDropdown[]) => void;
  }) => {
    const manufactureAttribute = {
      id: 8,
      name: 'Manufacture',
      sortOrder: 0,
      status: 'DRAFT' as const,
      createdAt: '2026-07-14T17:54:42.035Z',
      attributeValues: [
        {
          id: 80,
          name: 'China',
          sortOrder: 0,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 81,
          name: 'USA',
          sortOrder: 1,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 82,
          name: 'Ukraine',
          sortOrder: 2,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 83,
          name: 'India',
          sortOrder: 3,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 84,
          name: 'Brazil',
          sortOrder: 4,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 85,
          name: 'Germany',
          sortOrder: 5,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 86,
          name: 'Japan',
          sortOrder: 6,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
      ],
    };
    const colorAttribute = {
      id: 7,
      name: 'Color',
      sortOrder: 1,
      status: 'DRAFT' as const,
      createdAt: '2026-07-14T17:54:42.035Z',
      attributeValues: [
        {
          id: 70,
          name: 'Red',
          sortOrder: 0,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 71,
          name: 'Green',
          sortOrder: 1,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
        {
          id: 72,
          name: 'Blue',
          sortOrder: 2,
          status: 'DRAFT' as const,
          createdAt: '2026-07-14T17:54:42.036Z',
        },
      ],
    };

    return (
      <>
        <button
          onClick={() =>
            onSelectedAttributesChange?.([manufactureAttribute, colorAttribute])
          }
          type="button"
        >
          Select {label}
        </button>
        <button
          onClick={() => onSelectedAttributesChange?.([colorAttribute])}
          type="button"
        >
          Select Color Attribute
        </button>
      </>
    );
  },
}));

const createProductGroupMock = vi.mocked(createProductGroup);

type CreateProductTestProps = Omit<CreateProductProps, 'form'> & {
  validateProduct: Parameters<
    typeof useCreateProductForm
  >[0]['validateProduct'];
};

const CreateProductTest = ({
  validateProduct,
  ...props
}: CreateProductTestProps) => {
  const { form } = useCreateProductForm({
    onCreated: vi.fn(),
    validateProduct,
  });

  return (
    <CreateProduct
      {...props}
      form={form}
      onSubmit={() => form.handleSubmit()}
    />
  );
};

const { setup } = prepareStoreSetup({
  component: CreateProductTest,
  props: {
    creationMode: PRODUCT_CREATION_MODE.single,
    TemplateFields: CreateSingleProductTemplateFields,
    validateProduct: validateSingleProduct,
  },
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
    createProductGroupMock.mockReset();
    mocks.push.mockReset();
    intersectionObserverCallbacks.length = 0;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps generation available before the template is complete', () => {
    setup();

    const continueButton = screen.getByRole('button', {
      name: 'Next: Configure product',
    });

    expect(continueButton).toBeEnabled();
  });

  it('uses the route-selected multiple-product workflow', () => {
    setup({
      creationMode: PRODUCT_CREATION_MODE.multiple,
      TemplateFields: CreateMultipleProductsTemplateFields,
      validateProduct: validateMultipleProducts,
    });

    expect(
      screen.getByRole('button', { name: 'Next: Configure products' })
    ).toBeEnabled();
    expect(
      screen.queryByRole('group', { name: 'Creation mode' })
    ).not.toBeInTheDocument();
  });

  it('validates the product template before generating a preview', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    expect(await screen.findByText('Product name is required')).toBeVisible();
    expect(await screen.findByText('Category is required')).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Generated product variants' })
    ).not.toBeInTheDocument();
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('shows generated variant errors when the product template is invalid', async () => {
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );
    await user.clear(
      screen.getByRole('textbox', { name: 'Base product name' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Regenerate product' })
    );

    expect(await screen.findByText('Product name is required')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Create product' }));

    expect(await screen.findByText('Barcode is required')).toBeVisible();
    expect(await screen.findByText('SKU is required')).toBeVisible();
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('shows a template field error after blur and clears it on correction', async () => {
    const user = userEvent.setup();

    setup();

    const productName = screen.getByRole('textbox', {
      name: 'Base product name',
    });

    await user.click(productName);
    await user.tab();

    expect(await screen.findByText('Product name is required')).toBeVisible();

    await user.type(productName, 'Running Shoes');

    expect(
      screen.queryByText('Product name is required')
    ).not.toBeInTheDocument();
  });

  it('requires a selected attribute value before generating multiple products', async () => {
    const user = userEvent.setup();

    setup({
      creationMode: PRODUCT_CREATION_MODE.multiple,
      TemplateFields: CreateMultipleProductsTemplateFields,
      validateProduct: validateMultipleProducts,
    });

    await completeRequiredFields(user);
    await user.click(
      screen.getByRole('button', { name: 'Select Color Attribute' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure products' })
    );

    expect(
      await screen.findByText('Select at least one attribute value.')
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: 'Generated product variants' })
    ).not.toBeInTheDocument();
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
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('submits a single generated product without attribute values', async () => {
    createProductGroupMock.mockResolvedValue({
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
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );
    await user.type(screen.getByRole('textbox', { name: 'SKU' }), 'SHOE');
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode' }),
      'barcode-1'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    await waitFor(() =>
      expect(createProductGroupMock).toHaveBeenCalledWith({
        name: 'Running Shoes',
        description: '',
        categoryId: 2,
        productVariants: [
          {
            name: 'Running Shoes',
            description: '',
            sku: 'SHOE',
            barcode: 'barcode-1',
            attributeValueIds: [],
          },
        ],
      })
    );
  });

  it('adds another variant attribute value from the same attribute for a single product', async () => {
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Edit attributes for Running Shoes Blue',
      })
    );
    const dialog = screen.getByRole('dialog', {
      name: 'Edit variant attributes for Running Shoes Blue',
    });

    await user.click(within(dialog).getByRole('button', { name: 'Red' }));
    await user.click(within(dialog).getByRole('button', { name: 'Update' }));

    const variantAttributes = screen.getByRole('treegrid', {
      name: 'Attributes for Running Shoes Blue',
    });

    expect(within(variantAttributes).getByText('Red')).toBeVisible();
    expect(within(variantAttributes).getByText('Blue')).toBeVisible();
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('keeps filled variants when generating again without template changes', async () => {
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    const sku = screen.getByRole('textbox', { name: 'SKU' });
    await user.type(sku, 'RUNNING-SHOES');
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    expect(sku).toHaveValue('RUNNING-SHOES');
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('keeps generated variants when template attributes change', async () => {
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    expect(screen.getByDisplayValue('Running Shoes Blue')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Select Color Attribute' })
    );

    expect(screen.getByDisplayValue('Running Shoes Blue')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create product' })
    ).toBeVisible();
    expect(
      screen.getByText(
        'Template changes apply when you regenerate. Existing variants will be submitted unchanged.'
      )
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Regenerate product' })
    ).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: 'Regenerate product' })
    );

    expect(
      screen.queryByText(
        'Template changes apply when you regenerate. Existing variants will be submitted unchanged.'
      )
    ).not.toBeInTheDocument();
  });

  it('keeps the generated attribute definitions after template changes', async () => {
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    await user.click(
      screen.getByRole('button', { name: 'Select Color Attribute' })
    );
    await user.click(
      screen.getByRole('button', {
        name: 'Edit attributes for Running Shoes Blue',
      })
    );

    const dialog = screen.getByRole('dialog', {
      name: 'Edit variant attributes for Running Shoes Blue',
    });

    expect(within(dialog).getByText('Manufacture:')).toBeVisible();
    expect(within(dialog).getByRole('button', { name: 'China' })).toBeVisible();
  });

  it('shows only template-selected attributes in the variant attribute editor', async () => {
    const user = userEvent.setup();

    setup();

    await completeRequiredFields(user);
    await user.click(
      screen.getByRole('button', { name: 'Select Color Attribute' })
    );
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Edit attributes for Running Shoes Blue',
      })
    );
    const dialog = screen.getByRole('dialog', {
      name: 'Edit variant attributes for Running Shoes Blue',
    });

    expect(within(dialog).getByText('Color:')).toBeVisible();
    expect(within(dialog).queryByText('Manufacture:')).not.toBeInTheDocument();
    expect(
      within(dialog).queryByRole('button', { name: 'China' })
    ).not.toBeInTheDocument();
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('generates multiple product previews from selected attribute value combinations', async () => {
    const user = userEvent.setup();

    setup({
      creationMode: PRODUCT_CREATION_MODE.multiple,
      TemplateFields: CreateMultipleProductsTemplateFields,
      validateProduct: validateMultipleProducts,
    });

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'China' }));
    await user.click(screen.getByRole('button', { name: 'USA' }));
    await user.click(screen.getByRole('button', { name: 'Red' }));
    await user.click(screen.getByRole('button', { name: 'Green' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure products' })
    );

    expect(
      screen.getByDisplayValue('Running Shoes China Red')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Running Shoes China Green')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Running Shoes China Blue')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Running Shoes USA Red')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Running Shoes USA Green')
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Running Shoes USA Blue')
    ).toBeInTheDocument();
    expect(
      screen.queryByDisplayValue('Running Shoes Ukraine Red')
    ).not.toBeInTheDocument();
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('generates multiple-mode previews from any selected attribute values', async () => {
    const user = userEvent.setup();

    setup({
      creationMode: PRODUCT_CREATION_MODE.multiple,
      TemplateFields: CreateMultipleProductsTemplateFields,
      validateProduct: validateMultipleProducts,
    });

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure products' })
    );

    expect(screen.getByDisplayValue('Running Shoes Blue')).toBeInTheDocument();
    expect(
      screen.queryByDisplayValue('Running Shoes China Blue')
    ).not.toBeInTheDocument();
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('keeps focus while editing a variant loaded after the first page', async () => {
    const user = userEvent.setup();

    setup({
      creationMode: PRODUCT_CREATION_MODE.multiple,
      TemplateFields: CreateMultipleProductsTemplateFields,
      validateProduct: validateMultipleProducts,
    });

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));

    for (const attributeValueName of [
      'China',
      'USA',
      'Ukraine',
      'India',
      'Brazil',
      'Germany',
      'Japan',
      'Red',
      'Green',
      'Blue',
    ]) {
      await user.click(
        screen.getByRole('button', { name: attributeValueName })
      );
    }

    await user.click(
      screen.getByRole('button', { name: 'Next: Configure products' })
    );

    expect(screen.getAllByRole('textbox', { name: 'SKU' })).toHaveLength(20);

    act(() => {
      intersectionObserverCallbacks[0]?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    const twentyFirstVariantSku = screen.getAllByRole('textbox', {
      name: 'SKU',
    })[20];

    await user.type(twentyFirstVariantSku, 'SKU-21');

    expect(twentyFirstVariantSku).toHaveFocus();
    expect(twentyFirstVariantSku).toHaveValue('SKU-21');
  });

  it('shows submit errors for generated variants loaded after the first page', async () => {
    const user = userEvent.setup();

    setup({
      creationMode: PRODUCT_CREATION_MODE.multiple,
      TemplateFields: CreateMultipleProductsTemplateFields,
      validateProduct: validateMultipleProducts,
    });

    await completeRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));

    for (const attributeValueName of [
      'China',
      'USA',
      'Ukraine',
      'India',
      'Brazil',
      'Germany',
      'Japan',
      'Red',
      'Green',
      'Blue',
    ]) {
      await user.click(
        screen.getByRole('button', { name: attributeValueName })
      );
    }

    await user.click(
      screen.getByRole('button', { name: 'Next: Configure products' })
    );

    await user.click(screen.getByRole('button', { name: 'Create product' }));

    expect(await screen.findAllByText('Barcode is required')).toHaveLength(20);
    expect(screen.getAllByText('SKU is required')).toHaveLength(20);

    act(() => {
      intersectionObserverCallbacks[0]?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    expect(await screen.findAllByText('Barcode is required')).toHaveLength(21);
    expect(screen.getAllByText('SKU is required')).toHaveLength(21);
    expect(createProductGroupMock).not.toHaveBeenCalled();
  });

  it('submits the generated product variant collection', async () => {
    createProductGroupMock.mockResolvedValue({
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
    const createButton = screen.getByRole('button', { name: 'Create product' });

    expect(createButton).toBeEnabled();

    await user.click(createButton);

    expect(await screen.findByText('Barcode is required')).toBeVisible();
    expect(await screen.findByText('SKU is required')).toBeVisible();
    expect(createProductGroupMock).not.toHaveBeenCalled();

    await user.type(screen.getByRole('textbox', { name: 'SKU' }), 'SHOE-BLUE');
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode' }),
      'barcode-1'
    );

    expect(screen.queryByText('Barcode is required')).not.toBeInTheDocument();
    expect(screen.queryByText('SKU is required')).not.toBeInTheDocument();
    expect(createButton).toBeEnabled();

    await user.click(createButton);

    await waitFor(() =>
      expect(createProductGroupMock).toHaveBeenCalledWith({
        name: 'Running Shoes',
        description: '',
        categoryId: 2,
        productVariants: [
          {
            name: 'Running Shoes Blue',
            description: '',
            sku: 'SHOE-BLUE',
            barcode: 'barcode-1',
            attributeValueIds: [72],
          },
        ],
      })
    );
  });

  it('shows backend field errors without leaving the page', async () => {
    createProductGroupMock.mockResolvedValue({
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
    await user.click(screen.getByRole('button', { name: 'Select Attributes' }));
    await user.click(screen.getByRole('button', { name: 'Blue' }));
    await user.click(
      screen.getByRole('button', { name: 'Next: Configure product' })
    );
    await user.type(screen.getByRole('textbox', { name: 'SKU' }), 'SHOE-BLUE');
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode' }),
      'barcode-1'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));

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

    await user.type(
      screen.getAllByRole('textbox', { name: 'Description' })[0],
      'Updated product description'
    );

    expect(screen.getByText('Product name already exists.')).toBeVisible();
    expect(mocks.push).not.toHaveBeenCalled();
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

import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, useLayoutEffect, useState } from 'react';
import { createProductGroup } from '@/lib/client/api/products';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import type { CreateProductVariantValues } from '../../add/CreateProduct/types';
import { validateMultipleProductsConfiguration } from '../../add/CreateProduct/utils/validations';
import { useCreateProductForm } from './hooks/useCreateProductForm';
import { ProductVariantsTable } from './ProductVariantsTable';

vi.mock('@/lib/client/api/products', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/products')>(
    '@/lib/client/api/products'
  )),
  createProductGroup: vi.fn(),
}));

const attributes: AttributeDropdown[] = [
  {
    id: 1,
    name: 'Color',
    sortOrder: 0,
    status: 'ACTIVE',
    createdAt: '2026-10-21T00:00:00Z',
    attributeValues: [
      {
        id: 1,
        name: 'Blue',
        sortOrder: 0,
        status: 'ACTIVE',
        createdAt: '2026-10-21T00:00:00Z',
      },
      {
        id: 2,
        name: 'Red',
        sortOrder: 1,
        status: 'ACTIVE',
        createdAt: '2026-10-21T00:00:00Z',
      },
    ],
  },
];

const validateConfiguration = vi.fn(validateMultipleProductsConfiguration);

const TableWithInvalidDetails = () => {
  const { form, submitProductForm } = useCreateProductForm({
    onCreated: vi.fn(),
    validateConfiguration,
  });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    form.setFieldValue('name', 'Coffee');
    form.setFieldValue('category', { id: 1, name: 'Coffee and tea' });
    form.setFieldValue('productVariants', [
      {
        name: 'Coffee',
        sku: 'COFFEE-1',
        barcode: '123456',
        description: 'Preserved description',
        status: 'DRAFT',
        attributeValueIds: [],
      },
      {
        name: 'Tea',
        sku: '',
        barcode: '',
        description: '',
        status: 'DRAFT',
        attributeValueIds: [1],
      },
    ]);
    setReady(true);
  }, [form]);

  return ready ? (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        submitProductForm();
      }}
    >
      <ProductVariantsTable
        productVariantsCreationForm={form}
        generatedAttributes={attributes}
        generationMode="many"
      />
      <button type="submit">Create product</button>
    </form>
  ) : null;
};

const { setup } = prepareStoreSetup({ component: TableWithInvalidDetails });

it('opens only rows with hidden errors on submission and preserves already-open rows', async () => {
  const user = userEvent.setup();
  setup();
  const toggle = screen.getByRole('button', {
    name: /^(Show|Hide) details: Coffee$/,
  });
  const visibleErrorsToggle = screen.getByRole('button', {
    name: /^(Show|Hide) details: Tea$/,
  });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(visibleErrorsToggle).toHaveAttribute('aria-expanded', 'false');
  expect(
    screen.getByRole('textbox', { name: 'Variant name for variant 1' })
  ).toHaveValue('Coffee');
  await user.clear(
    screen.getByRole('textbox', { name: 'Variant name for variant 2' })
  );

  await user.click(screen.getByRole('button', { name: 'Create product' }));

  expect(
    await screen.findByText('Product variant name is required')
  ).toBeVisible();
  expect(screen.getByText('Select at least one attribute value')).toBeVisible();
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('SKU is required')).toBeVisible();
  expect(screen.getByText('Barcode is required')).toBeVisible();
  expect(visibleErrorsToggle).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
    'Preserved description'
  );

  await user.click(visibleErrorsToggle);
  await user.click(screen.getByRole('button', { name: 'Create product' }));
  expect(visibleErrorsToggle).toHaveAttribute('aria-expanded', 'true');
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

const { setup: setupStrict } = prepareStoreSetup({
  component: () => (
    <StrictMode>
      <TableWithInvalidDetails />
    </StrictMode>
  ),
});

it.each([
  ['normal rendering', setup],
  ['Strict Mode', setupStrict],
] as const)('shows duplicate attribute errors for collapsed rows in %s', async (_, setupTable) => {
  vi.mocked(createProductGroup).mockReset();
  vi.mocked(createProductGroup).mockResolvedValue({
    ok: false,
    error: { status: 500, message: 'Try again' },
  });
  const user = userEvent.setup();
  setupTable();
  await user.type(
    screen.getByRole('textbox', { name: 'SKU for variant 2' }),
    'TEA-1'
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Barcode for variant 2' }),
    '654321'
  );
  const coffeeToggle = screen.getByRole('button', {
    name: 'Show details: Coffee',
  });
  const teaToggle = screen.getByRole('button', { name: 'Show details: Tea' });
  await user.click(coffeeToggle);
  await user.click(
    screen.getByRole('button', { name: 'Add attributes for Coffee' })
  );
  await user.click(screen.getByRole('combobox', { name: 'Color' }));
  await user.click(screen.getByRole('option', { name: 'Blue' }));
  await user.click(screen.getByRole('button', { name: 'Apply changes' }));
  await user.click(coffeeToggle);
  expect(coffeeToggle).toHaveAttribute('aria-expanded', 'false');
  expect(teaToggle).toHaveAttribute('aria-expanded', 'false');
  validateConfiguration.mockClear();
  await user.click(screen.getByRole('button', { name: 'Create product' }));
  await waitFor(() => {
    expect(coffeeToggle).toHaveAttribute('aria-expanded', 'true');
    expect(teaToggle).toHaveAttribute('aria-expanded', 'true');
  });
  expect(
    await screen.findAllByText(
      'Attribute values must be unique across variants'
    )
  ).toHaveLength(2);
  expect(createProductGroup).not.toHaveBeenCalled();
  validateConfiguration.mockClear();
  await user.click(screen.getByRole('button', { name: 'Create product' }));
  expect(
    screen.getAllByText('Attribute values must be unique across variants')
  ).toHaveLength(2);
  expect(createProductGroup).not.toHaveBeenCalled();
  await user.click(coffeeToggle);
  await user.click(coffeeToggle);
  expect(
    screen.getAllByText('Attribute values must be unique across variants')
  ).toHaveLength(2);
  await user.click(
    screen.getByRole('button', { name: 'Edit attributes for Coffee' })
  );
  await user.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(
    screen.getAllByText('Attribute values must be unique across variants')
  ).toHaveLength(2);
  await user.click(
    screen.getByRole('button', { name: 'Edit attributes for Coffee' })
  );
  await user.click(screen.getByRole('combobox', { name: 'Color' }));
  await user.click(screen.getByRole('option', { name: 'Red' }));
  validateConfiguration.mockClear();
  await user.click(screen.getByRole('button', { name: 'Apply changes' }));
  expect(validateConfiguration).not.toHaveBeenCalled();
  expect(
    screen.getAllByText('Attribute values must be unique across variants')
  ).toHaveLength(2);
  await user.click(coffeeToggle);
  await user.click(teaToggle);
  validateConfiguration.mockClear();
  await user.click(screen.getByRole('button', { name: 'Create product' }));
  await waitFor(() => expect(createProductGroup).toHaveBeenCalledTimes(1));
  expect(createProductGroup).toHaveBeenCalledWith(
    expect.objectContaining({
      productVariants: [
        expect.objectContaining({ attributeValueIds: [2] }),
        expect.objectContaining({ attributeValueIds: [1] }),
      ],
    })
  );
  await user.click(coffeeToggle);
  await user.click(teaToggle);
  expect(
    screen.queryByText('Attribute values must be unique across variants')
  ).not.toBeInTheDocument();
});

it('discards dialog changes on cancel without validating the product', async () => {
  const user = userEvent.setup();
  setup();
  await user.click(screen.getByRole('button', { name: 'Show details: Tea' }));
  await user.click(
    screen.getByRole('button', { name: 'Edit attributes for Tea' })
  );
  await user.click(screen.getByRole('combobox', { name: 'Color' }));
  validateConfiguration.mockClear();
  await user.click(screen.getByRole('option', { name: 'Red' }));
  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeVisible();
  expect(
    screen.queryByRole('button', { name: 'Remove Red' })
  ).not.toBeInTheDocument();
  expect(validateConfiguration).not.toHaveBeenCalled();
  expect(screen.queryByText('SKU is required')).not.toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'Edit attributes for Tea' })
  );
  const dialog = screen.getByRole('dialog', { name: 'Edit attributes' });
  expect(within(dialog).getByRole('combobox', { name: 'Color' })).toHaveValue(
    'Blue'
  );
});

it('applies attribute drafts without running validation, including after a failed submission', async () => {
  const user = userEvent.setup();
  setup();
  await user.click(screen.getByRole('button', { name: 'Create product' }));
  expect(await screen.findByText('SKU is required')).toBeVisible();
  expect(screen.getByText('Select at least one attribute value')).toBeVisible();

  await user.click(
    screen.getByRole('button', { name: 'Add attributes for Coffee' })
  );
  await user.click(screen.getByRole('combobox', { name: 'Color' }));
  await user.click(screen.getByRole('option', { name: 'Blue' }));
  validateConfiguration.mockClear();
  await user.click(screen.getByRole('button', { name: 'Apply changes' }));

  expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeVisible();
  expect(validateConfiguration).not.toHaveBeenCalled();
  expect(screen.getByText('SKU is required')).toBeVisible();
  expect(
    screen.queryByText('Attribute values must be unique across variants')
  ).not.toBeInTheDocument();
});

const incrementalVariants: CreateProductVariantValues[] = Array.from(
  { length: 41 },
  (_, index) => ({
    name: `Coffee ${index + 1}`,
    sku: index === 40 ? '' : `COFFEE-${index + 1}`,
    barcode: index === 40 ? '' : String(100000 + index),
    description: '',
    status: 'DRAFT',
    attributeValueIds: [index + 1],
  })
);
const incrementalAttributes: AttributeDropdown[] = [
  {
    ...attributes[0],
    attributeValues: incrementalVariants.map((_, index) => ({
      id: index + 1,
      name: `Color ${index + 1}`,
      sortOrder: index,
      createdAt: '2026-10-21T00:00:00Z',
    })),
  },
];
const onCreated = vi.fn();
const TableWithIncrementalVariants = () => {
  const { form, submitProductForm } = useCreateProductForm({
    onCreated,
    validateConfiguration: validateMultipleProductsConfiguration,
  });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    form.setFieldValue('name', 'Coffee');
    form.setFieldValue('category', { id: 1, name: 'Coffee and tea' });
    form.setFieldValue('productVariants', incrementalVariants);
    form.setFieldValue('status', 'ACTIVE');
    setReady(true);
  }, [form]);

  return ready ? (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        submitProductForm();
      }}
    >
      <ProductVariantsTable
        productVariantsCreationForm={form}
        generatedAttributes={incrementalAttributes}
        generationMode="many"
      />
      <button type="submit">Create product</button>
    </form>
  ) : null;
};

const { setup: setupIncrementalTable } = prepareStoreSetup({
  component: TableWithIncrementalVariants,
});

// Simulate the loading sentinel entering the viewport; keep the real loading hook.
const intersectionObserverCallbacks: IntersectionObserverCallback[] = [];
class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {
    intersectionObserverCallbacks.push(callback);
  }

  disconnect = vi.fn();
  observe = vi.fn();
}

const loadNextVariants = () => {
  act(() => {
    intersectionObserverCallbacks.at(-1)?.(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
};

describe('incrementally loaded variant rows', () => {
  beforeEach(() => {
    intersectionObserverCallbacks.length = 0;
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
    onCreated.mockReset();
    vi.mocked(createProductGroup).mockReset();
    vi.mocked(createProductGroup).mockResolvedValue({
      ok: true,
      data: {
        id: 1,
        name: 'Coffee',
        description: '',
        createdAt: '2026-10-21T00:00:00Z',
        category: {
          id: 1,
          name: 'Coffee and tea',
          createdAt: '2026-10-21T00:00:00Z',
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('preserves focus and edits across two loads and submits all variants', async () => {
    const user = userEvent.setup();
    setupIncrementalTable();
    expect(
      screen.getAllByRole('textbox', { name: /^SKU for variant / })
    ).toHaveLength(20);
    expect(
      screen.queryByRole('textbox', { name: 'SKU for variant 21' })
    ).not.toBeInTheDocument();

    loadNextVariants();
    expect(
      screen.getAllByRole('textbox', { name: /^SKU for variant / })
    ).toHaveLength(40);
    const name = screen.getByRole('textbox', {
      name: 'Variant name for variant 21',
    });
    await user.clear(name);
    await user.type(name, 'Updated coffee');
    expect(name).toHaveFocus();
    await user.click(
      screen.getByRole('combobox', { name: 'Status for variant 21' })
    );
    await user.click(screen.getByRole('option', { name: 'Active' }));
    await user.click(
      screen.getByRole('button', { name: 'Show details: Updated coffee' })
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Description' }),
      'Later row description'
    );
    await user.click(
      screen.getByRole('button', { name: 'Hide details: Updated coffee' })
    );
    const sku = screen.getByRole('textbox', { name: 'SKU for variant 21' });
    await user.clear(sku);
    await user.type(sku, 'UPDATED-21');
    expect(sku).toHaveFocus();

    loadNextVariants();
    expect(
      screen.getAllByRole('textbox', { name: /^SKU for variant / })
    ).toHaveLength(41);
    expect(sku).toHaveFocus();
    expect(sku).toHaveValue('UPDATED-21');
    expect(name).toHaveValue('Updated coffee');
    await user.click(
      screen.getByRole('button', { name: 'Show details: Updated coffee' })
    );
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveValue(
      'Later row description'
    );
    await user.click(
      screen.getByRole('button', { name: 'Hide details: Updated coffee' })
    );
    await user.type(
      screen.getByRole('textbox', { name: 'SKU for variant 41' }),
      'COFFEE-41'
    );
    await user.type(
      screen.getByRole('textbox', { name: 'Barcode for variant 41' }),
      '100040'
    );
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    await waitFor(() => expect(onCreated).toHaveBeenCalledOnce());
    expect(createProductGroup).toHaveBeenCalledOnce();
    expect(createProductGroup).toHaveBeenCalledWith({
      name: 'Coffee',
      categoryId: 1,
      status: 'ACTIVE',
      productVariants: incrementalVariants.map(
        ({ description: _description, ...variant }, index) => ({
          ...variant,
          ...(index === 20
            ? {
                name: 'Updated coffee',
                sku: 'UPDATED-21',
                status: 'ACTIVE',
                description: 'Later row description',
              }
            : {}),
          ...(index === 40 ? { sku: 'COFFEE-41', barcode: '100040' } : {}),
        })
      ),
    });
  }, 20000);

  it('reveals errors from an earlier submit when later rows load and opens only hidden errors', async () => {
    const user = userEvent.setup();
    setupIncrementalTable();
    await user.click(screen.getByRole('button', { name: 'Create product' }));
    expect(createProductGroup).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('textbox', { name: 'SKU for variant 41' })
    ).not.toBeInTheDocument();

    loadNextVariants();
    expect(
      screen.queryByRole('textbox', { name: 'SKU for variant 41' })
    ).not.toBeInTheDocument();
    loadNextVariants();
    const sku = screen.getByRole('textbox', { name: 'SKU for variant 41' });
    const barcode = screen.getByRole('textbox', {
      name: 'Barcode for variant 41',
    });
    expect(sku).toHaveAccessibleDescription('SKU is required');
    expect(barcode).toHaveAccessibleDescription('Barcode is required');
    const toggle = screen.getByRole('button', {
      name: 'Show details: Coffee 41',
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.type(sku, 'COFFEE-41');
    await user.type(barcode, '100040');
    expect(screen.queryByText('SKU is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Barcode is required')).not.toBeInTheDocument();
    await user.click(toggle);
    const details = screen.getByRole('region', { name: 'Coffee 41' });
    await user.click(
      within(details).getByRole('button', { name: 'Remove Color 41' })
    );
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(screen.getByRole('button', { name: 'Create product' }));

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByText('Select at least one attribute value')
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Show details: Coffee 21' })
    ).toHaveAttribute('aria-expanded', 'false');
    expect(createProductGroup).not.toHaveBeenCalled();
    expect(onCreated).not.toHaveBeenCalled();
  }, 15000);
});

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLayoutEffect, useState } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { useCreateProductForm } from '../../add/CreateProduct/hooks/useCreateProductForm';
import { validateMultipleProductsConfiguration } from '../../add/CreateProduct/utils/validations';
import { ProductVariantsTable } from './ProductVariantsTable';

const attributes: AttributeDropdown[] = [
  {
    id: 1,
    name: 'Color',
    sortOrder: 0,
    status: 'DRAFT',
    createdAt: '2026-10-21T00:00:00Z',
    attributeValues: [],
  },
];

const TableWithInvalidDetails = () => {
  const { form } = useCreateProductForm({
    onCreated: vi.fn(),
    validateConfiguration: validateMultipleProductsConfiguration,
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
        void form.handleSubmit();
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

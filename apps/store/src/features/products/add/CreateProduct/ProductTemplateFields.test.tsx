import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import {
  createProductGenerationDefaultValues,
  PRODUCT_GENERATION_MODE,
} from './constants';
import { useProductVariantsGenerationForm } from './hooks/useProductVariantsGenerationForm';
import { ProductAttributeValuesField } from './ProductAttributeValuesField';
import { ProductTemplateFields } from './ProductTemplateFields';
import type { ProductVariantsGeneratedArgs } from './types';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributesDropdown: vi.fn(),
}));

const color: AttributeDropdown = {
  id: 7,
  name: 'Color',
  sortOrder: 0,
  status: 'ACTIVE',
  createdAt: '2026-10-14T00:00:00.000Z',
  attributeValues: [
    {
      id: 71,
      name: 'Blue',
      sortOrder: 0,
      createdAt: '2026-10-14T00:00:00.000Z',
    },
  ],
};
const material: AttributeDropdown = {
  ...color,
  id: 8,
  name: 'Material',
  attributeValues: [{ ...color.attributeValues[0], id: 81, name: 'Cotton' }],
};

type TestFormProps = {
  onProductVariantsGenerated: (args: ProductVariantsGeneratedArgs) => void;
};

const TestForm = ({ onProductVariantsGenerated }: TestFormProps) => {
  const { form } = useProductVariantsGenerationForm({
    generationMode: PRODUCT_GENERATION_MODE.one,
    maxGeneratedProductVariants: 100,
    onProductVariantsGenerated,
  });

  return (
    <>
      <ProductTemplateFields
        generationMode={PRODUCT_GENERATION_MODE.one}
        productVariantsGenerationForm={form}
      />
      <ProductAttributeValuesField productVariantsGenerationForm={form} />
      <button
        onClick={() =>
          form.reset({
            ...createProductGenerationDefaultValues,
            name: 'Shirt',
            category: { id: 2, name: 'Footwear' },
            attributes: [color],
            attributeValues: { '7': ['71'] },
          })
        }
        type="button"
      >
        Restore saved template
      </button>
      <button
        onClick={() => form.reset(createProductGenerationDefaultValues)}
        type="button"
      >
        Reset template
      </button>
      <button
        onClick={async () => {
          await form.handleSubmit();
        }}
        type="button"
      >
        Generate
      </button>
    </>
  );
};

const { setup } = prepareStoreSetup({
  component: TestForm,
  props: { onProductVariantsGenerated: vi.fn() },
});

describe('ProductTemplateFields attribute selection', () => {
  it('restores object defaults, preserves remaining values, and generates numeric value IDs', async () => {
    const user = userEvent.setup();
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: [color, material],
    });
    const { onProductVariantsGenerated } = setup();

    expect(
      screen.queryByRole('group', { name: 'Attribute values' })
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Restore saved template' })
    );
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue(
      'Footwear'
    );
    expect(screen.getByRole('button', { name: 'Remove Color' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Blue' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(getAttributesDropdown).not.toHaveBeenCalled();

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
    await user.click(await screen.findByRole('option', { name: 'Material' }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Blue' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await user.click(screen.getByRole('button', { name: 'Cotton' }));
    await user.click(screen.getByRole('button', { name: 'Remove Color' }));
    expect(
      screen.queryByRole('button', { name: 'Blue' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cotton' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
    await user.click(await screen.findByRole('option', { name: 'Color' }));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Blue' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    await user.click(screen.getByRole('button', { name: 'Generate' }));
    expect(onProductVariantsGenerated).toHaveBeenCalledWith({
      attributes: [material, color],
      category: { id: 2, name: 'Footwear' },
      description: '',
      name: 'Shirt',
      productVariants: [
        {
          attributeValueIds: [81],
          barcode: '',
          description: '',
          name: 'Shirt Cotton',
          sku: '',
          status: 'DRAFT',
        },
      ],
    });

    await user.click(screen.getByRole('button', { name: 'Reset template' }));
    expect(
      screen.queryByRole('button', { name: 'Remove Color' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove Material' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('group', { name: 'Attribute values' })
    ).not.toBeInTheDocument();
  });
});

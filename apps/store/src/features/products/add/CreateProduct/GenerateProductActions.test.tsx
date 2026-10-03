import { act, screen } from '@testing-library/react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { PRODUCT_GENERATION_MODE } from './constants';
import { GenerateProductActions } from './GenerateProductActions';
import { useProductVariantsGenerationForm } from './hooks/useProductVariantsGenerationForm';
import type {
  ProductGenerationMode,
  ProductVariantsGenerationFormApi,
} from './types';

type HarnessProps = {
  generationMode: ProductGenerationMode;
  maxGeneratedProductVariants: number;
  onForm: (form: ProductVariantsGenerationFormApi) => void;
};

const GenerateProductActionsHarness = ({
  generationMode,
  maxGeneratedProductVariants,
  onForm,
}: HarnessProps) => {
  const { form } = useProductVariantsGenerationForm({
    generationMode,
    maxGeneratedProductVariants,
    onProductVariantsGenerated: vi.fn(),
  });

  onForm(form);

  return (
    <GenerateProductActions
      generationMode={generationMode}
      maxGeneratedProductVariants={maxGeneratedProductVariants}
      productVariantsGenerationForm={form}
    />
  );
};

const { setup } = prepareStoreSetup<HarnessProps>({
  component: GenerateProductActionsHarness,
  props: {
    generationMode: PRODUCT_GENERATION_MODE.many,
    maxGeneratedProductVariants: 20,
    onForm: vi.fn(),
  },
});

const createAttribute = (
  id: number,
  valueCount: number
): AttributeDropdown => ({
  attributeValues: Array.from({ length: valueCount }, (_, index) => ({
    createdAt: '2026-07-14T17:54:42.036Z',
    id: id * 1000 + index,
    name: `Value ${index}`,
    sortOrder: index,
    status: 'DRAFT' as const,
  })),
  createdAt: '2026-07-14T17:54:42.035Z',
  id,
  name: `Attribute ${id}`,
  sortOrder: id,
  status: 'DRAFT' as const,
});

const selectAllValues = async (
  form: ProductVariantsGenerationFormApi,
  attributes: AttributeDropdown[]
) => {
  await act(async () => {
    form.setFieldValue('attributes', attributes);
    form.setFieldValue(
      'attributeValues',
      Object.fromEntries(
        attributes.map((attribute) => [
          String(attribute.id),
          attribute.attributeValues.map(({ id }) => String(id)),
        ])
      )
    );
  });
};

const setupWithForm = (props: Partial<HarnessProps> = {}) => {
  let form: ProductVariantsGenerationFormApi | undefined;

  setup({
    ...props,
    onForm: (currentForm) => {
      form = currentForm;
    },
  });

  return () => form as ProductVariantsGenerationFormApi;
};

describe('GenerateProductActions', () => {
  it('shows how many products will be generated', async () => {
    const getForm = setupWithForm();

    expect(screen.getByText('0 products will be generated')).toBeVisible();

    await selectAllValues(getForm(), [
      createAttribute(1, 4),
      createAttribute(2, 3),
    ]);

    expect(screen.getByText('12 products will be generated')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Next: Configure products' })
    ).toBeEnabled();
  });

  it('allows a selection that generates exactly the provided maximum', async () => {
    const getForm = setupWithForm({ maxGeneratedProductVariants: 12 });

    await selectAllValues(getForm(), [
      createAttribute(1, 4),
      createAttribute(2, 3),
    ]);

    expect(screen.getByText('12 products will be generated')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Next: Configure products' })
    ).toBeEnabled();
  });

  it('disables generation when the selection exceeds the provided maximum', async () => {
    const getForm = setupWithForm({ maxGeneratedProductVariants: 10 });

    await selectAllValues(getForm(), [
      createAttribute(1, 4),
      createAttribute(2, 3),
    ]);

    expect(
      screen.getByText('12 products will be generated (maximum 10)')
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Next: Configure products' })
    ).toBeDisabled();
  });

  it('does not show the count in single-product mode', async () => {
    const getForm = setupWithForm({
      generationMode: PRODUCT_GENERATION_MODE.one,
    });

    await selectAllValues(getForm(), [createAttribute(1, 4)]);

    expect(screen.queryByText(/products will be generated/)).toBeNull();
    expect(
      screen.getByRole('button', { name: 'Next: Configure product' })
    ).toBeEnabled();
  });
});

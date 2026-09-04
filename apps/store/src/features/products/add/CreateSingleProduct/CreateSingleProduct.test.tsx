import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import {
  PRODUCT_GENERATION_MODE,
  validateSingleProduct,
} from '../CreateProduct';
import { CreateSingleProduct } from './CreateSingleProduct';
import { CreateSingleProductTemplateFields } from './CreateSingleProductTemplateFields';

const mocks = vi.hoisted(() => ({
  generationMode: undefined as undefined | string,
  onCreated: undefined as undefined | (() => Promise<void> | void),
  push: vi.fn(),
  templateFields: undefined as unknown,
  validateProduct: undefined as unknown,
}));

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: mocks.push,
  }),
}));

vi.mock('../CreateProduct', async () => ({
  ...(await vi.importActual<typeof import('../CreateProduct')>(
    '../CreateProduct'
  )),
  CreateProduct: ({
    generationMode,
    onSubmit,
    TemplateFields,
  }: {
    generationMode: string;
    onSubmit: () => void;
    TemplateFields: unknown;
  }) => {
    mocks.generationMode = generationMode;
    mocks.templateFields = TemplateFields;

    return (
      <button onClick={onSubmit} type="button">
        Create product
      </button>
    );
  },
  useCreateProductForm: ({
    onCreated,
    validateProduct,
  }: {
    onCreated: () => Promise<void> | void;
    validateProduct: unknown;
  }) => {
    mocks.onCreated = onCreated;
    mocks.validateProduct = validateProduct;

    return {
      form: {
        handleSubmit: () => mocks.onCreated?.(),
      },
    };
  },
}));

vi.mock('../CreateProduct/hooks/useProductGenerationState', () => ({
  useProductGenerationState: () => ({}),
}));

const { setup } = prepareStoreSetup({
  component: CreateSingleProduct,
});

describe('CreateSingleProduct', () => {
  beforeEach(() => {
    mocks.generationMode = undefined;
    mocks.onCreated = undefined;
    mocks.push.mockReset();
    mocks.templateFields = undefined;
    mocks.validateProduct = undefined;
  });

  it('uses the single-product generation configuration', () => {
    setup();

    expect(mocks.generationMode).toBe(PRODUCT_GENERATION_MODE.one);
    expect(mocks.templateFields).toBe(CreateSingleProductTemplateFields);
    expect(mocks.validateProduct).toBe(validateSingleProduct);
  });

  it('refreshes product lists and returns to products after creation', async () => {
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Create product' }));

    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: productGroupsQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: productVariantsQueryKeys.list,
    });
    expect(mocks.push).toHaveBeenCalledWith(clientRoutes.products);
  });
});

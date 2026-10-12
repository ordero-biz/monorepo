import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import {
  PRODUCT_CREATION_MODE,
  type ProductCreationMode,
} from '@/lib/domain/products/constants';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { PRODUCT_GENERATION_MODE } from '../CreateProduct';
import { CreateProductWorkflow } from './CreateProductWorkflow';

const mocks = vi.hoisted(() => ({
  generationMode: undefined as undefined | string,
  push: vi.fn(),
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
    onCreated,
  }: {
    generationMode: string;
    onCreated: () => Promise<void> | void;
  }) => {
    mocks.generationMode = generationMode;

    return (
      <button onClick={() => onCreated()} type="button">
        Create product
      </button>
    );
  },
}));

const { setup } = prepareStoreSetup<{ creationMode: ProductCreationMode }>({
  component: CreateProductWorkflow,
  props: {
    creationMode: PRODUCT_CREATION_MODE.single,
  },
});

describe('CreateProductWorkflow', () => {
  beforeEach(() => {
    mocks.generationMode = undefined;
    mocks.push.mockReset();
  });

  it.each([
    [PRODUCT_CREATION_MODE.single, PRODUCT_GENERATION_MODE.one],
    [PRODUCT_CREATION_MODE.multiple, PRODUCT_GENERATION_MODE.many],
  ] as const)('uses %s generation mode', (creationMode, generationMode) => {
    setup({ creationMode });

    expect(mocks.generationMode).toBe(generationMode);
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

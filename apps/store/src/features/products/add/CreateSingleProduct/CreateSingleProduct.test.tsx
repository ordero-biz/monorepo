import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateSingleProduct } from './CreateSingleProduct';

const mocks = vi.hoisted(() => ({
  onCreated: undefined as undefined | (() => Promise<void> | void),
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
  CreateProduct: ({ onSubmit }: { onSubmit: () => void }) => (
    <button onClick={onSubmit} type="button">
      Create product
    </button>
  ),
  useCreateProductForm: ({
    onCreated,
  }: {
    onCreated: () => Promise<void> | void;
  }) => {
    mocks.onCreated = onCreated;

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
    mocks.onCreated = undefined;
    mocks.push.mockReset();
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

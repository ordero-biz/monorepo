import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType } from 'react';
import { clientRoutes } from '@/lib/client/routes';
import {
  productGroupsQueryKeys,
  productVariantsQueryKeys,
} from '@/lib/query/products/productsQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateMultipleProducts } from './CreateMultipleProducts';
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

vi.mock('./CreateProduct', async () => ({
  ...(await vi.importActual<typeof import('./CreateProduct')>(
    './CreateProduct'
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

vi.mock('./CreateProduct/hooks/useProductGenerationState', () => ({
  useProductGenerationState: () => ({}),
}));

const setupWorkflow = (component: ComponentType) => {
  const { setup } = prepareStoreSetup({ component });

  return setup();
};

describe.each([
  ['single-product creation', CreateSingleProduct],
  ['multiple-product creation', CreateMultipleProducts],
])('%s workflow', (_, Workflow) => {
  beforeEach(() => {
    mocks.onCreated = undefined;
    mocks.push.mockReset();
  });

  it('refreshes product lists and returns to products after creation', async () => {
    const user = userEvent.setup();
    const { queryClient } = setupWorkflow(Workflow);
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

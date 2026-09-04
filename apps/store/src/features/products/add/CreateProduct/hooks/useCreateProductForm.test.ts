import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitCreateProduct } from '../utils/submitAction';
import { useCreateProductForm } from './useCreateProductForm';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('../utils/submitAction', async () => ({
  ...(await vi.importActual<typeof import('../utils/submitAction')>(
    '../utils/submitAction'
  )),
  submitCreateProduct: vi.fn(),
}));

const submitCreateProductMock = vi.mocked(submitCreateProduct);
const validateProduct = () => undefined;

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onCreated: vi.fn(),
    validateProduct,
  },
  useFormHook: useCreateProductForm,
});

const setupCreateProductFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onCreated: vi.fn(),
    validateProduct,
  };
  const result = setup({
    hookProps,
  });

  return {
    onCreated: result.hookProps?.onCreated ?? hookProps.onCreated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
    ...result,
  };
};

describe('useCreateProductForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitCreateProductMock.mockReset();
  });

  it('runs the created callback after a successful submit', async () => {
    submitCreateProductMock.mockResolvedValue({
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
    const { onCreated, submitButton, user } = setupCreateProductFormHook();

    await user.click(submitButton);

    await waitFor(() => expect(onCreated).toHaveBeenCalledTimes(1));
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Product Running Shoes was created',
      type: 'success',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitCreateProductMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          productName: 'Product name already exists.',
        },
        formError: 'Product creation failed.',
      },
    });
    const { onCreated, submitButton, user } = setupCreateProductFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Product creation failed.',
        type: 'error',
      })
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});

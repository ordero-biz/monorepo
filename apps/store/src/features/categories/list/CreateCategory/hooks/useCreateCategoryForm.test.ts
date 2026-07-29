import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitCreateCategory } from '../utils/submitAction';
import { useCreateCategoryForm } from './useCreateCategoryForm';

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
  submitCreateCategory: vi.fn(),
}));

const submitCreateCategoryMock = vi.mocked(submitCreateCategory);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    onCreated: vi.fn(),
  },
  useFormHook: useCreateCategoryForm,
});

const setupCreateCategoryFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    onCreated: vi.fn(),
  };
  const result = setup({
    hookProps,
  });

  return {
    onCreated: result.hookProps.onCreated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
    ...result,
  };
};

describe('useCreateCategoryForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitCreateCategoryMock.mockReset();
  });

  it('runs the created callback after a successful submit', async () => {
    submitCreateCategoryMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Sneakers',
        sortOrder: 15,
        color: '#16a34a',
        createdAt: '2026-07-01T11:22:53.562Z',
      },
    });
    const { onCreated, submitButton, user } = setupCreateCategoryFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(onCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 3,
          name: 'Sneakers',
        })
      )
    );
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Category Sneakers was added',
      type: 'success',
    });
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitCreateCategoryMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Category name already exists.',
        },
        formError: 'Category creation failed.',
      },
    });
    const { onCreated, submitButton, user } = setupCreateCategoryFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Category creation failed.',
        type: 'error',
      })
    );
    expect(onCreated).not.toHaveBeenCalled();
  });
});

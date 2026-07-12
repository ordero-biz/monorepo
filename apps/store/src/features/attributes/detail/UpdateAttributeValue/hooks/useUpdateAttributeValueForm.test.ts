import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitUpdateAttributeValue } from '../utils/submitAction';
import { useUpdateAttributeValueForm } from './useUpdateAttributeValueForm';

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
  submitUpdateAttributeValue: vi.fn(),
}));

const submitUpdateAttributeValueMock = vi.mocked(submitUpdateAttributeValue);

const { setup } = prepareFormHookTestSetup({
  hookProps: {
    attributeValueId: 3,
    initialName: 'Blue',
    initialSortOrder: 0,
    onUpdated: vi.fn(),
  },
  useFormHook: useUpdateAttributeValueForm,
});

const setupUpdateAttributeValueFormHook = () => {
  const user = userEvent.setup();
  const hookProps = {
    attributeValueId: 3,
    initialName: 'Blue',
    initialSortOrder: 0,
    onUpdated: vi.fn(),
  };
  const result = setup({
    hookProps,
  });

  return {
    onUpdated: result.hookProps.onUpdated,
    submitButton: screen.getByRole('button', { name: 'Submit' }),
    user,
    ...result,
  };
};

describe('useUpdateAttributeValueForm', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    submitUpdateAttributeValueMock.mockReset();
  });

  it('submits the attribute value id and default form values before reporting success', async () => {
    submitUpdateAttributeValueMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Navy',
        sortOrder: 0,
        createdAt: '2026-06-25T18:13:29.608Z',
      },
    });
    const { onUpdated, submitButton, user } =
      setupUpdateAttributeValueFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(submitUpdateAttributeValueMock).toHaveBeenCalledWith({
        attributeValueId: 3,
        value: {
          name: 'Blue',
          sortOrder: 0,
        },
      })
    );
    expect(onUpdated).toHaveBeenCalled();
  });

  it('shows a toast when submit fails with a form-level error', async () => {
    submitUpdateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        fieldErrors: {
          name: 'Attribute value name already exists.',
        },
        formError: 'Attribute value update failed.',
      },
    });
    const { onUpdated, submitButton, user } =
      setupUpdateAttributeValueFormHook();

    await user.click(submitButton);

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Attribute value update failed.',
        type: 'error',
      })
    );
    expect(onUpdated).not.toHaveBeenCalled();
  });
});

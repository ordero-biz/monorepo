import { act, renderHook, waitFor } from '@testing-library/react';
import { updateAttributeValue } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { ATTRIBUTE_VALUE_STATUS } from '@/lib/domain/attributes/constants';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useActivateAttributeValue } from './useActivateAttributeValue';

const { addToastMock } = vi.hoisted(() => ({
  addToastMock: vi.fn(),
}));

vi.mock('@ordero/ui', async () => ({
  ...(await vi.importActual<typeof import('@ordero/ui')>('@ordero/ui')),
  useToastManager: () => ({
    add: addToastMock,
  }),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  updateAttributeValue: vi.fn(),
}));

const updateAttributeValueMock = vi.mocked(updateAttributeValue);

const setupActivateAttributeValueHook = () => {
  const onActivated = vi.fn();
  const queryClient = createTestQueryClient();
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const TestQueryProvider = createTestQueryProvider(queryClient);

  const { result } = renderHook(
    () =>
      useActivateAttributeValue({
        attributeId: 7,
        attributeValueId: 3,
        attributeValueName: 'Blue',
        onActivated,
      }),
    {
      wrapper: TestQueryProvider,
    }
  );

  return {
    invalidateQueriesSpy,
    onActivated,
    result,
  };
};

describe('useActivateAttributeValue', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    updateAttributeValueMock.mockReset();
  });

  it('activates the attribute value, refreshes its collection, shows success toast, and runs onActivated', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: true,
      data: {
        id: 3,
        name: 'Blue',
        sortOrder: 0,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
    const { invalidateQueriesSpy, onActivated, result } =
      setupActivateAttributeValueHook();

    expect(result.current.isActivating).toBe(false);

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(updateAttributeValueMock).toHaveBeenCalledWith({
        attributeValueId: 3,
        status: ATTRIBUTE_VALUE_STATUS.ACTIVE,
      })
    );
    await waitFor(() => expect(onActivated).toHaveBeenCalled());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.values(7),
    });
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute value Blue was published',
      type: 'success',
    });
    expect(result.current.isActivating).toBe(false);
  });

  it('shows an error toast and skips success callbacks when activation fails', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        code: API_ERROR_CODES.ACTIVE_ATTRIBUTE_VALUE_REQUIRES_ACTIVE_ATTRIBUTE,
        message: 'Conflict',
      },
    });
    const { onActivated, result } = setupActivateAttributeValueHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Publish the attribute first to publish its values',
        type: 'error',
      })
    );
    expect(onActivated).not.toHaveBeenCalled();
    expect(result.current.isActivating).toBe(false);
  });

  it('maps the active attribute value modification error', async () => {
    updateAttributeValueMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.ATTRIBUTE_VALUE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const { onActivated, result } = setupActivateAttributeValueHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Active attribute values cannot be edited',
        type: 'error',
      })
    );
    expect(onActivated).not.toHaveBeenCalled();
  });
});

import { act, renderHook, waitFor } from '@testing-library/react';
import { updateAttribute } from '@/lib/client/api/attributes';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import {
  createTestQueryClient,
  createTestQueryProvider,
} from '@/test/prepareSetup';
import { useActivateAttribute } from './useActivateAttribute';

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
  updateAttribute: vi.fn(),
}));

const updateAttributeMock = vi.mocked(updateAttribute);

const setupActivateAttributeHook = () => {
  const onActivated = vi.fn();
  const queryClient = createTestQueryClient();
  const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
  const TestQueryProvider = createTestQueryProvider(queryClient);

  const { result } = renderHook(
    () =>
      useActivateAttribute({
        attributeId: 7,
        attributeName: 'Color',
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

describe('useActivateAttribute', () => {
  beforeEach(() => {
    addToastMock.mockClear();
    updateAttributeMock.mockReset();
  });

  it('activates the attribute, invalidates queries, shows success toast, and runs onActivated', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: true,
      data: {
        id: 7,
        name: 'Color',
        sortOrder: 10,
        status: ATTRIBUTE_STATUS.ACTIVE,
        createdAt: '2026-06-24T20:07:32.467Z',
      },
    });
    const { invalidateQueriesSpy, onActivated, result } =
      setupActivateAttributeHook();

    expect(result.current.isActivating).toBe(false);

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(updateAttributeMock).toHaveBeenCalledWith({
        attributeId: 7,
        status: ATTRIBUTE_STATUS.ACTIVE,
      })
    );
    await waitFor(() => expect(onActivated).toHaveBeenCalled());
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.list,
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: attributesQueryKeys.detail(7),
    });
    expect(addToastMock).toHaveBeenCalledWith({
      description: 'Attribute Color was published',
      type: 'success',
    });
    expect(result.current.isActivating).toBe(false);
  });

  it('shows an error toast and skips success callbacks when activation fails', async () => {
    updateAttributeMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.ATTRIBUTE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const { onActivated, result } = setupActivateAttributeHook();

    act(() => {
      result.current.handleActivate();
    });

    await waitFor(() =>
      expect(addToastMock).toHaveBeenCalledWith({
        description: 'Active attributes cannot be edited',
        type: 'error',
      })
    );
    expect(onActivated).not.toHaveBeenCalled();
    expect(result.current.isActivating).toBe(false);
  });
});

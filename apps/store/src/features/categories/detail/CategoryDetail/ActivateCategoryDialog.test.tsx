import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateCategory } from '@/lib/client/api/categories';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { Category } from '@/lib/domain/categories/types';
import { categoriesQueryKeys } from '@/lib/query/categories/categoriesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateCategoryDialog } from './ActivateCategoryDialog';

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  updateCategory: vi.fn(),
}));

const updateCategoryMock = vi.mocked(updateCategory);
const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

const category: Category = {
  id: 2,
  name: 'Sneakers',
  sortOrder: 15,
  status: CATEGORY_STATUS.DRAFT,
  createdAt: '2026-07-01T11:22:53.562Z',
  parentCategory: {
    id: 1,
    name: 'Shoes',
    createdAt: '2026-07-01T10:54:34.839Z',
  },
};

const { setup } = prepareStoreSetup({
  component: ActivateCategoryDialog,
  props: {
    category,
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
  },
});

describe('ActivateCategoryDialog', () => {
  beforeEach(() => {
    updateCategoryMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('renders confirmation dialog content and cancel button', () => {
    setup();

    const dialog = screen.getByRole('dialog', {
      name: 'Publish category',
    });

    expect(dialog).toBeVisible();
    expect(
      screen.getByText(
        'Are you sure you want to publish this category? Once active, it will be fully functional, available for products, and tracked in analytics.'
      )
    ).toBeVisible();
    expect(
      screen.getByText(
        'This action cannot be undone, and the category will no longer be editable.'
      )
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Publish' })).toBeVisible();
  });

  it('publishes the category, invalidates queries, and closes the dialog on confirm', async () => {
    updateCategoryMock.mockResolvedValue({
      ok: true,
      data: {
        ...category,
        status: CATEGORY_STATUS.ACTIVE,
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(updateCategoryMock).toHaveBeenCalledWith({
      categoryId: 2,
      status: CATEGORY_STATUS.ACTIVE,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: categoriesQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: categoriesQueryKeys.detail(2),
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onUpdatedMock).toHaveBeenCalled();
  });

  it('prevents publishing while the request is in flight', async () => {
    let resolveUpdate:
      | ((value: Awaited<ReturnType<typeof updateCategory>>) => void)
      | undefined;

    updateCategoryMock.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const publishButton = screen.getByRole('button', { name: 'Publish' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(publishButton);

    expect(publishButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publishing...' })).toBeVisible();

    resolveUpdate?.({
      ok: true,
      data: {
        ...category,
        status: CATEGORY_STATUS.ACTIVE,
      },
    });

    await screen.findByRole('button', { name: 'Publish' });
  });

  it('shows error toast and keeps the dialog open when activation fails', async () => {
    updateCategoryMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.CATEGORY_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Active categories cannot be edited',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Publish category' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
    expect(onUpdatedMock).not.toHaveBeenCalled();
  });
});

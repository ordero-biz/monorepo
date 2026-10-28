import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  deleteCategories,
  getCategory,
  updateCategory,
} from '@/lib/client/api/categories';
import { clientRoutes } from '@/lib/client/routes';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import type { Category } from '@/lib/domain/categories/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryDetail } from './CategoryDetail';

const routerPushMock = vi.fn();

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: routerPushMock,
  }),
}));

vi.mock('./CategoryDetailChildren', () => ({
  CategoryDetailChildren: ({ categoryId }: { categoryId: string }) => (
    <div>Child categories {categoryId}</div>
  ),
}));

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  deleteCategories: vi.fn(),
  getCategory: vi.fn(),
  updateCategory: vi.fn(),
}));

const deleteCategoriesMock = vi.mocked(deleteCategories);
const getCategoryMock = vi.mocked(getCategory);
const updateCategoryMock = vi.mocked(updateCategory);

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
  component: CategoryDetail,
  props: {
    categoryId: '2',
  },
});

describe('CategoryDetail', () => {
  beforeEach(() => {
    deleteCategoriesMock.mockReset();
    getCategoryMock.mockReset();
    routerPushMock.mockReset();
    updateCategoryMock.mockReset();
  });

  it('refreshes the category once after editing', async () => {
    const updatedCategory = {
      ...category,
      name: 'Running shoes',
    };
    getCategoryMock
      .mockResolvedValueOnce({ ok: true, data: category })
      .mockResolvedValue({ ok: true, data: updatedCategory });
    updateCategoryMock.mockResolvedValue({ ok: true, data: updatedCategory });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Sneakers' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Edit category' })
    );

    const dialog = screen.getByRole('dialog', { name: 'Edit category' });
    const nameField = within(dialog).getByRole('textbox', { name: 'Name' });

    await user.clear(nameField);
    await user.type(nameField, 'Running shoes');
    await user.click(within(dialog).getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByRole('heading', { name: 'Running shoes' })
    ).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Edit category' })
    ).not.toBeInTheDocument();
    expect(updateCategoryMock).toHaveBeenCalledExactlyOnceWith({
      categoryId: 2,
      name: 'Running shoes',
    });
    expect(getCategoryMock).toHaveBeenCalledTimes(2);
  });

  it('renders category details and opens its edit dialog from the actions menu', async () => {
    getCategoryMock.mockResolvedValue({ ok: true, data: category });
    setup();

    expect(
      await screen.findByRole('heading', { name: 'Sneakers' })
    ).toBeVisible();
    expect(screen.getByText('Category details')).toBeVisible();
    expect(screen.getByText('Shoes')).toBeVisible();
    expect(screen.getByText('Child categories 2')).toBeVisible();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Sneakers' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Edit category' })
    );

    expect(screen.getByRole('dialog', { name: 'Edit category' })).toBeVisible();
  });

  it('retries loading after a category request fails', async () => {
    getCategoryMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load category.' },
      })
      .mockResolvedValueOnce({ ok: true, data: category });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this category right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(getCategoryMock).toHaveBeenCalledTimes(2));
  });

  it('refreshes the category once after publishing', async () => {
    getCategoryMock
      .mockResolvedValueOnce({ ok: true, data: category })
      .mockResolvedValue({
        ok: true,
        data: { ...category, status: CATEGORY_STATUS.ACTIVE },
      });
    updateCategoryMock.mockResolvedValue({
      ok: true,
      data: {
        ...category,
        status: CATEGORY_STATUS.ACTIVE,
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(await screen.findByRole('button', { name: 'Publish' }));

    const confirmationDialog = await screen.findByRole('dialog', {
      name: 'Publish category',
    });
    expect(confirmationDialog).toBeVisible();
    expect(
      screen.getByText(
        'Are you sure you want to publish this category? Once active, it will be fully functional, available for products, and tracked in analytics.'
      )
    ).toBeVisible();

    const confirmButton = within(confirmationDialog).getByRole('button', {
      name: 'Publish',
    });

    await user.click(confirmButton);

    await waitFor(() =>
      expect(updateCategoryMock).toHaveBeenCalledWith({
        categoryId: 2,
        status: CATEGORY_STATUS.ACTIVE,
      })
    );
    expect(
      await screen.findByText('Category Sneakers was published')
    ).toBeVisible();
    expect(await screen.findByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('dialog', { name: 'Publish category' })
    ).not.toBeInTheDocument();
    expect(getCategoryMock).toHaveBeenCalledTimes(2);
  });

  it('deletes the category and navigates to the category list', async () => {
    getCategoryMock.mockResolvedValue({ ok: true, data: category });
    deleteCategoriesMock.mockResolvedValue({
      ok: true,
      data: undefined,
    });
    const user = userEvent.setup();

    setup();

    await user.click(
      await screen.findByRole('button', { name: 'Actions for Sneakers' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Delete category' })
    );
    await user.click(
      within(screen.getByRole('dialog', { name: 'Delete category' })).getByRole(
        'button',
        { name: 'Delete' }
      )
    );

    expect(deleteCategoriesMock).toHaveBeenCalledWith({
      categoryIds: [2],
    });
    await waitFor(() =>
      expect(routerPushMock).toHaveBeenCalledWith(clientRoutes.categories)
    );
  });

  it('keeps delete available while hiding publish and edit when category status is active', async () => {
    getCategoryMock.mockResolvedValue({
      ok: true,
      data: {
        ...category,
        status: CATEGORY_STATUS.ACTIVE,
      },
    });

    setup();

    expect(
      await screen.findByRole('heading', { name: 'Sneakers' })
    ).toBeVisible();
    expect(screen.getByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();

    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Sneakers' })
    );

    expect(
      screen.queryByRole('menuitem', { name: 'Edit category' })
    ).not.toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { name: 'Delete category' })
    ).toBeVisible();
  });
});

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryDetailHeader } from './CategoryDetailHeader';
import type { CategoryDetailHeaderProps } from './types';

vi.mock('@/features/categories/detail/UpdateCategory', async () => ({
  ...(await vi.importActual('@/features/categories/detail/UpdateCategory')),
  UpdateCategoryDialog: ({
    onUpdated,
    open,
  }: {
    onUpdated: () => Promise<void> | void;
    open: boolean;
  }) =>
    open ? (
      <button onClick={() => void onUpdated()} type="button">
        Save category
      </button>
    ) : null,
}));

const { setup } = prepareStoreSetup<CategoryDetailHeaderProps>({
  component: CategoryDetailHeader,
  props: {
    onUpdated: vi.fn(),
    category: {
      id: 2,
      name: 'Sneakers',
      sortOrder: 15,
      status: CATEGORY_STATUS.DRAFT,
      createdAt: '2026-07-01T11:22:53.562Z',
      parentCategory: null,
    },
  },
});

describe('CategoryDetailHeader', () => {
  it('opens the edit action from the actions menu', async () => {
    const user = userEvent.setup();
    const { onUpdated } = setup();

    expect(screen.getByRole('heading', { name: 'Sneakers' })).toBeVisible();
    const breadcrumbs = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(
      within(breadcrumbs).getByRole('link', { name: 'Categories' })
    ).toHaveAttribute('href', clientRoutes.categories);
    expect(within(breadcrumbs).getByText('Sneakers')).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByText('Draft')).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Sneakers' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Edit category' })
    );
    await user.click(screen.getByRole('button', { name: 'Save category' }));

    await waitFor(() => expect(onUpdated).toHaveBeenCalled());
  });

  it('opens a confirmation dialog before publishing a draft category', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish category' })
    ).toBeVisible();
  });

  it('hides publish and edit actions for an active category', () => {
    setup({
      category: {
        id: 2,
        name: 'Sneakers',
        sortOrder: 15,
        status: CATEGORY_STATUS.ACTIVE,
        createdAt: '2026-07-01T11:22:53.562Z',
        parentCategory: null,
      },
    });

    expect(screen.getByText('Active')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Publish' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Actions for Sneakers' })
    ).not.toBeInTheDocument();
  });
});

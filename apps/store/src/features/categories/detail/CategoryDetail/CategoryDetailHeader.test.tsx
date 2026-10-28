import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { clientRoutes } from '@/lib/client/routes';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryDetailHeader } from './CategoryDetailHeader';
import type { CategoryDetailHeaderProps } from './types';

vi.mock('next/navigation', async () => ({
  ...(await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  )),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const { setup } = prepareStoreSetup<CategoryDetailHeaderProps>({
  component: CategoryDetailHeader,
  props: {
    onDeleted: vi.fn(),
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

    setup();

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

    expect(screen.getByRole('dialog', { name: 'Edit category' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      'Sneakers'
    );
  });

  it('opens a confirmation dialog before publishing a draft category', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish category' })
    ).toBeVisible();
  });

  it('opens a confirmation dialog from the delete action', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Actions for Sneakers' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Delete category' })
    );

    expect(
      screen.getByRole('dialog', { name: 'Delete category' })
    ).toBeVisible();
  });

  it('keeps delete available while hiding publish and edit for an active category', async () => {
    const user = userEvent.setup();

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

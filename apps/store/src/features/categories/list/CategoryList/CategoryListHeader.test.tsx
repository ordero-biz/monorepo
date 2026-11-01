import { screen, within } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryListHeader } from './CategoryListHeader';

vi.mock('../CreateCategory', () => ({
  CreateCategoryDialogTrigger: () => (
    <button type="button">Add Category</button>
  ),
}));

const { setup } = prepareStoreSetup({
  component: CategoryListHeader,
});

describe('CategoryListHeader', () => {
  it('renders the category title and create action', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Category list' })
    ).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByText(
        'Categories'
      )
    ).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Add Category' })).toBeVisible();
  });
});

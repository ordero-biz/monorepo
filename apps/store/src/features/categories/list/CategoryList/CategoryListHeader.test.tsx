import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryListHeader } from './CategoryListHeader';

vi.mock('../CreateCategory', () => ({
  CreateCategoryDialogTrigger: () => (
    <button type="button">Add Category</button>
  ),
}));

const { setup } = prepareStoreSetup({
  component: CategoryListHeader,
  props: {
    availableCategories: [],
  },
});

describe('CategoryListHeader', () => {
  it('renders the category title and create action', () => {
    setup();

    expect(
      screen.getByRole('heading', { name: 'Category list' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Add Category' })).toBeVisible();
  });
});

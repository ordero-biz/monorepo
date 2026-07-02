import { PageHeader, Typography } from '@ordero/ui';
import type { Category } from '@/lib/domain/categories';
import { CreateCategoryDialog } from '../CreateCategoryDialog/CreateCategoryDialog';

type CategoryListHeaderProps = {
  availableCategories: Category[];
};

export const CategoryListHeader = ({
  availableCategories,
}: CategoryListHeaderProps) => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Category list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateCategoryDialog availableCategories={availableCategories} />
    </PageHeader.Right>
  </PageHeader.Root>
);

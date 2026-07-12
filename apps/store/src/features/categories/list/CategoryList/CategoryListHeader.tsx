import { PageHeader, Typography } from '@ordero/ui';
import { CreateCategoryDialogTrigger } from '../CreateCategory';
import type { CategoryListHeaderProps } from './types';

export const CategoryListHeader = ({
  availableCategories,
}: CategoryListHeaderProps) => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Category list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateCategoryDialogTrigger availableCategories={availableCategories} />
    </PageHeader.Right>
  </PageHeader.Root>
);

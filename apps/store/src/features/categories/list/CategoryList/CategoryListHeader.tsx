import { PageHeader, Typography } from '@ordero/ui';
import { CreateCategoryDialogTrigger } from '../CreateCategory';

export const CategoryListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">Category list</Typography>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateCategoryDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);

import { PageHeader, Typography } from '@ordero/ui';
import { UpdateCategoryDialogTrigger } from '@/features/categories/detail/UpdateCategory';
import type { CategoryDetailHeaderProps } from './types';

export const CategoryDetailHeader = ({
  category,
  onUpdated,
}: CategoryDetailHeaderProps) => (
  <PageHeader.Root>
    <PageHeader.Left>
      <Typography variant="h5">{category.name}</Typography>
      <div>
        <UpdateCategoryDialogTrigger
          category={category}
          onUpdated={onUpdated}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right />
  </PageHeader.Root>
);

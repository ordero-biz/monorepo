import { PageHeader, Typography } from '@ordero/ui';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { categoriesRootBreadcrumb } from '../../shared/breadcrumbs';
import { CreateCategoryDialogTrigger } from '../CreateCategory';

export const CategoryListHeader = () => (
  <PageHeader.Root>
    <PageHeader.Left>
      <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
        <Typography variant="h5">Category list</Typography>
        <StoreBreadcrumbs
          items={[
            {
              id: categoriesRootBreadcrumb.id,
              label: categoriesRootBreadcrumb.label,
            },
          ]}
        />
      </div>
    </PageHeader.Left>
    <PageHeader.Right>
      <CreateCategoryDialogTrigger />
    </PageHeader.Right>
  </PageHeader.Root>
);

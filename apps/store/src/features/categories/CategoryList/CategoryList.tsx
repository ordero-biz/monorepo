'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useCategoriesQuery } from '@/lib/hooks/categories/useCategoriesQuery';
import { CategoryListHeader } from './CategoryListHeader';
import { columns } from './columns';

export const CategoryList = () => {
  const categoriesQuery = useCategoriesQuery();
  const availableCategories = categoriesQuery.data?.content ?? [];

  if (categoriesQuery.isPending) {
    return (
      <div className="flex flex-col gap-[var(--space-2)]">
        <CategoryListHeader availableCategories={availableCategories} />
        <Card.Root variant="filled">
          <Card.Content>
            <Typography color="text-secondary" variant="body2">
              Loading categories...
            </Typography>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <div className="flex flex-col gap-[var(--space-2)]">
        <CategoryListHeader availableCategories={availableCategories} />
        <Card.Root variant="filled">
          <Card.Content>
            <div className="flex flex-col gap-[var(--space-2)]">
              <Typography variant="body2">
                We couldn&apos;t load your categories right now.
              </Typography>
              <div>
                <Button
                  color="inherit"
                  onClick={() => categoriesQuery.refetch()}
                  size="s"
                  type="button"
                >
                  Retry
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <CategoryListHeader availableCategories={availableCategories} />
      <DataTable
        ariaLabel="Category list"
        columns={columns}
        data={categoriesQuery.data.content}
        emptyMessage="No categories found."
        getRowId={(row) => String(row.id)}
      />
    </div>
  );
};

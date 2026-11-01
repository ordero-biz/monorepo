'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import type { Category } from '@/lib/domain/categories/types';
import { useCategoryChildrenQuery } from '@/lib/hooks/categories/useCategoryChildrenQuery';
import { columns } from './columns';
import type { CategoryDetailChildrenProps } from './types';

const getCategoryRowId = (category: Category) => String(category.id);

export const CategoryDetailChildren = ({
  categoryId,
}: CategoryDetailChildrenProps) => {
  const categoryChildrenQuery = useCategoryChildrenQuery(categoryId);

  if (categoryChildrenQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading child categories...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (categoryChildrenQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this category&apos;s children right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => categoryChildrenQuery.refetch()}
                size="s"
                type="button"
              >
                Retry
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <DataTable
      ariaLabel="Child categories"
      columns={columns}
      data={categoryChildrenQuery.data}
      emptyMessage="No child categories found."
      getRowId={getCategoryRowId}
    />
  );
};

'use client';

import { Button, Card, Typography } from '@ordero/ui';
import { useCategoryQuery } from '@/lib/hooks/categories/useCategoryQuery';
import { CategoryDetailHeader } from './CategoryDetailHeader';
import { CategoryDetailInfo } from './CategoryDetailInfo';
import type { CategoryDetailProps } from './types';

export const CategoryDetail = ({ categoryId }: CategoryDetailProps) => {
  const categoryQuery = useCategoryQuery(categoryId);

  if (categoryQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading category...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (categoryQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this category right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => categoryQuery.refetch()}
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
    <div className="flex flex-col gap-[var(--space-2)]">
      <CategoryDetailHeader
        category={categoryQuery.data}
        onUpdated={async () => {
          await categoryQuery.refetch();
        }}
      />
      <CategoryDetailInfo category={categoryQuery.data} />
    </div>
  );
};

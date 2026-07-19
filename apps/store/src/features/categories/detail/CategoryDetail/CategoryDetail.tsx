'use client';

import { Button, Card, Typography } from '@ordero/ui';
import { useCategoriesQuery } from '@/lib/hooks/categories/useCategoriesQuery';
import { useCategoryQuery } from '@/lib/hooks/categories/useCategoryQuery';
import type { CategoryDetailProps } from './types';
import { CategoryDetailHeader } from './CategoryDetailHeader';
import { CategoryDetailInfo } from './CategoryDetailInfo';

const categoryOptionsQueryInput = { page: 0, size: 100 };

export const CategoryDetail = ({ categoryId }: CategoryDetailProps) => {
  const categoryQuery = useCategoryQuery(categoryId);
  const categoriesQuery = useCategoriesQuery(categoryOptionsQueryInput);

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

  const availableCategories = categoriesQuery.data?.content ?? [];
  const parentCategory = categoryQuery.data.parentCategory;
  const categoryOptions =
    parentCategory &&
    !availableCategories.some(({ id }) => id === parentCategory.id)
      ? [...availableCategories, parentCategory]
      : availableCategories;

  return (
    <div className="flex flex-col gap-[var(--space-2)]">
      <CategoryDetailHeader
        availableCategories={categoryOptions}
        category={categoryQuery.data}
        onUpdated={async () => {
          await categoryQuery.refetch();
        }}
      />
      <CategoryDetailInfo category={categoryQuery.data} />
    </div>
  );
};

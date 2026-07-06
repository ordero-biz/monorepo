'use client';

import {
  Button,
  Card,
  DataTable,
  TablePagination,
  Typography,
} from '@ordero/ui';
import { useCategoriesQuery } from '@/lib/hooks/categories/useCategoriesQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import type { PaginationSearchInput } from '@/lib/utils/url';
import { CategoryListHeader } from './CategoryListHeader';
import { columns } from './columns';

type CategoryListProps = {
  paginationInput?: PaginationSearchInput;
};

export const CategoryList = ({ paginationInput }: CategoryListProps) => {
  const categoriesQuery = useCategoriesQuery(paginationInput);
  const tablePagination = useTablePagination({
    pageMetadata: categoriesQuery.data?.page,
    paginationInput,
  });

  if (categoriesQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading categories...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (categoriesQuery.isError) {
    return (
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
    );
  }

  const availableCategories = categoriesQuery.data?.content ?? [];

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
      <TablePagination {...tablePagination} />
    </div>
  );
};

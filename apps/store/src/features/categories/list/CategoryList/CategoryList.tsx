'use client';

import {
  Button,
  Card,
  ContextualActionBar,
  DataTable,
  Typography,
  useDataTableSelection,
} from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import type { Category } from '@/lib/domain/categories/types';
import { useCategoriesQuery } from '@/lib/hooks/categories/useCategoriesQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { DeleteCategoriesDialog } from '../../shared';
import { CategoryListHeader } from './CategoryListHeader';
import { getColumns } from './columns';
import type { CategoryListProps } from './types';

const EMPTY_CATEGORIES: Category[] = [];

const getCategoryRowId = (category: Category) => String(category.id);

const getCategoryCheckboxAriaLabel = (category: Category) =>
  `Select ${category.name}`;

export const CategoryList = ({ paginationInput }: CategoryListProps) => {
  const categoriesQuery = useCategoriesQuery(paginationInput);
  const categories = categoriesQuery.data?.content ?? EMPTY_CATEGORIES;
  const tablePagination = useTablePagination({
    pageMetadata: categoriesQuery.data?.page,
    paginationInput,
  });
  const [deletingCategories, setDeletingCategories] = useState<
    Category[] | null
  >(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteCategory: setDeletingCategory,
      }),
    []
  );

  const {
    clearSelection,
    selectedRows: selectedCategories,
    selection,
  } = useDataTableSelection({
    data: categories,
    getRowCheckboxAriaLabel: getCategoryCheckboxAriaLabel,
    getRowId: getCategoryRowId,
    selectAllCheckboxAriaLabel: 'Select all categories',
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

  return (
    <>
      <div className="flex flex-col gap-[var(--space-2)]">
        <CategoryListHeader />
        <DataTable
          ariaLabel="Category list"
          columns={columns}
          data={categories}
          emptyMessage="No categories found."
          getRowId={getCategoryRowId}
          manualPagination
          pagination={tablePagination}
          selection={selection}
        />
      </div>

      {selectedCategories.length > 0 ? (
        <BaseLayoutContextualActionBar>
          <ContextualActionBar.Root ariaLabel="Category bulk actions">
            <ContextualActionBar.Left>
              <Typography variant="body2">
                {selectedCategories.length} selected
              </Typography>
              <Button
                color="inherit"
                onClick={clearSelection}
                size="s"
                variant="text"
              >
                Clear selection
              </Button>
            </ContextualActionBar.Left>
            <ContextualActionBar.Right>
              <Button
                color="error"
                onClick={() => setDeletingCategories(selectedCategories)}
                size="m"
                startIcon={<Trash2 aria-hidden="true" />}
                variant="soft"
              >
                Delete
              </Button>
            </ContextualActionBar.Right>
          </ContextualActionBar.Root>
        </BaseLayoutContextualActionBar>
      ) : null}

      {deletingCategory ? (
        <DeleteCategoriesDialog
          categories={[deletingCategory]}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingCategory(null);
            }
          }}
          open={Boolean(deletingCategory)}
        />
      ) : null}

      {deletingCategories ? (
        <DeleteCategoriesDialog
          categories={deletingCategories}
          onDeleted={clearSelection}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingCategories(null);
            }
          }}
          open={Boolean(deletingCategories)}
        />
      ) : null}
    </>
  );
};

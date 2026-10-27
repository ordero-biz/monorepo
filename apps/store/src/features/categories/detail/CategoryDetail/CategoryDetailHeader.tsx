'use client';

import { Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { UpdateCategoryDialog } from '@/features/categories/detail/UpdateCategory';
import { AppBreadcrumbs } from '@/lib/components/AppBreadcrumbs';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { DeleteCategoriesDialog } from '../../shared';
import { categoriesRootBreadcrumb } from '../../shared/breadcrumbs';
import { CategoryStatusChip } from '../../shared/CategoryStatusChip';
import { ActivateCategoryDialogTrigger } from './ActivateCategoryDialogTrigger';
import type { CategoryDetailHeaderProps } from './types';

export const CategoryDetailHeader = ({
  category,
  onDeleted,
}: CategoryDetailHeaderProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const isCategoryActive = category.status === CATEGORY_STATUS.ACTIVE;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <div className="flex min-w-0 items-center gap-[var(--space-1)]">
            <Typography variant="h5">{category.name}</Typography>
            <CategoryStatusChip status={category.status} />
          </div>
          <AppBreadcrumbs
            items={[
              categoriesRootBreadcrumb,
              { id: 'current-category', label: category.name },
            ]}
          />
        </div>
      </PageHeader.Left>

      <PageHeader.Right>
        {!isCategoryActive ? (
          <ActivateCategoryDialogTrigger category={category} />
        ) : null}

        <Menu.Root>
          <Menu.Trigger
            aria-label={`Actions for ${category.name}`}
            appearance="iconButton"
            size="s"
            title={`Actions for ${category.name}`}
          >
            <EllipsisVertical aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end">
              <Menu.Popup>
                {!isCategoryActive ? (
                  <Menu.Item onClick={() => setIsUpdateDialogOpen(true)}>
                    <Pencil
                      aria-hidden="true"
                      className="size-[var(--icon-button-xs-icon)]"
                    />
                    Edit category
                  </Menu.Item>
                ) : null}
                <Menu.Item
                  color="error"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2
                    aria-hidden="true"
                    className="size-[var(--icon-button-xs-icon)]"
                  />
                  Delete category
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <DeleteCategoriesDialog
          categories={[category]}
          onDeleted={onDeleted}
          onOpenChange={setIsDeleteDialogOpen}
          open={isDeleteDialogOpen}
        />
        <UpdateCategoryDialog
          category={category}
          onOpenChange={setIsUpdateDialogOpen}
          open={isUpdateDialogOpen}
        />
      </PageHeader.Right>
    </PageHeader.Root>
  );
};

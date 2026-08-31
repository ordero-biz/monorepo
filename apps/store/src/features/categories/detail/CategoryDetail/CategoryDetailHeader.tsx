'use client';

import { Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { UpdateCategoryDialog } from '@/features/categories/detail/UpdateCategory';
import { clientRoutes } from '@/lib/client/routes';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { CategoryStatusChip } from '../../shared/CategoryStatusChip';
import { ActivateCategoryDialogTrigger } from './ActivateCategoryDialogTrigger';
import type { CategoryDetailHeaderProps } from './types';

export const CategoryDetailHeader = ({
  onUpdated,
  category,
}: CategoryDetailHeaderProps) => {
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
          <StoreBreadcrumbs
            items={[
              {
                href: clientRoutes.categories,
                id: 'categories',
                label: 'Categories',
              },
              { id: 'current-category', label: category.name },
            ]}
          />
        </div>
      </PageHeader.Left>

      {!isCategoryActive ? (
        <PageHeader.Right>
          <ActivateCategoryDialogTrigger
            category={category}
            onUpdated={onUpdated}
          />

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
                  <Menu.Item onClick={() => setIsUpdateDialogOpen(true)}>
                    <Pencil
                      aria-hidden="true"
                      className="size-[var(--icon-button-xs-icon)]"
                    />
                    Edit category
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>

          <UpdateCategoryDialog
            category={category}
            onOpenChange={setIsUpdateDialogOpen}
            onUpdated={onUpdated}
            open={isUpdateDialogOpen}
          />
        </PageHeader.Right>
      ) : null}
    </PageHeader.Root>
  );
};

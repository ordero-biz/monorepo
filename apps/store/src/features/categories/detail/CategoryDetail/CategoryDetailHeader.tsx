'use client';

import { Chip, Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { UpdateCategoryDialog } from '@/features/categories/detail/UpdateCategory';
import { CATEGORY_STATUS } from '@/lib/domain/categories';
import { ActivateCategoryDialogTrigger } from './ActivateCategoryDialogTrigger';
import type { CategoryDetailHeaderProps } from './types';

const statusLabels = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
} as const;

export const CategoryDetailHeader = ({
  onUpdated,
  category,
}: CategoryDetailHeaderProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const isCategoryActive = category.status === CATEGORY_STATUS.ACTIVE;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{category.name}</Typography>
        {category.status ? (
          <Chip
            color={isCategoryActive ? 'primary' : 'warning'}
            size="m"
            variant="soft"
          >
            {statusLabels[category.status]}
          </Chip>
        ) : null}
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

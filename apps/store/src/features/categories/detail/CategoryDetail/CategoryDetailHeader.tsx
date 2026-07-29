'use client';

import { Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil } from 'lucide-react';
import { useState } from 'react';
import { UpdateCategoryDialog } from '@/features/categories/detail/UpdateCategory';
import type { CategoryDetailHeaderProps } from './types';

export const CategoryDetailHeader = ({
  onUpdated,
  category,
}: CategoryDetailHeaderProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{category.name}</Typography>
      </PageHeader.Left>
      <PageHeader.Right>
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
    </PageHeader.Root>
  );
};

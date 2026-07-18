'use client';

import { Button, Card, Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useAttributeQuery } from '@/lib/hooks/attributes/useAttributeQuery';
import { CreateAttributeValuesDialogTrigger } from '../CreateAttributeValues';
import { DeleteAttributeDialog } from '../DeleteAttribute';
import { UpdateAttributeDialogTrigger } from '../UpdateAttribute';
import type { AttributeDetailHeaderProps } from './types';

export const AttributeDetailHeader = ({
  attributeId,
}: AttributeDetailHeaderProps) => {
  const attributeQuery = useAttributeQuery(attributeId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (attributeQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading Attribute...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (attributeQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this attribute right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => attributeQuery.refetch()}
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
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">{attributeQuery.data.name}</Typography>
        <div>
          <UpdateAttributeDialogTrigger
            attribute={attributeQuery.data}
            onUpdated={async () => {
              await attributeQuery.refetch();
            }}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
        <CreateAttributeValuesDialogTrigger attributeId={attributeId} />

        <Menu.Root>
          <Menu.Trigger
            aria-label={`Actions for ${attributeQuery.data.name}`}
            appearance="iconButton"
            size="s"
            title={`Actions for ${attributeQuery.data.name}`}
          >
            <EllipsisVertical aria-hidden="true" />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner align="end">
              <Menu.Popup>
                <Menu.Item
                  color="error"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2
                    aria-hidden="true"
                    className="size-[var(--icon-button-xs-icon)]"
                  />
                  Delete attribute
                </Menu.Item>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>

        <DeleteAttributeDialog
          attribute={attributeQuery.data}
          onOpenChange={setIsDeleteDialogOpen}
          open={isDeleteDialogOpen}
        />
      </PageHeader.Right>
    </PageHeader.Root>
  );
};

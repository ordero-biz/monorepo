'use client';

import { Button, Card, Menu, PageHeader, Typography } from '@ordero/ui';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { StoreBreadcrumbs } from '@/features/app-shell';
import { clientRoutes } from '@/lib/client/routes';
import { ATTRIBUTE_STATUS } from '@/lib/domain/attributes/constants';
import { useAttributeQuery } from '@/lib/hooks/attributes/useAttributeQuery';
import { AttributeStatusChip } from '../../shared/AttributeStatusChip';
import { ActivateAttributeDialogTrigger } from '../ActivateAttribute';
import { CreateAttributeValuesDialogTrigger } from '../CreateAttributeValues';
import { DeleteAttributeDialog } from '../DeleteAttribute';
import { UpdateAttributeDialog } from '../UpdateAttribute';
import type { AttributeDetailHeaderProps } from './types';

export const AttributeDetailHeader = ({
  attributeId,
}: AttributeDetailHeaderProps) => {
  const attributeQuery = useAttributeQuery(attributeId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

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

  const isAttributeActive =
    attributeQuery.data.status === ATTRIBUTE_STATUS.ACTIVE;

  return (
    <PageHeader.Root>
      <PageHeader.Left>
        <div className="flex min-w-0 flex-col gap-[var(--space-0-5)]">
          <div className="flex min-w-0 items-center gap-[var(--space-1)]">
            <Typography variant="h5">{attributeQuery.data.name}</Typography>
            <AttributeStatusChip status={attributeQuery.data.status} />
          </div>
          <StoreBreadcrumbs
            items={[
              {
                href: clientRoutes.attributes,
                id: 'attributes',
                label: 'Attributes',
              },
              { id: 'current-attribute', label: attributeQuery.data.name },
            ]}
          />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
        {!isAttributeActive ? (
          <ActivateAttributeDialogTrigger
            attribute={attributeQuery.data}
            onUpdated={async () => {
              await attributeQuery.refetch();
            }}
          />
        ) : null}

        <CreateAttributeValuesDialogTrigger
          attributeId={attributeId}
          attributeStatus={attributeQuery.data.status}
        />

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
                {!isAttributeActive ? (
                  <Menu.Item onClick={() => setIsUpdateDialogOpen(true)}>
                    <Pencil
                      aria-hidden="true"
                      className="size-[var(--icon-button-xs-icon)]"
                    />
                    Edit attribute name
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
        <UpdateAttributeDialog
          attribute={attributeQuery.data}
          onOpenChange={setIsUpdateDialogOpen}
          open={isUpdateDialogOpen}
        />
      </PageHeader.Right>
    </PageHeader.Root>
  );
};

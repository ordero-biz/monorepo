'use client';

import { Button, Card, PageHeader, Typography } from '@ordero/ui';
import { useAttributeQuery } from '@/lib/hooks/attributes/useAttributeQuery';
import { DeleteAttributeDialog } from '../DeleteAttributeDialog/DeleteAttributeDialog';
import { UpdateAttributeDialog } from '../UpdateAttributeDialog/UpdateAttributeDialog';

type AttributeDetailHeaderProps = {
  attributeId: string | number;
};

export const AttributeDetailHeader = ({
  attributeId,
}: AttributeDetailHeaderProps) => {
  const attributeQuery = useAttributeQuery(attributeId);

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
            <UpdateAttributeDialog
              attribute={attributeQuery.data}
              onUpdated={async () => {
                await attributeQuery.refetch();
              }}
            />
            <DeleteAttributeDialog attribute={attributeQuery.data} />
        </div>
      </PageHeader.Left>
      <PageHeader.Right>
      </PageHeader.Right>
    </PageHeader.Root>
  );
};

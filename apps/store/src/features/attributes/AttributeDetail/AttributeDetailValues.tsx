'use client';

import { Button, Card, DataTable, Typography } from '@ordero/ui';
import { useMemo, useState } from 'react';
import type { AttributeValue } from '@/lib/domain/attributes';
import { useAttributeValuesQuery } from '@/lib/hooks/useAttributesQuery';
import { DeleteAttributeValueDialog } from '../DeleteAttributeValueDialog/DeleteAttributeValueDialog';
import { UpdateAttributeValueDialog } from '../UpdateAttributeValueDialog/UpdateAttributeValueDialog';
import { getColumns } from './columns';

type AttributeDetailValuesProps = {
  attributeId: string | number;
};

export const AttributeDetailValues = ({
  attributeId,
}: AttributeDetailValuesProps) => {
  const attributeValuesQuery = useAttributeValuesQuery(attributeId);

  const [updatingAttributeValue, setUpdatingAttributeValue] =
    useState<AttributeValue | null>(null);
  const [deletingAttributeValue, setDeletingAttributeValue] =
    useState<AttributeValue | null>(null);

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteAttributeValue: setDeletingAttributeValue,
        onUpdateAttributeValue: setUpdatingAttributeValue,
      }),
    []
  );

  if (attributeValuesQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading attribute values...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (attributeValuesQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load this attribute&apos;s values right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => attributeValuesQuery.refetch()}
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
      <DataTable
        ariaLabel="Attribute values"
        columns={columns}
        data={attributeValuesQuery.data}
        emptyMessage="No attribute values found."
        getRowId={(row) => String(row.id)}
      />

      {updatingAttributeValue && (
        <UpdateAttributeValueDialog
          attributeId={attributeId}
          attributeValue={updatingAttributeValue}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setUpdatingAttributeValue(null);
            }
          }}
          open={Boolean(updatingAttributeValue)}
        />
      )}

      {deletingAttributeValue && (
        <DeleteAttributeValueDialog
          attributeId={attributeId}
          attributeValue={deletingAttributeValue}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingAttributeValue(null);
            }
          }}
          open={Boolean(deletingAttributeValue)}
        />
      )}
    </>
  );
};

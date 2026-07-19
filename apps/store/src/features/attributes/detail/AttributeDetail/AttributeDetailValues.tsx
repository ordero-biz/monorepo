'use client';

import {
  Button,
  Card,
  DataTable,
  type DataTableRowSelectionState,
  Typography,
} from '@ordero/ui';
import { Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AttributeValue } from '@/lib/domain/attributes';
import { useAttributeValuesQuery } from '@/lib/hooks/attributes/useAttributeValuesQuery';
import {
  DeleteAttributeValueDialog,
  DeleteAttributeValuesDialog,
} from '../DeleteAttributeValue';
import { UpdateAttributeValueDialog } from '../UpdateAttributeValue';
import { getColumns } from './columns';
import type { AttributeDetailValuesProps } from './types';

export const AttributeDetailValues = ({
  attributeId,
}: AttributeDetailValuesProps) => {
  const attributeValuesQuery = useAttributeValuesQuery(attributeId);

  const [updatingAttributeValue, setUpdatingAttributeValue] =
    useState<AttributeValue | null>(null);
  const [deletingAttributeValue, setDeletingAttributeValue] =
    useState<AttributeValue | null>(null);
  const [deletingAttributeValues, setDeletingAttributeValues] = useState<
    AttributeValue[] | null
  >(null);
  const [rowSelection, setRowSelection] =
    useState<DataTableRowSelectionState>({});

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteAttributeValue: setDeletingAttributeValue,
        onUpdateAttributeValue: setUpdatingAttributeValue,
      }),
    []
  );
  const selection = useMemo(
    () => ({
      getRowCheckboxAriaLabel: (attributeValue: AttributeValue) =>
        `Select ${attributeValue.name}`,
      onRowSelectionChange: setRowSelection,
      rowSelection,
      selectAllCheckboxAriaLabel: 'Select all attribute values',
    }),
    [rowSelection]
  );
  const selectedAttributeValues = useMemo(
    () =>
      attributeValuesQuery.data?.filter(
        (attributeValue) => rowSelection[String(attributeValue.id)]
      ) ?? [],
    [attributeValuesQuery.data, rowSelection]
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
      <div
        className={
          selectedAttributeValues.length > 0 ? 'pb-[var(--space-20)]' : undefined
        }
      >
        <DataTable
          ariaLabel="Attribute values"
          columns={columns}
          data={attributeValuesQuery.data}
          emptyMessage="No attribute values found."
          getRowId={(row) => String(row.id)}
          selection={selection}
        />
      </div>

      {selectedAttributeValues.length > 0 ? (
        <aside
          aria-label="Attribute value bulk actions"
          className="fixed right-[var(--space-4)] bottom-[var(--space-4)] left-[calc(var(--base-layout-main-offset)_+_var(--space-4))] z-40 flex justify-center"
        >
          <div className="w-full max-w-[var(--base-layout-content-max-width)]">
            <Card.Root variant="filled">
              <Card.Content>
                <div className="flex items-center justify-between gap-[var(--space-2)]">
                  <Typography variant="body1">
                    {selectedAttributeValues.length} selected
                  </Typography>
                  <div className="flex items-center gap-[var(--space-1)]">
                    <Button
                      color="inherit"
                      onClick={() => setRowSelection({})}
                      size="s"
                      variant="text"
                    >
                      Clear selection
                    </Button>
                    <Button
                      color="error"
                      onClick={() =>
                        setDeletingAttributeValues(selectedAttributeValues)
                      }
                      size="s"
                      startIcon={<Trash2 aria-hidden="true" />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          </div>
        </aside>
      ) : null}

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

      {deletingAttributeValues && (
        <DeleteAttributeValuesDialog
          attributeId={attributeId}
          attributeValues={deletingAttributeValues}
          onDeleted={() => setRowSelection({})}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingAttributeValues(null);
            }
          }}
          open={Boolean(deletingAttributeValues)}
        />
      )}
    </>
  );
};

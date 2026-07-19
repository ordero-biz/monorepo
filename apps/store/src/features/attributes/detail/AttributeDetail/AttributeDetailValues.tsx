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
import type { AttributeValue } from '@/lib/domain/attributes';
import { useAttributeValuesQuery } from '@/lib/hooks/attributes/useAttributeValuesQuery';
import {
  DeleteAttributeValueDialog,
  DeleteAttributeValuesDialog,
} from '../DeleteAttributeValue';
import { UpdateAttributeValueDialog } from '../UpdateAttributeValue';
import { getColumns } from './columns';
import type { AttributeDetailValuesProps } from './types';

const getAttributeValueRowId = (attributeValue: AttributeValue) =>
  String(attributeValue.id);

const getAttributeValueCheckboxAriaLabel = (attributeValue: AttributeValue) =>
  `Select ${attributeValue.name}`;

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

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteAttributeValue: setDeletingAttributeValue,
        onUpdateAttributeValue: setUpdatingAttributeValue,
      }),
    []
  );
  const {
    clearSelection,
    selectedRows: selectedAttributeValues,
    selection,
  } = useDataTableSelection({
    data: attributeValuesQuery.data,
    getRowCheckboxAriaLabel: getAttributeValueCheckboxAriaLabel,
    getRowId: getAttributeValueRowId,
    selectAllCheckboxAriaLabel: 'Select all attribute values',
  });

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
        getRowId={getAttributeValueRowId}
        selection={selection}
      />

      {selectedAttributeValues.length > 0 ? (
        <BaseLayoutContextualActionBar>
          <ContextualActionBar.Root ariaLabel="Attribute value bulk actions">
            <ContextualActionBar.Left>
              <Typography variant="body1">
                {selectedAttributeValues.length} selected
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
                variant="soft"
                color="error"
                onClick={() =>
                  setDeletingAttributeValues(selectedAttributeValues)
                }
                size="s"
                startIcon={<Trash2 aria-hidden="true" />}
              >
                Delete
              </Button>
            </ContextualActionBar.Right>
          </ContextualActionBar.Root>
        </BaseLayoutContextualActionBar>
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
          onDeleted={clearSelection}
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

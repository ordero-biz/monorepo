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
import type { Attribute } from '@/lib/domain/attributes/types';
import { useAttributesQuery } from '@/lib/hooks/attributes/useAttributesQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { DeleteAttributesDialog } from '../../shared';
import { getColumns } from './columns';
import type { AttributesListProps } from './types';

const EMPTY_ATTRIBUTES: Attribute[] = [];

const getAttributeRowId = (attribute: Attribute) => String(attribute.id);

const getAttributeCheckboxAriaLabel = (attribute: Attribute) =>
  `Select ${attribute.name}`;

export const AttributesList = ({ paginationInput }: AttributesListProps) => {
  const attributesQuery = useAttributesQuery(paginationInput);
  const attributes = attributesQuery.data?.content ?? EMPTY_ATTRIBUTES;
  const tablePagination = useTablePagination({
    pageMetadata: attributesQuery.data?.page,
    paginationInput,
  });
  const [deletingAttributes, setDeletingAttributes] = useState<
    Attribute[] | null
  >(null);
  const [deletingAttribute, setDeletingAttribute] = useState<Attribute | null>(
    null
  );

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteAttribute: setDeletingAttribute,
      }),
    []
  );

  const {
    clearSelection,
    selectedRows: selectedAttributes,
    selection,
  } = useDataTableSelection({
    data: attributes,
    getRowCheckboxAriaLabel: getAttributeCheckboxAriaLabel,
    getRowId: getAttributeRowId,
    selectAllCheckboxAriaLabel: 'Select all attributes',
  });

  if (attributesQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading attributes...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (attributesQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your attributes right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => attributesQuery.refetch()}
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
        ariaLabel="Attributes list"
        columns={columns}
        data={attributes}
        emptyMessage="No attributes found."
        getRowId={getAttributeRowId}
        manualPagination
        pagination={tablePagination}
        selection={selection}
      />

      {selectedAttributes.length > 0 ? (
        <BaseLayoutContextualActionBar>
          <ContextualActionBar.Root ariaLabel="Attribute bulk actions">
            <ContextualActionBar.Left>
              <Typography variant="body2">
                {selectedAttributes.length} selected
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
                color="error"
                onClick={() => setDeletingAttributes(selectedAttributes)}
                size="m"
                startIcon={<Trash2 aria-hidden="true" />}
                variant="soft"
              >
                Delete
              </Button>
            </ContextualActionBar.Right>
          </ContextualActionBar.Root>
        </BaseLayoutContextualActionBar>
      ) : null}

      {deletingAttribute ? (
        <DeleteAttributesDialog
          attributes={[deletingAttribute]}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingAttribute(null);
            }
          }}
          open={Boolean(deletingAttribute)}
        />
      ) : null}

      {deletingAttributes ? (
        <DeleteAttributesDialog
          attributes={deletingAttributes}
          onDeleted={clearSelection}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingAttributes(null);
            }
          }}
          open={Boolean(deletingAttributes)}
        />
      ) : null}
    </>
  );
};

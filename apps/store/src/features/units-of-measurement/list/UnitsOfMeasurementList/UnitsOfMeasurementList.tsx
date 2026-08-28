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
import type { UnitOfMeasurement } from '@/lib/domain/units-of-measurement/types';
import { useUnitsOfMeasurementQuery } from '@/lib/hooks/units-of-measurement/useUnitsOfMeasurementQuery';
import { useTablePagination } from '@/lib/hooks/useTablePagination';
import { DeleteUnitsOfMeasurementDialog } from '../../shared';
import { getColumns } from './columns';
import type { UnitsOfMeasurementListProps } from './types';

const getUnitOfMeasurementRowId = (unitOfMeasurement: UnitOfMeasurement) =>
  String(unitOfMeasurement.id);

const getUnitOfMeasurementCheckboxAriaLabel = (
  unitOfMeasurement: UnitOfMeasurement
) => `Select ${unitOfMeasurement.name}`;

export const UnitsOfMeasurementList = ({
  paginationInput,
}: UnitsOfMeasurementListProps) => {
  const unitsOfMeasurementQuery = useUnitsOfMeasurementQuery(paginationInput);

  const tablePagination = useTablePagination({
    pageMetadata: unitsOfMeasurementQuery.data?.page,
    paginationInput,
  });

  const [deletingUnitsOfMeasurement, setDeletingUnitsOfMeasurement] = useState<
    UnitOfMeasurement[] | null
  >(null);
  const [deletingUnitOfMeasurement, setDeletingUnitOfMeasurement] =
    useState<UnitOfMeasurement | null>(null);

  const columns = useMemo(
    () =>
      getColumns({
        onDeleteUnitOfMeasurement: setDeletingUnitOfMeasurement,
      }),
    []
  );

  const {
    clearSelection,
    selectedRows: selectedUnitsOfMeasurement,
    selection,
  } = useDataTableSelection({
    data: unitsOfMeasurementQuery.data?.content ?? [],
    getRowCheckboxAriaLabel: getUnitOfMeasurementCheckboxAriaLabel,
    getRowId: getUnitOfMeasurementRowId,
    selectAllCheckboxAriaLabel: 'Select all units of measurement',
  });

  if (unitsOfMeasurementQuery.isPending) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <Typography color="text-secondary" variant="body2">
            Loading units of measurement...
          </Typography>
        </Card.Content>
      </Card.Root>
    );
  }

  if (unitsOfMeasurementQuery.isError) {
    return (
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="body2">
              We couldn&apos;t load your units of measurement right now.
            </Typography>
            <div>
              <Button
                color="inherit"
                onClick={() => unitsOfMeasurementQuery.refetch()}
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
        ariaLabel="Units of measurement list"
        columns={columns}
        data={unitsOfMeasurementQuery.data.content}
        emptyMessage="No units of measurement found."
        getRowId={getUnitOfMeasurementRowId}
        manualPagination
        pagination={tablePagination}
        selection={selection}
      />

      {selectedUnitsOfMeasurement.length > 0 ? (
        <BaseLayoutContextualActionBar>
          <ContextualActionBar.Root ariaLabel="Unit of measurement bulk actions">
            <ContextualActionBar.Left>
              <Typography variant="body2">
                {selectedUnitsOfMeasurement.length} selected
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
                onClick={() =>
                  setDeletingUnitsOfMeasurement(selectedUnitsOfMeasurement)
                }
                size="s"
                startIcon={<Trash2 aria-hidden="true" />}
                variant="soft"
              >
                Delete
              </Button>
            </ContextualActionBar.Right>
          </ContextualActionBar.Root>
        </BaseLayoutContextualActionBar>
      ) : null}

      {deletingUnitOfMeasurement ? (
        <DeleteUnitsOfMeasurementDialog
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingUnitOfMeasurement(null);
            }
          }}
          open={Boolean(deletingUnitOfMeasurement)}
          unitsOfMeasurement={[deletingUnitOfMeasurement]}
        />
      ) : null}

      {deletingUnitsOfMeasurement ? (
        <DeleteUnitsOfMeasurementDialog
          onDeleted={clearSelection}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              setDeletingUnitsOfMeasurement(null);
            }
          }}
          open={Boolean(deletingUnitsOfMeasurement)}
          unitsOfMeasurement={deletingUnitsOfMeasurement}
        />
      ) : null}
    </>
  );
};

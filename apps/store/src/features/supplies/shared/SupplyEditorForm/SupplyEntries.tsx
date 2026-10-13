'use client';

import {
  Card,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Menu,
  TextField,
  Typography,
  useDataTableSelection,
} from '@ordero/ui';
import { EllipsisVertical, Package, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import type { ProductVariant } from '@/lib/domain/products/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { formatMoney } from '../formatMoney';
import { SupplyActions } from './SupplyActions';
import {
  ProductVariantsAsyncCombobox,
  UnitsOfMeasurementAsyncCombobox,
} from './selectors';
import type { SupplyEntriesProps, SupplyEntryFormValues } from './types';
import { createEmptySupplyEntry, getSupplyTotal } from './utils';

const getRowId = (entry: SupplyEntryFormValues) => entry.clientId;

const getRowCheckboxAriaLabel = (entry: SupplyEntryFormValues) =>
  `Select ${entry.productVariantName || 'supply entry'}`;

const header = (label: string) => (
  <div className="px-[var(--spacing-2)] py-[var(--spacing-2)]">{label}</div>
);

export const SupplyEntries = ({
  entries,
  form,
  onSaveDraft,
  onFinalize,
  pendingIntent,
}: SupplyEntriesProps) => {
  const nextClientId = useRef(0);
  const placeholderId = entries.at(-1)?.clientId;
  const { clearSelection, selectedRows, selection } = useDataTableSelection({
    data: entries,
    getRowCanSelect: (entry: SupplyEntryFormValues) =>
      entry.clientId !== placeholderId,
    getRowCheckboxAriaLabel,
    getRowId,
    selectAllCheckboxAriaLabel: 'Select all supply entries',
  });

  const deleteRows = useCallback(
    (clientIds: Set<string>) => {
      form.setFieldValue('supplyEntries', (current) =>
        current.filter((entry) => !clientIds.has(entry.clientId))
      );
      clearSelection();
    },
    [clearSelection, form]
  );

  const columns = useMemo<DataTableColumnDef<SupplyEntryFormValues>[]>(
    () => [
      {
        id: 'image',
        cell: ({ row }) => (
          <DataTableCell>
            {row.original.clientId === placeholderId ? null : (
              <div
                aria-label="Product image unavailable"
                className="flex size-[var(--space-5)] items-center justify-center rounded-[var(--radius)] bg-[var(--background-neutral)] text-[var(--text-secondary)]"
                role="img"
              >
                <Package aria-hidden="true" className="size-[var(--space-3)]" />
              </div>
            )}
          </DataTableCell>
        ),
        header: () => header('Image'),
        meta: { width: 64, wrap: 'nowrap' },
      },
      {
        id: 'product',
        cell: ({ row }) => {
          const index = row.index;
          const entry = row.original;

          return (
            <DataTableCell>
              <div className="w-[320px]">
                <form.Field
                  name={`supplyEntries[${index}].productVariantId` as const}
                >
                  {(field) => {
                    const errorText = getFieldSubmitChangeErrorText(
                      field.state.meta
                    );

                    return (
                      <ProductVariantsAsyncCombobox
                        aria-label={`Product for row ${index + 1}`}
                        errorText={errorText}
                        invalid={Boolean(errorText)}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onOptionSelect={(option) => {
                          const variant = option?.data as
                            | ProductVariant
                            | undefined;
                          form.setFieldValue('supplyEntries', (current) => {
                            const updated = current.map((item) =>
                              item.clientId === entry.clientId
                                ? {
                                    ...item,
                                    productVariantId: option?.value ?? null,
                                    productVariantName:
                                      variant?.name ??
                                      option?.displayValue ??
                                      '',
                                    productVariantSku:
                                      variant?.sku ?? entry.productVariantSku,
                                  }
                                : item
                            );

                            if (entry.clientId === placeholderId && option) {
                              return [
                                ...updated,
                                createEmptySupplyEntry(
                                  `new-${nextClientId.current++}`
                                ),
                              ];
                            }

                            return updated;
                          });
                        }}
                        onValueChange={field.handleChange}
                        placeholder="Product *"
                        required
                        size="s"
                        staticOptions={
                          entry.productVariantId && entry.productVariantName
                            ? [
                                {
                                  displayValue: entry.productVariantName,
                                  label: entry.productVariantSku
                                    ? `${entry.productVariantName} · ${entry.productVariantSku}`
                                    : entry.productVariantName,
                                  value: entry.productVariantId,
                                },
                              ]
                            : []
                        }
                        value={field.state.value}
                      />
                    );
                  }}
                </form.Field>
              </div>
            </DataTableCell>
          );
        },
        header: () => header('Product'),
        meta: { minWidth: 352 },
      },
      {
        id: 'unit',
        cell: ({ row }) => {
          const index = row.index;
          const entry = row.original;

          return (
            <DataTableCell>
              <div className="w-[var(--space-16)]">
                <form.Field
                  name={`supplyEntries[${index}].unitOfMeasurementId` as const}
                >
                  {(field) => {
                    const errorText = getFieldSubmitChangeErrorText(
                      field.state.meta
                    );

                    return (
                      <UnitsOfMeasurementAsyncCombobox
                        aria-label={`Unit for row ${index + 1}`}
                        errorText={errorText}
                        invalid={Boolean(errorText)}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onOptionSelect={(option) => {
                          form.setFieldValue('supplyEntries', (current) =>
                            current.map((item) =>
                              item.clientId === entry.clientId
                                ? {
                                    ...item,
                                    unitOfMeasurementName:
                                      option?.displayValue ?? '',
                                  }
                                : item
                            )
                          );
                        }}
                        onValueChange={field.handleChange}
                        placeholder="Unit *"
                        required
                        size="s"
                        staticOptions={
                          entry.unitOfMeasurementId &&
                          entry.unitOfMeasurementName
                            ? [
                                {
                                  displayValue: entry.unitOfMeasurementName,
                                  value: entry.unitOfMeasurementId,
                                },
                              ]
                            : []
                        }
                        value={field.state.value}
                      />
                    );
                  }}
                </form.Field>
              </div>
            </DataTableCell>
          );
        },
        header: () => header('Unit'),
        meta: { minWidth: 160 },
      },
      {
        id: 'quantity',
        cell: ({ row }) => (
          <DataTableCell>
            <div className="w-[105px]">
              <form.Field
                name={`supplyEntries[${row.index}].quantity` as const}
              >
                {(field) => {
                  const errorText = getFieldSubmitChangeErrorText(
                    field.state.meta
                  );

                  return (
                    <TextField
                      aria-label={`Quantity for row ${row.index + 1}`}
                      errorText={errorText}
                      invalid={Boolean(errorText)}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                      placeholder="Quantity *"
                      required
                      size="s"
                      type="number"
                      value={field.state.value}
                    />
                  );
                }}
              </form.Field>
            </div>
          </DataTableCell>
        ),
        header: () => header('Quantity'),
        meta: { minWidth: 120 },
      },
      {
        id: 'unitPrice',
        cell: ({ row }) => (
          <DataTableCell>
            <div className="w-[115px]">
              <form.Field
                name={`supplyEntries[${row.index}].unitPrice` as const}
              >
                {(field) => {
                  const errorText = getFieldSubmitChangeErrorText(
                    field.state.meta
                  );

                  return (
                    <TextField
                      aria-label={`Unit price for row ${row.index + 1}`}
                      errorText={errorText}
                      invalid={Boolean(errorText)}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                      placeholder="Unit price *"
                      required
                      size="s"
                      type="number"
                      value={field.state.value}
                    />
                  );
                }}
              </form.Field>
            </div>
          </DataTableCell>
        ),
        header: () => header('Unit price'),
        meta: { minWidth: 135 },
      },
      {
        id: 'total',
        cell: ({ row }) => {
          const { quantity, unitPrice } = row.original;
          const valid =
            quantity.trim() !== '' &&
            unitPrice.trim() !== '' &&
            Number.isFinite(Number(quantity)) &&
            Number.isFinite(Number(unitPrice));

          return (
            <DataTableCell>
              <Typography variant="body2">
                {valid
                  ? formatMoney(Number(quantity) * Number(unitPrice))
                  : '—'}
              </Typography>
            </DataTableCell>
          );
        },
        header: () => header('Total'),
        meta: { minWidth: 115, wrap: 'nowrap' },
      },
      {
        id: 'comment',
        cell: ({ row }) => (
          <DataTableCell>
            <div className="w-[180px]">
              <form.Field name={`supplyEntries[${row.index}].comment` as const}>
                {(field) => (
                  <TextField
                    aria-label={`Comment for row ${row.index + 1}`}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    placeholder="Comment"
                    size="s"
                    value={field.state.value}
                  />
                )}
              </form.Field>
            </div>
          </DataTableCell>
        ),
        header: () => header('Comment'),
        meta: { minWidth: 195 },
      },
      {
        id: 'actions',
        cell: ({ row }) =>
          row.original.clientId === placeholderId ? null : (
            <DataTableCell variant="actions">
              <Menu.Root>
                <Menu.Trigger
                  aria-label={`Actions for ${row.original.productVariantName || 'supply entry'}`}
                  appearance="iconButton"
                  size="xs"
                >
                  <EllipsisVertical aria-hidden="true" />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner align="end">
                    <Menu.Popup>
                      <Menu.Item
                        color="error"
                        onClick={() =>
                          deleteRows(new Set([row.original.clientId]))
                        }
                      >
                        <Trash2
                          aria-hidden="true"
                          className="size-[var(--icon-button-xs-icon)]"
                        />
                        Delete
                      </Menu.Item>
                    </Menu.Popup>
                  </Menu.Positioner>
                </Menu.Portal>
              </Menu.Root>
            </DataTableCell>
          ),
        header: () => null,
        meta: { align: 'right', width: 48 },
      },
    ],
    [deleteRows, form, placeholderId]
  );

  return (
    <>
      <Card.Root variant="filled">
        <Card.Content>
          <div className="flex flex-col gap-[var(--space-2)]">
            <Typography variant="h6">Supply entries</Typography>
            <DataTable
              ariaLabel="Supply entries"
              columns={columns}
              data={entries}
              emptyMessage="No products in this supply."
              getRowId={getRowId}
              selection={selection}
            />
          </div>
        </Card.Content>
      </Card.Root>

      <SupplyActions
        {...getSupplyTotal(form.state.values)}
        onClearSelection={clearSelection}
        onDeleteSelected={() => deleteRows(new Set(selectedRows.map(getRowId)))}
        onFinalize={onFinalize}
        onSaveDraft={onSaveDraft}
        pendingIntent={pendingIntent}
        selectedCount={selectedRows.length}
      />
    </>
  );
};

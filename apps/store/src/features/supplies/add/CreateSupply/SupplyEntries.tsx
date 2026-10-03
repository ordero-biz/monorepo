'use client';

import {
  Button,
  Card,
  ContextualActionBar,
  DataTable,
  DataTableCell,
  type DataTableColumnDef,
  Dialog,
  Menu,
  TextField,
  Typography,
  useDataTableSelection,
} from '@ordero/ui';
import { EllipsisVertical, LockKeyhole, Package, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { BaseLayoutContextualActionBar } from '@/features/app-shell';
import type { ProductVariant } from '@/lib/domain/products/types';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import {
  ProductVariantsAsyncCombobox,
  UnitsOfMeasurementAsyncCombobox,
} from './selectors';
import type { SupplyEntriesProps, SupplyEntryFormValues } from './types';
import { createEmptySupplyEntry, getSupplyTotal } from './utils';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  }).format(value);

const getRowId = (entry: SupplyEntryFormValues) => entry.clientId;

const getRowCheckboxAriaLabel = (entry: SupplyEntryFormValues) =>
  `Select ${entry.productVariantName || 'supply entry'}`;

const header = (label: string) => (
  <div className="px-[var(--spacing-2)] py-[var(--spacing-2)]">{label}</div>
);

export const SupplyEntries = ({
  entries,
  form,
  readOnly,
  submit,
  submitIntent,
}: SupplyEntriesProps) => {
  const nextClientId = useRef(0);
  const [finalizeDialogOpen, setFinalizeDialogOpen] = useState(false);
  const data = useMemo(
    () => (readOnly ? entries.slice(0, -1) : entries),
    [entries, readOnly]
  );
  const placeholderId = entries.at(-1)?.clientId;
  const { clearSelection, selectedRows, selection } = useDataTableSelection({
    data,
    getRowCanSelect: (entry: SupplyEntryFormValues) =>
      !readOnly && entry.clientId !== placeholderId,
    getRowCheckboxAriaLabel,
    getRowId,
    selectAllCheckboxAriaLabel: 'Select all supply entries',
  });
  const { count, total } = getSupplyTotal(form.state.values);

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
              <div className="min-w-[220px]">
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
                        disabled={readOnly}
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
                        placeholder="Select product *"
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
        meta: { minWidth: 240 },
      },
      {
        id: 'unit',
        cell: ({ row }) => {
          const index = row.index;
          const entry = row.original;

          return (
            <DataTableCell>
              <div className="min-w-[140px]">
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
                        disabled={readOnly}
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
                        placeholder="Select unit *"
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
        meta: { minWidth: 155 },
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
                      readOnly={readOnly}
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
                      readOnly={readOnly}
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
                    readOnly={readOnly}
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
      ...(!readOnly
        ? [
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
              meta: { align: 'right' as const, width: 48 },
            } satisfies DataTableColumnDef<SupplyEntryFormValues>,
          ]
        : []),
    ],
    [deleteRows, form, placeholderId, readOnly]
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
              data={data}
              emptyMessage="No products in this supply."
              getRowId={getRowId}
              selection={readOnly ? undefined : selection}
            />
          </div>
        </Card.Content>
      </Card.Root>

      {!readOnly ? (
        <>
          <div aria-hidden="true" className="h-[var(--space-12)]" />
          <BaseLayoutContextualActionBar>
            {selectedRows.length > 0 ? (
              <ContextualActionBar.Root ariaLabel="Supply entry bulk actions">
                <ContextualActionBar.Left>
                  <Typography variant="body2">
                    {selectedRows.length} selected
                  </Typography>
                  <Button
                    color="inherit"
                    onClick={clearSelection}
                    size="s"
                    type="button"
                    variant="text"
                  >
                    Clear selection
                  </Button>
                </ContextualActionBar.Left>
                <ContextualActionBar.Right>
                  <Button
                    color="error"
                    onClick={() =>
                      deleteRows(new Set(selectedRows.map(getRowId)))
                    }
                    size="s"
                    startIcon={<Trash2 aria-hidden="true" />}
                    type="button"
                    variant="soft"
                  >
                    Delete
                  </Button>
                </ContextualActionBar.Right>
              </ContextualActionBar.Root>
            ) : (
              <ContextualActionBar.Root ariaLabel="Supply creation actions">
                <ContextualActionBar.Left>
                  <Typography variant="body2">
                    {count} {count === 1 ? 'product' : 'products'} · Total{' '}
                    {formatMoney(total)}
                  </Typography>
                </ContextualActionBar.Left>
                <div className="flex items-center gap-[var(--space-1)] rounded-[var(--radius)] bg-[var(--color-warning-16)] px-[var(--space-2)] py-[var(--space-1)] text-[var(--warning-dark)]">
                  <LockKeyhole
                    aria-hidden="true"
                    className="size-[var(--space-2)] shrink-0"
                  />
                  <p className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)]">
                    After finalization, this supply can no longer be edited.
                  </p>
                </div>
                <ContextualActionBar.Right>
                  <form.Subscribe selector={(state) => state.isSubmitting}>
                    {(isSubmitting) => (
                      <div className="flex items-center gap-[var(--space-1)]">
                        <Button
                          color="inherit"
                          disabled={isSubmitting}
                          onClick={() => submit('draft')}
                          type="button"
                          variant="outlined"
                        >
                          {isSubmitting && submitIntent === 'draft'
                            ? 'Saving...'
                            : 'Save draft'}
                        </Button>
                        <Button
                          color="primary"
                          disabled={isSubmitting || count === 0}
                          onClick={() => setFinalizeDialogOpen(true)}
                          type="button"
                        >
                          Finalize supply
                        </Button>
                      </div>
                    )}
                  </form.Subscribe>
                </ContextualActionBar.Right>
              </ContextualActionBar.Root>
            )}
          </BaseLayoutContextualActionBar>
        </>
      ) : null}

      <Dialog.Root
        onOpenChange={setFinalizeDialogOpen}
        open={finalizeDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              <Dialog.Header>
                <Dialog.Title>Finalize supply</Dialog.Title>
              </Dialog.Header>
              <Dialog.Content>
                <div className="flex flex-col gap-[var(--space-2)]">
                  <Typography variant="body1">
                    Are you sure you want to finalize this supply?
                  </Typography>
                  <Typography variant="body1">
                    <strong>
                      This action cannot be undone. The supply will no longer be
                      editable.
                    </strong>
                  </Typography>
                </div>
              </Dialog.Content>
              <Dialog.Footer closeButtonLabel="Cancel">
                <Button
                  color="primary"
                  onClick={() => {
                    setFinalizeDialogOpen(false);
                    submit('finalize');
                  }}
                  type="button"
                >
                  Finalize supply
                </Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  IconButton,
  Menu,
  NumericField,
  TextField,
  Typography,
} from '@ordero/ui';
import { ArrowUpToLine, EllipsisVertical, Trash2 } from 'lucide-react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { WarehouseProductsAsyncCombobox } from '@/features/warehouses/shared/WarehouseProductsAsyncCombobox';
import type { TransferEntryFormValues, TransferForm } from './types';
import {
  getStockItemKey,
  getUnitOfMeasurementLabel,
  hasOnlyBlankTransferEntry,
  isBlankTransferEntry,
} from './utils/entries';
import {
  type TransferEntryValidatedField,
  validateTransferEntryField,
} from './validations';

type GetColumnsArgs = {
  form: TransferForm;
  onDeleteEntry: (clientId: string) => Promise<void>;
};

export const getColumns = ({
  form,
  onDeleteEntry,
}: GetColumnsArgs): DataTableColumnDef<TransferEntryFormValues>[] => {
  const getEntryValidators = (
    index: number,
    field: TransferEntryValidatedField
  ) => ({
    // TanStack also runs change validators on submit.
    onChange: () => {
      const entry = form.getFieldValue(`transferEntries[${index}]`);
      return entry
        ? validateTransferEntryField({ value: entry, field })
        : undefined;
    },
  });

  const getEntryListeners = (index: number) => ({
    onChange: async () => {
      const entry = form.getFieldValue(`transferEntries[${index}]`);
      if (!entry || !isBlankTransferEntry(entry)) {
        return;
      }

      // Clearing the row makes it optional, including fields with existing errors.
      const fields = ['stockItem', 'quantity'] as const;
      await Promise.all(
        fields.map((field) => {
          const name = `transferEntries[${index}].${field}` as const;
          if (form.getFieldMeta(name)?.errors.length) {
            return form.validateField(name, 'change');
          }
          return undefined;
        })
      );
    },
  });

  return [
    {
      id: 'product',
      cell: ({ row, table }) => {
        const index = row.index;
        const currentKey = row.original.stockItem
          ? getStockItemKey(row.original.stockItem)
          : null;
        const pickedKeys = new Set(
          table.options.data.flatMap((entry) =>
            entry.stockItem ? [getStockItemKey(entry.stockItem)] : []
          )
        );

        return (
          <DataTableCell>
            <div className="w-[320px]">
              <form.Field
                listeners={getEntryListeners(index)}
                name={`transferEntries[${index}].stockItem` as const}
                validators={getEntryValidators(index, 'stockItem')}
              >
                {(field) => (
                  <form.Subscribe
                    selector={(state) =>
                      [
                        state.isSubmitting,
                        state.submissionAttempts,
                        state.values.sourceWarehouse?.id ?? null,
                      ] as const
                    }
                  >
                    {([disabled, submissionAttempts, sourceWarehouseId]) => {
                      const errorText = getFieldSubmitChangeErrorText(
                        field.state.meta,
                        submissionAttempts
                      );
                      return (
                        <WarehouseProductsAsyncCombobox
                          aria-label={`Product for row ${index + 1}`}
                          disabled={disabled}
                          errorText={errorText}
                          invalid={Boolean(errorText)}
                          disabledProductKeys={[...pickedKeys].filter(
                            (key) => key !== currentKey
                          )}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onValueChange={field.handleChange}
                          placeholder={
                            sourceWarehouseId === null
                              ? 'Select a source warehouse first'
                              : 'Select product'
                          }
                          required
                          size="s"
                          value={field.state.value}
                          warehouseId={sourceWarehouseId}
                        />
                      );
                    }}
                  </form.Subscribe>
                )}
              </form.Field>
            </div>
          </DataTableCell>
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Product" />
      ),
      meta: { minWidth: 352 },
    },
    {
      id: 'unit',
      cell: ({ row }) => (
        <DataTableCell>
          <Typography variant="body2">
            {row.original.stockItem
              ? getUnitOfMeasurementLabel(
                  row.original.stockItem.unitOfMeasurement
                )
              : '—'}
          </Typography>
        </DataTableCell>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      meta: { minWidth: 120, wrap: 'nowrap' },
    },
    {
      id: 'available',
      cell: ({ row }) => (
        <DataTableCell>
          <Typography variant="body2">
            {row.original.stockItem?.available ?? '—'}
          </Typography>
        </DataTableCell>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Available" />
      ),
      meta: { minWidth: 100, wrap: 'nowrap' },
    },
    {
      id: 'quantity',
      cell: ({ row }) => (
        <DataTableCell width="full">
          <form.Field
            listeners={getEntryListeners(row.index)}
            name={`transferEntries[${row.index}].quantity` as const}
            validators={{
              // The allowed maximum depends on the picked stock line.
              onChangeListenTo: [`transferEntries[${row.index}].stockItem`],
              ...getEntryValidators(row.index, 'quantity'),
            }}
          >
            {(field) => (
              <form.Subscribe
                selector={(state) =>
                  [
                    state.isSubmitting,
                    state.submissionAttempts,
                    state.values.transferEntries[row.index]?.stockItem
                      ?.available,
                  ] as const
                }
              >
                {([disabled, submissionAttempts, available]) => {
                  const errorText = getFieldSubmitChangeErrorText(
                    field.state.meta,
                    submissionAttempts
                  );
                  return (
                    <div className="w-0 min-w-full">
                      <NumericField
                        aria-label={`Quantity for row ${row.index + 1}`}
                        disabled={disabled}
                        endAdornment={
                          available === undefined ? undefined : (
                            <IconButton
                              aria-label={`Use all available for row ${row.index + 1}`}
                              disabled={
                                disabled || field.state.value === available
                              }
                              onClick={() => field.handleChange(available)}
                              size="xs"
                              title="Use all available"
                              type="button"
                            >
                              <ArrowUpToLine aria-hidden="true" />
                            </IconButton>
                          )
                        }
                        errorText={errorText}
                        invalid={Boolean(errorText)}
                        maxFractionDigits={0}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onValueChange={(value) => field.handleChange(value)}
                        required
                        size="s"
                        value={field.state.value}
                      />
                    </div>
                  );
                }}
              </form.Subscribe>
            )}
          </form.Field>
        </DataTableCell>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity to transfer" />
      ),
      meta: { width: 160, wrap: 'nowrap' },
    },
    {
      id: 'comment',
      cell: ({ row }) => (
        <DataTableCell width="full">
          <form.Field
            listeners={getEntryListeners(row.index)}
            name={`transferEntries[${row.index}].comment` as const}
          >
            {(field) => (
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(disabled) => (
                  <TextField
                    aria-label={`Comment for row ${row.index + 1}`}
                    disabled={disabled}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                    placeholder="Add comment"
                    size="s"
                    value={field.state.value}
                  />
                )}
              </form.Subscribe>
            )}
          </form.Field>
        </DataTableCell>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comment" />
      ),
      meta: { minWidth: 195 },
    },
    {
      id: 'actions',
      cell: ({ row, table }) => (
        <DataTableCell variant="actions">
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(disabled) => (
              <Menu.Root>
                <Menu.Trigger
                  aria-label={`Actions for ${row.original.stockItem?.productVariant.name || 'transfer entry'}`}
                  appearance="iconButton"
                  disabled={disabled}
                  size="xs"
                >
                  <EllipsisVertical aria-hidden="true" />
                </Menu.Trigger>
                <Menu.Portal>
                  <Menu.Positioner align="end">
                    <Menu.Popup>
                      <Menu.Item
                        color="error"
                        disabled={
                          disabled ||
                          hasOnlyBlankTransferEntry(table.options.data)
                        }
                        onClick={() => onDeleteEntry(row.original.clientId)}
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
            )}
          </form.Subscribe>
        </DataTableCell>
      ),
      header: () => null,
      meta: { align: 'right', width: 48 },
    },
  ];
};

import {
  DataTableCell,
  type DataTableColumnDef,
  DataTableColumnHeader,
  Menu,
  TextField,
  Typography,
} from '@ordero/ui';
import { EllipsisVertical, Package, Trash2 } from 'lucide-react';
import { getFieldSubmitChangeErrorText } from '@/lib/utils/form/error/field';
import { formatMoney } from '../formatMoney';
import {
  ProductVariantsAsyncCombobox,
  UnitsOfMeasurementAsyncCombobox,
} from './selectors';
import type { SupplyEntriesProps, SupplyEntryFormValues } from './types';
import { hasOnlyBlankSupplyEntry } from './utils';
import {
  type SupplyEntryValidatedField,
  validateSupplyEntryField,
} from './validations';

type GetColumnsArgs = {
  form: SupplyEntriesProps['form'];
  onDeleteEntry: (clientId: string) => Promise<void>;
};

export const getColumns = ({
  form,
  onDeleteEntry,
}: GetColumnsArgs): DataTableColumnDef<SupplyEntryFormValues>[] => {
  const getEntryValidators = (
    index: number,
    field: SupplyEntryValidatedField
  ) => {
    const validate = () => {
      const entry = form.getFieldValue(`supplyEntries[${index}]`);
      return entry
        ? validateSupplyEntryField({ value: entry, field })
        : undefined;
    };
    const rowFields = [
      'productVariant',
      'unitOfMeasurement',
      'quantity',
      'unitPrice',
      'comment',
    ] as const;

    return {
      // TanStack also runs change validators on submit.
      onChange: validate,
      onChangeListenTo: rowFields
        .filter((name) => name !== field)
        .map((name) => `supplyEntries[${index}].${name}` as const),
    };
  };

  return [
    {
      id: 'image',
      cell: () => (
        <DataTableCell>
          <div
            aria-label="Product image unavailable"
            className="flex size-[var(--space-5)] items-center justify-center rounded-[var(--radius)] bg-[var(--background-neutral)] text-[var(--text-secondary)]"
            role="img"
          >
            <Package aria-hidden="true" className="size-[var(--space-3)]" />
          </div>
        </DataTableCell>
      ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      meta: { width: 64, wrap: 'nowrap' },
    },
    {
      id: 'product',
      cell: ({ row }) => {
        const index = row.index;

        return (
          <DataTableCell>
            <div className="w-[320px]">
              <form.Field
                name={`supplyEntries[${index}].productVariant` as const}
                validators={getEntryValidators(index, 'productVariant')}
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
                      onValueChange={field.handleChange}
                      required
                      size="s"
                      value={field.state.value}
                    />
                  );
                }}
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
      cell: ({ row }) => {
        const index = row.index;

        return (
          <DataTableCell>
            <div className="w-[var(--space-16)]">
              <form.Field
                name={`supplyEntries[${index}].unitOfMeasurement` as const}
                validators={getEntryValidators(index, 'unitOfMeasurement')}
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
                      onValueChange={field.handleChange}
                      required
                      size="s"
                      value={field.state.value}
                    />
                  );
                }}
              </form.Field>
            </div>
          </DataTableCell>
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit" />
      ),
      meta: { minWidth: 160 },
    },
    {
      id: 'quantity',
      cell: ({ row }) => (
        <DataTableCell>
          <div className="w-[105px]">
            <form.Field
              name={`supplyEntries[${row.index}].quantity` as const}
              validators={getEntryValidators(row.index, 'quantity')}
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      meta: { minWidth: 120 },
    },
    {
      id: 'unitPrice',
      cell: ({ row }) => (
        <DataTableCell>
          <div className="w-[115px]">
            <form.Field
              name={`supplyEntries[${row.index}].unitPrice` as const}
              validators={getEntryValidators(row.index, 'unitPrice')}
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
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Unit price" />
      ),
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
              {valid ? formatMoney(Number(quantity) * Number(unitPrice)) : '—'}
            </Typography>
          </DataTableCell>
        );
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total" />
      ),
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
                  size="s"
                  value={field.state.value}
                />
              )}
            </form.Field>
          </div>
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
          <Menu.Root>
            <Menu.Trigger
              aria-label={`Actions for ${row.original.productVariant?.name || 'supply entry'}`}
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
                    disabled={hasOnlyBlankSupplyEntry(table.options.data)}
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
        </DataTableCell>
      ),
      header: () => null,
      meta: { align: 'right', width: 48 },
    },
  ];
};

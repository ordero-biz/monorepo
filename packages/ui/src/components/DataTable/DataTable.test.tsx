import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox } from '@/ui/components/Checkbox';
import { DataTable } from './DataTable';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import { DataTableSelectionCell } from './DataTableSelectionCell';
import { DataTableSelectionColumnHeader } from './DataTableSelectionColumnHeader';
import type {
  DataTableColumnDef,
  DataTableProps,
  DataTableSortingState,
} from './types';

type InvoiceRow = {
  amount: string;
  id: string;
  status: string;
};

const columns: DataTableColumnDef<InvoiceRow>[] = [
  {
    accessorKey: 'id',
    header: 'Invoice',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      align: 'right',
      wrap: 'nowrap',
    },
  },
];

const data: InvoiceRow[] = [
  {
    amount: '$250.00',
    id: 'INV-001',
    status: 'Paid',
  },
  {
    amount: '$180.00',
    id: 'INV-002',
    status: 'Pending',
  },
];

describe('DataTable', () => {
  const { setup } = prepareSetup<DataTableProps<InvoiceRow>>({
    component: DataTable<InvoiceRow>,
    props: {
      ariaLabel: 'Invoice table',
      columns,
      data,
    },
  });

  it('renders the configured headers and custom cell content', () => {
    setup({
      columns: [
        {
          accessorKey: 'id',
          cell: ({ row }) => `Invoice ${row.original.id}`,
          header: 'Invoice',
        },
      ],
      data: [
        {
          amount: '$250.00',
          id: 'INV-001',
          status: 'Paid',
        },
      ],
    });

    expect(
      screen.getByRole('table', { name: 'Invoice table' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Invoice' })
    ).toBeInTheDocument();
    expect(screen.getByText('Invoice INV-001')).toBeInTheDocument();
  });

  it('renders the empty state when there are no rows', () => {
    setup({
      data: [],
      emptyMessage: 'Nothing to show here.',
    });

    expect(screen.getByText('Nothing to show here.')).toBeInTheDocument();
  });

  it('supports row selection with row and header checkboxes', async () => {
    const user = userEvent.setup();
    const onRowSelectionChange = vi.fn();

    setup({
      columns: [
        {
          accessorKey: 'id',
          cell: ({ row }) => (
            <Checkbox
              aria-label={`Select ${row.original.id}`}
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onCheckedChange={(checked) => row.toggleSelected(checked)}
            />
          ),
          header: ({ table }) => (
            <Checkbox
              aria-label="Select all rows"
              checked={table.getIsAllRowsSelected()}
              indeterminate={
                table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onCheckedChange={(checked) =>
                table.toggleAllRowsSelected(checked)
              }
            />
          ),
          id: 'selection',
          meta: {
            width: 56,
          },
        },
      ],
      onRowSelectionChange,
      selectable: true,
    });

    const selectFirstRow = screen.getByRole('checkbox', {
      name: 'Select INV-001',
    });

    await user.click(selectFirstRow);

    expect(
      screen.getByRole('checkbox', { name: 'Select INV-001' })
    ).toBeChecked();
    expect(onRowSelectionChange).toHaveBeenCalled();

    const selectAllRows = screen.getByRole('checkbox', {
      name: 'Select all rows',
    });

    await user.click(selectAllRows);

    expect(
      screen.getByRole('checkbox', { name: 'Select all rows' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Select INV-002' })
    ).toBeChecked();
  });

  it('supports row selection with reusable selection wrappers', async () => {
    const user = userEvent.setup();

    setup({
      columns: [
        {
          accessorKey: 'id',
          cell: ({ row }) => (
            <DataTableSelectionCell
              checkboxAriaLabel={`Select ${row.original.id}`}
              row={row}
            >
              <div>{row.original.id}</div>
            </DataTableSelectionCell>
          ),
          header: ({ column, table }) => (
            <DataTableSelectionColumnHeader
              checkboxAriaLabel="Select all rows"
              column={column}
              table={table}
              title="Invoice"
            />
          ),
          id: 'selection',
        },
      ],
      selectable: true,
    });

    await user.click(screen.getByRole('checkbox', { name: 'Select INV-001' }));

    expect(
      screen.getByRole('checkbox', { name: 'Select INV-001' })
    ).toBeChecked();

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));

    expect(
      screen.getByRole('checkbox', { name: 'Select all rows' })
    ).toBeChecked();
    expect(
      screen.getByRole('checkbox', { name: 'Select INV-002' })
    ).toBeChecked();
  });

  it('disables selection for rows excluded by getRowCanSelect', () => {
    setup({
      columns: [
        {
          accessorKey: 'id',
          cell: ({ row }) => (
            <Checkbox
              aria-label={`Select ${row.original.id}`}
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              onCheckedChange={(checked) => row.toggleSelected(checked)}
            />
          ),
          header: 'Selection',
          id: 'selection',
        },
      ],
      getRowCanSelect: (row) => row.status !== 'Pending',
      selectable: true,
    });

    expect(
      screen.getByRole('checkbox', { name: 'Select INV-002' })
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('hides the reusable selection header checkbox when selection is disabled', () => {
    setup({
      columns: [
        {
          accessorKey: 'id',
          cell: ({ row }) => (
            <DataTableSelectionCell
              checkboxAriaLabel={`Select ${row.original.id}`}
              row={row}
            >
              <div>{row.original.id}</div>
            </DataTableSelectionCell>
          ),
          header: ({ column, table }) => (
            <DataTableSelectionColumnHeader
              checkboxAriaLabel="Select all rows"
              column={column}
              table={table}
              title="Selection"
            />
          ),
          id: 'selection',
        },
      ],
      selectable: false,
    });

    expect(
      screen.queryByRole('checkbox', { name: 'Select all rows' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Selection' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'Select INV-001' })
    ).not.toBeInTheDocument();
  });

  it('hides the reusable row checkbox when a row cannot be selected', () => {
    setup({
      columns: [
        {
          accessorKey: 'id',
          cell: ({ row }) => (
            <DataTableSelectionCell
              checkboxAriaLabel={`Select ${row.original.id}`}
              row={row}
            >
              <div>{row.original.id}</div>
            </DataTableSelectionCell>
          ),
          header: 'Selection',
          id: 'selection',
        },
      ],
      getRowCanSelect: (row) => row.status !== 'Pending',
      selectable: true,
    });

    expect(
      screen.getByRole('checkbox', { name: 'Select INV-001' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'Select INV-002' })
    ).not.toBeInTheDocument();
  });

  it('updates row order when a sortable header toggles sorting', async () => {
    const user = userEvent.setup();

    setup({
      columns: [
        {
          accessorKey: 'amount',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
          ),
        },
      ],
      data: [
        {
          amount: '$300.00',
          id: 'INV-003',
          status: 'Unpaid',
        },
        {
          amount: '$100.00',
          id: 'INV-001',
          status: 'Paid',
        },
      ],
    });

    await user.click(screen.getByRole('button', { name: /amount/i }));

    const rows = screen.getAllByRole('row');

    expect(rows[1]).toHaveTextContent('$100.00');
    expect(rows[2]).toHaveTextContent('$300.00');
    expect(
      screen.getByRole('columnheader', { name: 'Amount' })
    ).toHaveAttribute('aria-sort', 'ascending');
  });

  it('supports server-side sorting without locally reordering stale rows', async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();

    const ServerSortedTable = () => {
      const [sorting, setSorting] = useState<DataTableSortingState>([]);

      return (
        <DataTable
          ariaLabel="Server-sorted invoice table"
          columns={[
            {
              accessorKey: 'amount',
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
              ),
            },
          ]}
          data={[
            {
              amount: '$300.00',
              id: 'INV-003',
              status: 'Unpaid',
            },
            {
              amount: '$100.00',
              id: 'INV-001',
              status: 'Paid',
            },
          ]}
          manualSorting
          onSortingChange={(nextSorting) => {
            setSorting(nextSorting);
            onSortingChange(nextSorting);
          }}
          sorting={sorting}
        />
      );
    };

    render(<ServerSortedTable />);

    await user.click(screen.getByRole('button', { name: /amount/i }));

    const rows = screen.getAllByRole('row');

    expect(rows[1]).toHaveTextContent('$300.00');
    expect(rows[2]).toHaveTextContent('$100.00');
    expect(onSortingChange).toHaveBeenCalledWith([
      {
        desc: false,
        id: 'amount',
      },
    ]);
    expect(
      screen.getByRole('columnheader', { name: 'Amount' })
    ).toHaveAttribute('aria-sort', 'ascending');
  });

  it('announces clearing sorting after a sortable header reaches descending order', async () => {
    const user = userEvent.setup();

    setup({
      columns: [
        {
          accessorKey: 'amount',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
          ),
        },
      ],
    });

    const sortButton = screen.getByRole('button', { name: /amount/i });

    await user.click(sortButton);
    await user.click(sortButton);

    expect(sortButton).toHaveAccessibleName(
      'Amount. sorted descending. Activate to clear sorting.'
    );
  });

  it('renders a static title when a helper-backed header is not sortable', () => {
    setup({
      columns: [
        {
          accessorKey: 'amount',
          enableSorting: false,
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
          ),
        },
      ],
    });

    expect(
      screen.getByRole('columnheader', { name: 'Amount' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /amount/i })
    ).not.toBeInTheDocument();
  });
});

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CellContext, HeaderContext } from '@tanstack/react-table';
import { Checkbox } from '@/ui/components/Checkbox';
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumnDef,
} from '@/ui/components/DataTable';
import { IconButton } from '@/ui/components/IconButton';
import { cn } from '@/ui/lib/utils';
import { MoreVertical } from 'lucide-react';

type ProductRow = {
  category: string;
  createdAt: string;
  id: string;
  name: string;
  price: string;
  publish: 'Draft' | 'Published';
  stockLabel: string;
  stockTone: 'error' | 'success' | 'warning';
  stockWidth: string;
};

const rows: ProductRow[] = [
  {
    category: 'Shoes',
    createdAt: '06 May 2022',
    id: 'urban-explorer-sneakers',
    name: 'Urban Explorer Sneakers',
    price: '$16.19',
    publish: 'Published',
    stockLabel: '72 in stock',
    stockTone: 'success',
    stockWidth: '44.15%',
  },
  {
    category: 'Jacket',
    createdAt: '07 Aug 2022',
    id: 'classic-leather-loafers',
    name: 'Classic Leather Loafers',
    price: '$35.71',
    publish: 'Published',
    stockLabel: '12 in stock',
    stockTone: 'warning',
    stockWidth: '44.15%',
  },
  {
    category: 'Jean',
    createdAt: '08 Apr 2022',
    id: 'mountain-trekking-boots',
    name: 'Mountain Trekking Boots',
    price: '$34.30',
    publish: 'Draft',
    stockLabel: 'Out of stock',
    stockTone: 'error',
    stockWidth: '44.15%',
  },
  {
    category: 'Shoes',
    createdAt: '09 Aug 2022',
    id: 'elegance-stiletto-heels',
    name: 'Elegance Stiletto Heels',
    price: '$93.10',
    publish: 'Draft',
    stockLabel: '42 in stock',
    stockTone: 'success',
    stockWidth: '44.15%',
  },
  {
    category: 'Jacket',
    createdAt: '10 Sep 2022',
    id: 'comfy-running-shoes',
    name: 'Comfy Running Shoes',
    price: '$55.47',
    publish: 'Published',
    stockLabel: '22 in stock',
    stockTone: 'success',
    stockWidth: '44.15%',
  },
  {
    category: 'Jean',
    createdAt: '11 Feb 2022',
    id: 'chic-ballet-flats',
    name: 'Chic Ballet Flats',
    price: '$89.09',
    publish: 'Published',
    stockLabel: '22 in stock',
    stockTone: 'success',
    stockWidth: '44.15%',
  },
  {
    category: 'Shoes',
    createdAt: '12 Jan 2022',
    id: 'vintage-oxford-shoes',
    name: 'Vintage Oxford Shoes',
    price: '$44.39',
    publish: 'Published',
    stockLabel: 'Out of stock',
    stockTone: 'error',
    stockWidth: '44.15%',
  },
];

const stockToneClassNames = {
  error: {
    indicator: 'bg-[var(--error-main)]',
    track: 'bg-[var(--color-error-24)]',
  },
  success: {
    indicator: 'bg-[var(--success-main)]',
    track: 'bg-[var(--color-success-24)]',
  },
  warning: {
    indicator: 'bg-[var(--warning-main)]',
    track: 'bg-[var(--color-warning-24)]',
  },
} as const;

const publishToneClassNames = {
  Draft: 'bg-[var(--color-grey-16)] text-card-foreground',
  Published: 'bg-[var(--color-info-16)] text-[var(--info-dark)]',
} as const;

const productColumnHeader = ({ table, column }: HeaderContext<ProductRow, unknown>) => (
  <div className="flex items-center">
    <div className="flex items-center pl-[var(--spacing-1)]">
      <Checkbox
        aria-label="Select all products"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
        size="s"
      />
    </div>
    <DataTableColumnHeader column={column} title="Product" />
  </div>
);

const productColumnCell = ({ row }: CellContext<ProductRow, unknown>) => (
  <div className="flex min-w-0 items-center">
    <div className="flex items-center pl-[var(--spacing-1)]">
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        size="s"
      />
    </div>
    <div className="flex min-w-0 flex-1 items-center py-[var(--spacing-2)]">
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center px-[var(--spacing-2)]">
        <p className="w-full text-card-foreground">{row.original.name}</p>
        <p className="w-full text-muted-foreground">{row.original.category}</p>
      </div>
    </div>
  </div>
);

const renderTextCell = (value: string) => (
  <div className="flex items-center py-[var(--spacing-2)]">
    <div className="px-[var(--spacing-2)]">
      <p className="whitespace-nowrap text-card-foreground">{value}</p>
    </div>
  </div>
);

const columns: DataTableColumnDef<ProductRow>[] = [
  {
    accessorKey: 'name',
    cell: productColumnCell,
    header: productColumnHeader,
  },
  {
    accessorKey: 'createdAt',
    cell: ({ row }) => renderTextCell(row.original.createdAt),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Create at" />
    ),
    meta: { wrap: 'nowrap' },
  },
  {
    accessorKey: 'stockLabel',
    cell: ({ row }) => {
      const tone = stockToneClassNames[row.original.stockTone];

      return (
        <div className="flex items-center justify-end p-[var(--spacing-2)]">
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[var(--spacing-1)]">
            <div
              aria-hidden="true"
              className={cn(
                'relative h-[6px] w-20 overflow-hidden rounded-[50px]',
                tone.track
              )}
            >
              <div
                className={cn('absolute inset-y-0 left-0 rounded-[50px]', tone.indicator)}
                style={{ width: row.original.stockWidth }}
              />
            </div>
            <p className="whitespace-nowrap text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-muted-foreground">
              {row.original.stockLabel}
            </p>
          </div>
        </div>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stock" />
    ),
  },
  {
    accessorKey: 'price',
    cell: ({ row }) => renderTextCell(row.original.price),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    meta: { wrap: 'nowrap' },
  },
  {
    accessorKey: 'publish',
    cell: ({ row }) => (
      <div className="flex items-center p-[var(--spacing-2)]">
        <span
          className={cn(
            'inline-flex h-[var(--label-height)] min-w-[var(--label-min-width)] items-center justify-center rounded-[var(--label-radius)] px-[var(--label-px)] text-center text-[length:var(--label-size-desktop)] leading-[var(--label-line-height-desktop)] font-[var(--label-weight)]',
            publishToneClassNames[row.original.publish]
          )}
        >
          {row.original.publish}
        </span>
      </div>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Publish" />
    ),
    meta: {
      align: 'center',
      wrap: 'nowrap',
    },
  },
  {
    cell: ({ row }) => (
      <div className="flex items-center justify-end p-[var(--spacing-2)]">
        <IconButton
          aria-label={`Open actions for ${row.original.name}`}
          color="default"
          size="s"
        >
          <MoreVertical />
        </IconButton>
      </div>
    ),
    header: () => (
      <div className="w-full p-[var(--spacing-2)]">
        <span className="sr-only">Actions</span>
      </div>
    ),
    id: 'actions',
    meta: {
      align: 'right',
      wrap: 'nowrap',
    },
  },
];

const meta = {
  title: 'Components/DataTable',
  component: DataTable<ProductRow>,
  tags: ['autodocs'],
  args: {
    ariaLabel: 'Products table',
    columns,
    data: rows,
    selectable: true,
  },
} satisfies Meta<typeof DataTable<ProductRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: 'No matching products found.',
  },
};

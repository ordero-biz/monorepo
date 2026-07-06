import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { TablePagination } from '@/ui/components/TablePagination';
import type { TablePaginationProps } from '@/ui/components/TablePagination';

const getLastPage = ({
  count,
  rowsPerPage,
}: {
  count: number;
  rowsPerPage: number;
}) => Math.max(0, Math.ceil(count / rowsPerPage) - 1);

const TablePaginationPreview = (args: TablePaginationProps) => {
  const [dense, setDense] = useState(args.defaultDense ?? args.dense ?? false);
  const [page, setPage] = useState(args.page);
  const [rowsPerPage, setRowsPerPage] = useState(args.rowsPerPage);

  return (
    <TablePagination
      {...args}
      dense={args.showDenseToggle ? dense : args.dense}
      onDenseChange={(nextDense, details) => {
        setDense(nextDense);
        args.onDenseChange?.(nextDense, details);
      }}
      onPageChange={(nextPage) => {
        setPage(nextPage);
        args.onPageChange(nextPage);
      }}
      onRowsPerPageChange={(nextRowsPerPage, details) => {
        setRowsPerPage(nextRowsPerPage);
        setPage((currentPage) =>
          Math.min(
            currentPage,
            getLastPage({
              count: args.count,
              rowsPerPage: nextRowsPerPage,
            })
          )
        );
        args.onRowsPerPageChange?.(nextRowsPerPage, details);
      }}
      page={page}
      rowsPerPage={rowsPerPage}
    />
  );
};

const meta = {
  title: 'Components/TablePagination',
  component: TablePagination,
  tags: ['autodocs'],
  args: {
    count: 11,
    onPageChange: () => undefined,
    onRowsPerPageChange: () => undefined,
    page: 1,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
  },
} satisfies Meta<typeof TablePagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <TablePaginationPreview {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const documentBody = within(document.body);

    await expect(canvas.getByText('6-10 of 11')).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole('combobox', { name: 'Rows per page' })
    );
    await userEvent.click(await documentBody.findByRole('option', { name: '10' }));

    await expect(canvas.getByText('11-11 of 11')).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Go to previous page' })
    );

    await expect(canvas.getByText('1-10 of 11')).toBeInTheDocument();
  },
};

export const WithDenseToggle: Story = {
  args: {
    defaultDense: true,
    onDenseChange: () => undefined,
    showDenseToggle: true,
  },
  render: (args) => <TablePaginationPreview {...args} />,
};

export const FirstPage: Story = {
  args: {
    page: 0,
  },
  render: (args) => <TablePaginationPreview {...args} />,
};

export const LastPage: Story = {
  args: {
    count: 10,
    page: 1,
  },
  render: (args) => <TablePaginationPreview {...args} />,
};

export const Empty: Story = {
  args: {
    count: 0,
    page: 0,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    showDenseToggle: true,
  },
};

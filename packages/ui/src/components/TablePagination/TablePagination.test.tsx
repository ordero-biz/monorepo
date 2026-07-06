import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TablePagination } from './TablePagination';
import type { TablePaginationProps } from './types';

describe('TablePagination', () => {
  const { setup } = prepareSetup<TablePaginationProps>({
    component: TablePagination,
    props: {
      count: 11,
      onPageChange: vi.fn(),
      onRowsPerPageChange: vi.fn(),
      page: 1,
      rowsPerPage: 5,
    },
  });

  it('renders the current row range and rows-per-page value', () => {
    setup();

    expect(
      screen.getByRole('navigation', { name: 'Table pagination' })
    ).toHaveTextContent('Rows per page:');
    expect(screen.getByText('6-10 of 11')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Rows per page' })
    ).toHaveTextContent('5');
  });

  it('moves to the previous and next page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    setup({ onPageChange });

    await user.click(
      screen.getByRole('button', { name: 'Go to previous page' })
    );
    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 0);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 2);
  });

  it('disables unavailable page actions', () => {
    setup({ page: 0 });

    expect(
      screen.getByRole('button', { name: 'Go to previous page' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to next page' })
    ).not.toBeDisabled();
  });

  it('disables next page on the last page', () => {
    setup({ count: 10, page: 1, rowsPerPage: 5 });

    expect(
      screen.getByRole('button', { name: 'Go to next page' })
    ).toBeDisabled();
  });

  it('clamps an out-of-range page to the last available page', () => {
    setup({ count: 10, page: 5, rowsPerPage: 5 });

    expect(screen.getByText('6-10 of 10')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to next page' })
    ).toBeDisabled();
  });

  it('calls onRowsPerPageChange when the user picks an option', async () => {
    const user = userEvent.setup();
    const onRowsPerPageChange = vi.fn();

    setup({ onRowsPerPageChange, rowsPerPageOptions: [5, 10, 25] });

    await user.click(screen.getByRole('combobox', { name: 'Rows per page' }));
    await user.click(screen.getByRole('option', { name: '10' }));

    expect(onRowsPerPageChange).toHaveBeenLastCalledWith(
      10,
      expect.any(Object)
    );
  });

  it('renders a custom range label', () => {
    setup({
      getRangeLabel: ({ from, to, count }) =>
        `${from} through ${to} / ${count}`,
    });

    expect(screen.getByText('6 through 10 / 11')).toBeInTheDocument();
  });

  it('renders and toggles the dense switch when enabled', async () => {
    const user = userEvent.setup();
    const onDenseChange = vi.fn();

    setup({
      onDenseChange,
      showDenseToggle: true,
    });

    await user.click(screen.getByRole('switch', { name: 'Dense' }));

    expect(onDenseChange).toHaveBeenLastCalledWith(true, expect.any(Object));
  });

  it('disables controls when disabled is set', () => {
    setup({ disabled: true, showDenseToggle: true });

    expect(screen.getByRole('switch', { name: 'Dense' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(
      screen.getByRole('combobox', { name: 'Rows per page' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to previous page' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to next page' })
    ).toBeDisabled();
  });
});

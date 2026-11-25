import { act, renderHook } from '@testing-library/react';
import { useDataTableSelection } from './useDataTableSelection';

type InvoiceRow = {
  id: string;
  status: string;
};

const data: InvoiceRow[] = [
  {
    id: 'INV-001',
    status: 'Paid',
  },
  {
    id: 'INV-002',
    status: 'Pending',
  },
];

describe('useDataTableSelection', () => {
  it('exposes selected rows and clears the selection', () => {
    const { result } = renderHook(() =>
      useDataTableSelection({
        data,
        getRowId: (row) => row.id,
      })
    );

    act(() => {
      result.current.selection.onRowSelectionChange?.({
        'INV-002': true,
      });
    });

    expect(result.current.selectedRows).toEqual([data[1]]);

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedRows).toEqual([]);
  });
});

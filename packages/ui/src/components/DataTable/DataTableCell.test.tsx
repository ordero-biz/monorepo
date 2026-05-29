import { render, screen } from '@testing-library/react';
import { DataTableCell } from './DataTable';

describe('DataTableCell', () => {
  it('renders the provided content', () => {
    render(<DataTableCell>Material</DataTableCell>);

    expect(screen.getByText('Material')).toBeVisible();
  });

  it('renders numeric values as visible text', () => {
    render(<DataTableCell>{12}</DataTableCell>);

    expect(screen.getByText('12')).toBeVisible();
  });
});

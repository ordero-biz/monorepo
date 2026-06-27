import { render, screen } from '@testing-library/react';
import AttributesPage from './page';

describe('AttributesPage', () => {
  it('renders attribute details', () => {
    render(<AttributesPage />);

    expect(screen.getByText('attribute detail page')).toBeVisible();
  });
});

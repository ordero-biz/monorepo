import { render, screen } from '@testing-library/react';
import Home from './page';

describe('store Home', () => {
  it('renders', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /to get started/i })
    ).toBeInTheDocument();
  });
});

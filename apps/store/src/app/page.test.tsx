import { render, screen } from '@testing-library/react';
import { clientRoutes } from '@/lib/client/routes';
import Home from './page';

describe('store Home', () => {
  it('renders', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /sign in to manage your store/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to sign in/i })
    ).toHaveAttribute('href', clientRoutes.signIn);
  });
});

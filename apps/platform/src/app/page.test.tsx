import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('platform Home', () => {
  it('renders', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /sign in to access your workspace/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to login/i })
    ).toHaveAttribute('href', '/log-in');
  });
});

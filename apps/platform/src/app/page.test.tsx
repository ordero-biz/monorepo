import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Home from './page';

describe('platform Home', () => {
  it('renders', () => {
    render(<Home />);
    expect(
      screen.getByRole('heading', { name: /to get started/i })
    ).toBeInTheDocument();
  });
});

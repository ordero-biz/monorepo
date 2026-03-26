import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { INPUT_DEFAULTS } from './constants';
import { Input } from './Input';

describe('Input', () => {
  it('renders', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies declared defaults', () => {
    render(<Input placeholder="Default input" />);

    const input = screen.getByPlaceholderText('Default input');

    expect(input).toHaveAttribute('data-variant', INPUT_DEFAULTS.variant);
    expect(input).toHaveAttribute('data-size', INPUT_DEFAULTS.size);
    expect(input).toHaveAttribute('data-state', INPUT_DEFAULTS.state);
  });

  it('sets aria-invalid automatically for error state', () => {
    render(<Input placeholder="Invalid input" state="error" />);

    const input = screen.getByPlaceholderText('Invalid input');

    expect(input).toHaveAttribute('data-state', 'error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('respects explicit aria-invalid prop', () => {
    render(<Input placeholder="State override" state="error" aria-invalid={false} />);

    const input = screen.getByPlaceholderText('State override');

    expect(input).toHaveAttribute('aria-invalid', 'false');
  });
});

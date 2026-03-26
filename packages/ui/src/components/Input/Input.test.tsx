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
  });
});

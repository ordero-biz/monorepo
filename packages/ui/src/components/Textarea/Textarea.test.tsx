import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TEXTAREA_DEFAULTS } from './constants';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('applies declared defaults', () => {
    render(<Textarea placeholder="Default textarea" />);

    const textarea = screen.getByPlaceholderText('Default textarea');

    expect(textarea).toHaveAttribute('data-state', TEXTAREA_DEFAULTS.state);
  });

  it('sets aria-invalid automatically for error state', () => {
    render(<Textarea placeholder="Invalid textarea" state="error" />);

    const textarea = screen.getByPlaceholderText('Invalid textarea');

    expect(textarea).toHaveAttribute('data-state', 'error');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });
});

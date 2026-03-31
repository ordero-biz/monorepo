import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

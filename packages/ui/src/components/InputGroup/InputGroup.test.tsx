import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InputGroup, InputGroupAddon, InputGroupInput } from './InputGroup';

describe('InputGroup', () => {
  it('renders with input', () => {
    render(
      <InputGroup>
        <InputGroupAddon>@</InputGroupAddon>
        <InputGroupInput placeholder="Username" />
      </InputGroup>
    );
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByText('@')).toBeInTheDocument();
  });

  it('supports semantic group state', () => {
    render(
      <InputGroup state="warning">
        <InputGroupInput placeholder="Email" />
      </InputGroup>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  });

  it('sets aria-invalid on input-group control for error state', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Password" state="error" />
      </InputGroup>
    );

    const input = screen.getByPlaceholderText('Password');

    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

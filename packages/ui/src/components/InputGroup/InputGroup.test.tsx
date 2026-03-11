import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InputGroup, InputGroupInput, InputGroupAddon } from './InputGroup';

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
});
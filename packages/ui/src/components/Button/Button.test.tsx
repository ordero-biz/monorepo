import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Button } from './Button';

afterEach(() => {
  cleanup();
});

describe('Button', () => {
  it('renders', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button', { name: /click/i })).toBeInTheDocument();
  });

  it('uses 50 percent radius when rounded is full', () => {
    render(<Button rounded="full">Click</Button>);

    const button = screen.getByRole('button', { name: /click/i });

    expect(button).toHaveClass('rounded-[50%]');
    expect(button).not.toHaveClass('rounded-[length:var(--button-radius)]');
  });

  it('uses 50 percent radius for icon buttons when rounded is full', () => {
    render(
      <Button rounded="full" size="icon">
        Click
      </Button>
    );

    const button = screen.getByRole('button', { name: /click/i });

    expect(button).toHaveClass('rounded-[50%]');
    expect(button).not.toHaveClass('rounded-[length:var(--button-radius)]');
  });
});

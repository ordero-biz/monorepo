import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from './Sheet';

describe('Sheet', () => {
  it('renders trigger', () => {
    render(
      <Sheet>
        <SheetTrigger>Open sheet</SheetTrigger>
      </Sheet>
    );

    expect(screen.getByText('Open sheet')).toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Adjust the current view.</SheetDescription>
        </SheetContent>
      </Sheet>
    );

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Adjust the current view.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
});

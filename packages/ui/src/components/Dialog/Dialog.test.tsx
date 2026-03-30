import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

describe('Dialog', () => {
  it('renders trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open dialog</DialogTrigger>
      </Dialog>
    );

    expect(screen.getByText('Open dialog')).toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>
            Proceed with the selected action.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText('Confirm action')).toBeInTheDocument();
    expect(
      screen.getByText('Proceed with the selected action.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });
});

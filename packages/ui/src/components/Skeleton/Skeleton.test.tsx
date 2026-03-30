import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders', () => {
    render(<Skeleton data-testid="skeleton-default" />);

    expect(screen.getByTestId('skeleton-default')).toBeInTheDocument();
  });

  it('merges custom class names', () => {
    const { getByTestId } = render(
      <Skeleton data-testid="skeleton-custom" className="h-4 w-12" />
    );

    expect(getByTestId('skeleton-custom')).toHaveClass('h-4', 'w-12');
  });
});

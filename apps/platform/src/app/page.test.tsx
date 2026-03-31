import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Registration } from '@/components/Registration/Registration';

describe('SignIn', () => {
  it('renders', () => {
    render(<Registration />);
    expect(
      screen.getByRole('heading', { name: /sign in to your account/i })
    ).toBeInTheDocument();
  });
});

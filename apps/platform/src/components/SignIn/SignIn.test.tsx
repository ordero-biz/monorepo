import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SignIn } from './SignIn';

describe('SignIn', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the sign in form', () => {
    render(<SignIn />);

    expect(
      screen.getByRole('heading', { name: /sign in to your account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid values', async () => {
    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.blur(screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'short' },
    });
    fireEvent.blur(screen.getByLabelText(/password/i));

    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be at least 8 characters/i)
    ).toBeInTheDocument();
  });

  it('submits valid form values', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<SignIn />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'name@service.com' },
    });
    fireEvent.blur(screen.getByLabelText(/email/i));

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.blur(screen.getByLabelText(/password/i));

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('SignIn form submitted:', {
        email: 'name@service.com',
        password: 'password123',
      });
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Sign in form submitted! Check console for details.'
    );
  });
});

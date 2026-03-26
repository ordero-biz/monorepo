import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SignUp } from './SignUp';

describe('SignUp', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the sign up form', () => {
    render(<SignUp />);

    expect(
      screen.getByRole('heading', { name: /create your business account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors for invalid values', async () => {
    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'A' },
    });
    fireEvent.blur(screen.getByLabelText(/name/i));

    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: 'abc' },
    });
    fireEvent.blur(screen.getByLabelText(/phone/i));

    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.blur(screen.getByLabelText(/^email/i));

    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'password' },
    });
    fireEvent.blur(screen.getByLabelText(/^password/i));

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'different' },
    });
    fireEvent.blur(screen.getByLabelText(/confirm password/i));

    expect(
      await screen.findByText(/name must be at least 2 characters/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/please enter a valid phone number/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /password must contain at least one uppercase letter, one lowercase letter, and one number/i
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  it('submits valid form values', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<SignUp />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Evil Rabbit' },
    });
    fireEvent.blur(screen.getByLabelText(/name/i));

    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '+380501234567' },
    });
    fireEvent.blur(screen.getByLabelText(/phone/i));

    fireEvent.change(screen.getByLabelText(/^email/i), {
      target: { value: 'name@service.com' },
    });
    fireEvent.blur(screen.getByLabelText(/^email/i));

    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'Password123' },
    });
    fireEvent.blur(screen.getByLabelText(/^password/i));

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123' },
    });
    fireEvent.blur(screen.getByLabelText(/confirm password/i));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/i })
      ).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('SignUp form submitted:', {
        name: 'Evil Rabbit',
        phone: '+380501234567',
        email: 'name@service.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
    });

    expect(alertSpy).toHaveBeenCalledWith(
      'Sign up form submitted! Check console for details.'
    );
  });
});

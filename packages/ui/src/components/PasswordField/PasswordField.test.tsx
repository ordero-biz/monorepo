import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PasswordField } from './PasswordField';
import type { PasswordFieldProps } from './types';

describe('PasswordField', () => {
  const { setup } = prepareSetup<PasswordFieldProps>({
    component: PasswordField,
    props: {
      label: 'Password',
      onValueChange: vi.fn(),
      placeholder: '6+ characters',
    },
  });

  it('renders a password input by default', () => {
    const { label } = setup({
      label: 'Password',
    });

    expect(screen.getByLabelText(label)).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeInTheDocument();
  });

  it('toggles the input type when the icon button is pressed', async () => {
    const user = userEvent.setup();

    const { label } = setup({
      label: 'Password',
    });

    const input = screen.getByLabelText(label);

    await user.click(screen.getByRole('button', { name: 'Show password' }));

    expect(input).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: 'Hide password' })
    ).toBeInTheDocument();
  });

  it('respects a visible default value', () => {
    const { label } = setup({
      defaultVisible: true,
      label: 'Password',
    });

    expect(screen.getByLabelText(label)).toHaveAttribute('type', 'text');
  });

  it('disables the toggle when the field is disabled', () => {
    const { label } = setup({
      disabled: true,
      label: 'Password',
    });

    expect(screen.getByLabelText(label)).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeDisabled();
  });
});

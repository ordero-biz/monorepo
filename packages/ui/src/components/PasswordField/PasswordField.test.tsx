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
    setup({});

    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    );
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeInTheDocument();
  });

  it('toggles the input type when the icon button is pressed', async () => {
    const user = userEvent.setup();

    setup({});

    const input = screen.getByLabelText('Password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));

    expect(input).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: 'Hide password' })
    ).toBeInTheDocument();
  });

  it('respects a visible default value', () => {
    setup({
      defaultVisible: true,
    });

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  });

  it('disables the toggle when the field is disabled', () => {
    setup({
      disabled: true,
    });

    expect(screen.getByLabelText('Password')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeDisabled();
  });
});

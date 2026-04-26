import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';
import type { TextFieldProps } from './types';

const TestHelperIcon = () => (
  <span aria-hidden="true" data-testid="helper-icon">
    helper
  </span>
);

const TestErrorIcon = () => (
  <span aria-hidden="true" data-testid="error-icon">
    error
  </span>
);

describe('TextField', () => {
  const { setup } = prepareSetup<TextFieldProps>({
    component: TextField,
    props: {
      helperText: 'We will never share your email.',
      label: 'Email',
      onValueChange: vi.fn(),
      placeholder: 'name@example.com',
    },
  });

  it('labels the input and wires helper text as the accessible description', () => {
    const label = 'Your email';
    const helperText = 'Use your email';

    setup({
      label,
      helperText,
      variant: 'filled',
    });

    const input = screen.getByRole('textbox', { name: label });

    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(helperText);
  });

  it('calls onValueChange when the user types', async () => {
    const user = userEvent.setup();
    const { label, onValueChange } = setup({
      label: 'Name',
      onValueChange: vi.fn(),
    });

    await user.type(screen.getByRole('textbox', { name: label }), 'Ada');

    expect(onValueChange).toHaveBeenLastCalledWith('Ada', expect.any(Object));
  });

  it('renders helper text with its icon when valid', () => {
    const helperText = 'Use your email';

    setup({
      helperIcon: <TestHelperIcon />,
      helperText,
      variant: 'filled',
    });

    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.getByTestId('helper-icon')).toBeInTheDocument();
  });

  it('shows error text instead of helper text when invalid', () => {
    const errorText = 'Email is required.';
    const helperText = 'Use your email';

    setup({
      errorIcon: <TestErrorIcon />,
      errorText,
      helperIcon: <TestHelperIcon />,
      invalid: true,
      helperText,
      variant: 'filled',
    });

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(screen.getByText(errorText)).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(screen.queryByTestId('helper-icon')).not.toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(errorText);
  });

  it('keeps helper text when invalid without error text', () => {
    const helperText = 'Use your email';

    setup({
      helperIcon: <TestHelperIcon />,
      helperText,
      invalid: true,
      variant: 'filled',
    });

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.getByTestId('helper-icon')).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(helperText);
  });

  it('keeps the field accessible when adornments are provided', () => {
    const label = 'Search';

    setup({
      defaultValue: 'Value',
      disabled: true,
      endAdornment: 'kg',
      label,
      startAdornment: <span aria-hidden="true">$</span>,
      variant: 'filled',
    });

    expect(screen.getByRole('textbox', { name: label })).toBeDisabled();
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
  });
});

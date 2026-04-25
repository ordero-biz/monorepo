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
    const { helperText, label } = setup({
      label: 'Your email',
      helperText: 'Use your email',
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
    const { helperText } = setup({
      helperIcon: <TestHelperIcon />,
      helperText: 'Use your email',
    });

    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(screen.getByTestId('helper-icon')).toBeInTheDocument();
  });

  it('shows error text instead of helper text when invalid', () => {
    const { errorText, helperText } = setup({
      errorIcon: <TestErrorIcon />,
      errorText: 'Email is required.',
      helperIcon: <TestHelperIcon />,
      invalid: true,
      helperText: 'Use your email',
    });

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(screen.getByText(errorText)).toBeInTheDocument();
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(screen.queryByTestId('helper-icon')).not.toBeInTheDocument();
    expect(input).toHaveAccessibleDescription(errorText);
  });

  it('keeps the field accessible when adornments are provided', () => {
    const { label } = setup({
      disabled: true,
      endAdornment: 'kg',
      label: 'Search',
      startAdornment: <span aria-hidden="true">$</span>,
    });

    expect(screen.getByRole('textbox', { name: label })).toBeDisabled();
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
  });
});

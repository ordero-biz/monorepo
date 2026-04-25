import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';
import type { InputProps } from './types';

const TestStartIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} data-testid="start-icon" />
);

const TestEndIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={className} data-testid="end-icon" />
);

describe('Input', () => {
  const { setup } = prepareSetup<InputProps>({
    component: Input,
    props: {
      'aria-label': 'Standalone input',
      onValueChange: vi.fn(),
      placeholder: 'Type here',
    },
  });

  it('renders a standalone textbox', () => {
    const ariaLabel = 'Search input';

    setup({ 'aria-label': ariaLabel });

    expect(
      screen.getByRole('textbox', { name: ariaLabel })
    ).toBeInTheDocument();
  });

  it('renders the initial value and supports readonly and required states', () => {
    const { 'aria-label': ariaLabel, defaultValue } = setup({
      'aria-label': 'Invite code',
      defaultValue: 'ABC-123',
      readOnly: true,
      required: true,
    });

    const input = screen.getByRole('textbox', { name: ariaLabel });

    expect(input).toHaveValue(defaultValue);
    expect(input).toHaveAttribute('readonly');
    expect(input).toBeRequired();
  });

  it('calls onValueChange when the user types', async () => {
    const user = userEvent.setup();
    const { 'aria-label': ariaLabel, onValueChange } = setup({
      'aria-label': 'Search',
      onValueChange: vi.fn(),
    });

    await user.type(screen.getByRole('textbox', { name: ariaLabel }), 'Ada');

    expect(onValueChange).toHaveBeenLastCalledWith('Ada', expect.any(Object));
  });

  it('renders start and end adornments and icons', () => {
    const startAdornment = '$';
    const endAdornment = 'kg';

    setup({
      'aria-label': 'Amount',
      endAdornment,
      endIcon: TestEndIcon,
      startAdornment,
      startIcon: TestStartIcon,
      variant: 'filled',
    });

    expect(screen.getByText(startAdornment)).toBeInTheDocument();
    expect(screen.getByText(endAdornment)).toBeInTheDocument();
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('disables the textbox when disabled is set', () => {
    const ariaLabel = 'Amount';
    const startAdornment = 'Kg';

    setup({
      'aria-label': ariaLabel,
      disabled: true,
      startAdornment,
      variant: 'filled',
    });

    expect(screen.getByRole('textbox', { name: ariaLabel })).toBeDisabled();
    expect(screen.getByText(startAdornment)).toBeInTheDocument();
  });

  it('calls focus, blur, and keydown handlers for user interactions', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <>
        <Input
          aria-label="Search"
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        <button type="button">Next focus target</button>
      </>
    );

    await user.tab();
    await user.keyboard('{Enter}');
    await user.tab();

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('button', { name: 'Next focus target' })
    ).toHaveFocus();
  });
});

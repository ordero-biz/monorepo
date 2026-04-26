import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Heart, Info } from 'lucide-react';
import { Select } from './Select';
import type { SelectProps } from './types';

const options = [
  { label: 'List', value: 'list' },
  { label: 'Details', value: 'details' },
  { label: 'Create', value: 'create' },
] satisfies SelectProps['options'];

describe('Select', () => {
  const { setup } = prepareSetup<SelectProps>({
    component: Select,
    props: {
      'aria-label': 'View mode',
      onValueChange: vi.fn(),
      options,
      placeholder: 'Select view',
    },
  });

  it('renders a button trigger with the selected value', () => {
    const ariaLabel = 'Page view';

    setup({
      'aria-label': ariaLabel,
      defaultValue: 'list',
    });

    expect(screen.getByRole('combobox', { name: ariaLabel })).toHaveTextContent(
      'List'
    );
  });

  it('shows the placeholder when no value is selected', () => {
    const { 'aria-label': ariaLabel, placeholder } = setup();

    expect(screen.getByRole('combobox', { name: ariaLabel })).toHaveTextContent(
      String(placeholder)
    );
  });

  it('opens the list and calls onValueChange when the user picks an option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { 'aria-label': ariaLabel } = setup({
      'aria-label': 'Navigation mode',
      onValueChange,
    });

    await user.click(screen.getByRole('combobox', { name: ariaLabel }));
    await user.click(screen.getByRole('option', { name: 'Details' }));

    expect(onValueChange).toHaveBeenLastCalledWith(
      'details',
      expect.any(Object)
    );
  });

  it('renders helper text and start content', async () => {
    const user = userEvent.setup();

    setup({
      defaultValue: 'list',
      helperIcon: <Info aria-hidden="true" />,
      helperText: 'Caption text, description, notification',
      label: 'Label',
      startIcon: Heart,
      variant: 'filled',
    });

    await user.click(screen.getByRole('combobox', { name: 'View mode' }));

    expect(
      screen.getByText('Caption text, description, notification')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'View mode' })
    ).toHaveTextContent('List');
  });

  it('renders error text when invalid', () => {
    setup({
      defaultValue: 'create',
      errorText: 'Selection is incorrect',
      invalid: true,
      label: 'Label',
    });

    expect(screen.getByText('Selection is incorrect')).toBeInTheDocument();
  });

  it('keeps helper text when invalid without error text', () => {
    const helperText = 'Caption text, description, notification';

    setup({
      helperIcon: <Info aria-hidden="true" />,
      helperText,
      invalid: true,
      label: 'Label',
      variant: 'filled',
    });

    const trigger = screen.getByRole('combobox', { name: 'View mode' });

    expect(screen.getByText(helperText)).toBeInTheDocument();
    expect(trigger).toHaveAccessibleDescription(helperText);
  });

  it('supports focus, blur, and keyboard handlers', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <>
        <Select
          aria-label="Action"
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          options={options}
        />
        <button type="button">Next focus target</button>
      </>
    );

    await user.tab();
    await user.keyboard('x');
    await user.tab();

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('button', { name: 'Next focus target' })
    ).toHaveFocus();
  });

  it('disables the trigger when disabled is set', () => {
    const ariaLabel = 'Status';

    setup({
      'aria-label': ariaLabel,
      disabled: true,
    });

    expect(screen.getByRole('combobox', { name: ariaLabel })).toBeDisabled();
  });
});

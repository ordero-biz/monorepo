import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './Checkbox';
import type { CheckboxProps } from './types';

describe('Checkbox', () => {
  const { setup } = prepareSetup<CheckboxProps & { children: string }>({
    component: Checkbox,
    props: {
      children: 'Accept terms',
      onCheckedChange: vi.fn(),
    },
  });

  it('renders a checkbox users can find by its label', () => {
    const { children } = setup({ children: 'Subscribe to updates' });

    expect(
      screen.getByRole('checkbox', { name: children })
    ).toBeInTheDocument();
  });

  it('uses the aria-label as the accessible name when no visible label is rendered', () => {
    const { 'aria-label': ariaLabel } = setup({
      'aria-label': 'Receive marketing emails',
      children: '',
    });

    expect(
      screen.getByRole('checkbox', { name: ariaLabel })
    ).toBeInTheDocument();
  });

  it('toggles when users click the label text', async () => {
    const user = userEvent.setup();
    const { children, onCheckedChange } = setup({
      children: 'Enable notifications',
      onCheckedChange: vi.fn(),
    });

    await user.click(screen.getByText(children));

    expect(screen.getByRole('checkbox', { name: children })).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.any(Object));
  });

  it('receives focus when users tab to it', async () => {
    const user = userEvent.setup();
    const { children } = setup({
      children: 'Keyboard focus target',
    });

    await user.tab();

    expect(screen.getByRole('checkbox', { name: children })).toHaveFocus();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const { children, onCheckedChange } = setup({
      children: 'Send reminders',
      disabled: true,
      onCheckedChange: vi.fn(),
    });

    const checkbox = screen.getByRole('checkbox', { name: children });

    await user.click(checkbox);

    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('exposes the mixed state for indeterminate checkboxes', () => {
    const { children } = setup({
      children: 'Partially selected',
      indeterminate: true,
    });

    expect(screen.getByRole('checkbox', { name: children })).toHaveAttribute(
      'aria-checked',
      'mixed'
    );
  });
});

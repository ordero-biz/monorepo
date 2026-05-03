import { prepareSetup } from '@ordero/test-config/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Checkbox } from '@/ui/components/Checkbox';
import { CheckboxGroup } from './CheckboxGroup';
import type { CheckboxGroupProps } from './types';

const selectionValues = ['ann', 'brook', 'drew'] as const;

const defaultChildren = (
  <>
    <Checkbox value={selectionValues[0]}>Ann Lee</Checkbox>
    <Checkbox value={selectionValues[1]}>Brook Stone</Checkbox>
    <Checkbox value={selectionValues[2]}>Drew Hall</Checkbox>
  </>
);

const ControlledParentCheckboxGroup = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <CheckboxGroup
      allValues={[...selectionValues]}
      label="Team members"
      onValueChange={setValue}
      value={value}
    >
      <Checkbox parent>Select all members</Checkbox>
      {defaultChildren}
    </CheckboxGroup>
  );
};

describe('CheckboxGroup', () => {
  const { setup } = prepareSetup<CheckboxGroupProps>({
    component: CheckboxGroup,
    props: {
      children: defaultChildren,
      label: 'Team members',
      onValueChange: vi.fn(),
    },
  });

  it('renders a checkbox group users can find by its label', () => {
    const { label } = setup({
      label: 'Notification channels',
    });

    expect(screen.getByRole('group', { name: label })).toBeInTheDocument();
  });

  it('describes the group with helper text', () => {
    const { helperText, label } = setup({
      helperText: 'Pick every person who should receive updates.',
      label: 'Recipients',
    });

    expect(
      screen.getByRole('group', { name: label })
    ).toHaveAccessibleDescription(helperText);
  });

  it('updates the selected values when users toggle a checkbox', async () => {
    const user = userEvent.setup();

    const { onValueChange } = setup({
      onValueChange: vi.fn(),
    });

    await user.click(screen.getByRole('checkbox', { name: 'Ann Lee' }));

    expect(screen.getByRole('checkbox', { name: 'Ann Lee' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith(
      [selectionValues[0]],
      expect.any(Object)
    );
  });

  it('disables all checkboxes when the group is disabled', async () => {
    const user = userEvent.setup();

    setup({
      disabled: true,
    });

    const checkbox = screen.getByRole('checkbox', { name: 'Ann Lee' });

    await user.click(checkbox);

    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).not.toBeChecked();
  });

  it('supports a parent checkbox that controls the whole group', async () => {
    const user = userEvent.setup();

    render(<ControlledParentCheckboxGroup />);

    const parentCheckbox = screen.getByRole('checkbox', {
      name: 'Select all members',
    });

    await user.click(screen.getByRole('checkbox', { name: 'Ann Lee' }));

    expect(parentCheckbox).toHaveAttribute('aria-checked', 'mixed');

    await user.click(parentCheckbox);

    expect(parentCheckbox).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Ann Lee' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Brook Stone' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Drew Hall' })).toBeChecked();
  });

  it('toggles the parent checkbox when users click its visible label', async () => {
    const user = userEvent.setup();

    render(<ControlledParentCheckboxGroup />);

    await user.click(screen.getByText('Select all members'));

    expect(
      screen.getByRole('checkbox', { name: 'Select all members' })
    ).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Ann Lee' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Brook Stone' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Drew Hall' })).toBeChecked();
  });

  it('resets uncontrolled selection back to defaultValue when the form resets', async () => {
    const user = userEvent.setup();

    render(
      <form>
        <CheckboxGroup defaultValue={['ann']} label="Team members">
          {defaultChildren}
        </CheckboxGroup>
        <button type="reset">Reset form</button>
      </form>
    );

    const annCheckbox = screen.getByRole('checkbox', { name: 'Ann Lee' });
    const brookCheckbox = screen.getByRole('checkbox', { name: 'Brook Stone' });

    expect(annCheckbox).toBeChecked();
    expect(brookCheckbox).not.toBeChecked();

    await user.click(brookCheckbox);

    expect(annCheckbox).toBeChecked();
    expect(brookCheckbox).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Reset form' }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: 'Ann Lee' })).toBeChecked();
      expect(
        screen.getByRole('checkbox', { name: 'Brook Stone' })
      ).not.toBeChecked();
    });
  });
});

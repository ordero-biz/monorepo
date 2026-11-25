import { prepareSetup } from '@ordero/test-config/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { CheckboxChip } from '@/ui/components/CheckboxChip';
import { CheckboxChipGroup } from './CheckboxChipGroup';
import type { CheckboxChipGroupProps } from './types';

const selectionValues = ['ann', 'brook', 'drew'] as const;

const defaultChildren = (
  <>
    <CheckboxChip value={selectionValues[0]}>Ann Lee</CheckboxChip>
    <CheckboxChip value={selectionValues[1]}>Brook Stone</CheckboxChip>
    <CheckboxChip value={selectionValues[2]}>Drew Hall</CheckboxChip>
  </>
);

const ControlledParentCheckboxChipGroup = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <CheckboxChipGroup
      allValues={[...selectionValues]}
      label="Team members"
      onValueChange={setValue}
      value={value}
    >
      <CheckboxChip parent>Select all members</CheckboxChip>
      {defaultChildren}
    </CheckboxChipGroup>
  );
};

const InitiallyMixedParentCheckboxChipGroup = () => {
  const [value, setValue] = useState<string[]>([selectionValues[0]]);

  return (
    <CheckboxChipGroup
      allValues={[...selectionValues]}
      label="Team members"
      onValueChange={setValue}
      value={value}
    >
      <CheckboxChip parent>Select all members</CheckboxChip>
      {defaultChildren}
    </CheckboxChipGroup>
  );
};

describe('CheckboxChipGroup', () => {
  const { setup } = prepareSetup<CheckboxChipGroupProps>({
    component: CheckboxChipGroup,
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

  it('updates the selected values when users toggle a chip checkbox', async () => {
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

  it('disables all chip checkboxes when the group is disabled', async () => {
    const user = userEvent.setup();

    setup({
      disabled: true,
    });

    const checkbox = screen.getByRole('checkbox', { name: 'Ann Lee' });

    await user.click(checkbox);

    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).not.toBeChecked();
  });

  it('supports a parent chip checkbox that controls the whole group', async () => {
    const user = userEvent.setup();

    render(<ControlledParentCheckboxChipGroup />);

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

  it('selects every chip when users click a mixed parent chip label', async () => {
    const user = userEvent.setup();

    render(<InitiallyMixedParentCheckboxChipGroup />);

    expect(
      screen.getByRole('checkbox', { name: 'Select all members' })
    ).toHaveAttribute('aria-checked', 'mixed');

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
        <CheckboxChipGroup defaultValue={['ann']} label="Team members">
          {defaultChildren}
        </CheckboxChipGroup>
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

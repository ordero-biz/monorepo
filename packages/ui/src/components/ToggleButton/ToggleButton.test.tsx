import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleButton } from './index';
import type { ToggleButtonItemProps } from './types';

const SettingsIcon = () => <svg aria-hidden="true" />;

describe('ToggleButton', () => {
  const { setup } = prepareSetup<ToggleButtonItemProps & { label: string }>({
    component: ({ label, ...props }) => (
      <ToggleButton.Item icon={<SettingsIcon />} {...props}>
        {label}
      </ToggleButton.Item>
    ),
    props: {
      label: 'Notifications',
      onPressedChange: vi.fn(),
    },
  });

  it('renders a toggle button users can find by its label', () => {
    const { label } = setup({
      label: 'Automation',
    });

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it('uses aria-label as the accessible name for icon-only buttons', () => {
    render(<ToggleButton.Item aria-label="Pin item" icon={<SettingsIcon />} />);

    expect(
      screen.getByRole('button', { name: 'Pin item' })
    ).toBeInTheDocument();
  });

  it('toggles pressed state when users click it', async () => {
    const user = userEvent.setup();

    const { label, onPressedChange } = setup({
      label: 'Published',
      onPressedChange: vi.fn(),
    });

    const button = screen.getByRole('button', { name: label });

    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.any(Object));
  });

  it('supports single selection inside a group', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <ToggleButton.Group
        aria-label="View mode"
        defaultValue={['grid']}
        onValueChange={handleValueChange}
      >
        <ToggleButton.Item value="grid">Grid</ToggleButton.Item>
        <ToggleButton.Item value="list">List</ToggleButton.Item>
      </ToggleButton.Group>
    );

    const gridButton = screen.getByRole('button', { name: 'Grid' });
    const listButton = screen.getByRole('button', { name: 'List' });

    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    expect(listButton).toHaveAttribute('aria-pressed', 'false');

    await user.click(listButton);

    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    expect(handleValueChange).toHaveBeenCalledWith(
      ['list'],
      expect.any(Object)
    );
  });

  it('labels a group from the label prop', () => {
    render(
      <ToggleButton.Group defaultValue={['grid']} label="View mode">
        <ToggleButton.Item value="grid">Grid</ToggleButton.Item>
        <ToggleButton.Item value="list">List</ToggleButton.Item>
      </ToggleButton.Group>
    );

    expect(
      screen.getByRole('group', { name: 'View mode' })
    ).toBeInTheDocument();
  });

  it('supports multiple selection inside a group', async () => {
    const user = userEvent.setup();

    render(
      <ToggleButton.Group aria-label="Formatting" multiple>
        <ToggleButton.Item value="bold">Bold</ToggleButton.Item>
        <ToggleButton.Item value="italic">Italic</ToggleButton.Item>
      </ToggleButton.Group>
    );

    const boldButton = screen.getByRole('button', { name: 'Bold' });
    const italicButton = screen.getByRole('button', { name: 'Italic' });

    await user.click(boldButton);
    await user.click(italicButton);

    expect(boldButton).toHaveAttribute('aria-pressed', 'true');
    expect(italicButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('disables every item when the group is disabled', async () => {
    const user = userEvent.setup();

    render(
      <ToggleButton.Group aria-label="View mode" disabled>
        <ToggleButton.Item value="grid">Grid</ToggleButton.Item>
        <ToggleButton.Item value="list">List</ToggleButton.Item>
      </ToggleButton.Group>
    );

    const gridButton = screen.getByRole('button', { name: 'Grid' });

    await user.click(gridButton);

    expect(gridButton).toBeDisabled();
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
  });
});

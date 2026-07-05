import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, CloudMoon, Settings } from 'lucide-react';
import { ToggleButton } from '@/ui/components/ToggleButton';
import type {
  ToggleButtonColor,
  ToggleButtonSize,
} from '@/ui/components/ToggleButton';

const colors = [
  'inherit',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly ToggleButtonColor[];

const sizes = ['l', 'm', 's'] satisfies readonly ToggleButtonSize[];

const meta = {
  title: 'Components/ToggleButton',
  component: ToggleButton.Group,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleButton.Group>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StandaloneColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--space-2)]">
      {colors.map((color) => (
        <ToggleButton.Item
          aria-label={`${color} toggle`}
          color={color}
          defaultPressed
          icon={<Settings />}
          key={color}
          size="l"
        />
      ))}
    </div>
  ),
};

export const StandaloneStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--space-2)]">
      <ToggleButton.Item
        aria-label="Default"
        color="inherit"
        icon={<Settings />}
        size="l"
      />
      <ToggleButton.Item
        aria-label="Pressed"
        color="primary"
        defaultPressed
        icon={<Settings />}
        size="l"
      />
      <ToggleButton.Item
        aria-label="Disabled"
        disabled
        icon={<Settings />}
        size="l"
      />
      <ToggleButton.Item
        aria-label="Disabled pressed"
        defaultPressed
        disabled
        icon={<Settings />}
        size="l"
      />
    </div>
  ),
};

export const StandaloneSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--space-2)]">
      {sizes.map((size) => (
        <ToggleButton.Item
          aria-label={`${size} toggle`}
          color="primary"
          defaultPressed
          icon={<Settings />}
          key={size}
          size={size}
        />
      ))}
    </div>
  ),
};

export const Group: Story = {
  args: {
    'aria-label': 'Notification settings',
    children: (
      <>
        <ToggleButton.Item
          aria-label="Sleep"
          icon={<CloudMoon />}
          value="sleep"
        />
        <ToggleButton.Item
          aria-label="Settings"
          icon={<Settings />}
          value="settings"
        />
        <ToggleButton.Item aria-label="Alerts" icon={<Bell />} value="alerts" />
      </>
    ),
    defaultValue: ['settings'],
  },
};

export const SecondaryGroup: Story = {
  args: {
    ...Group.args,
    color: 'secondary',
  },
};

export const GroupSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--space-3)]">
      {sizes.map((size) => (
        <ToggleButton.Group
          aria-label={`${size} notification settings`}
          defaultValue={['settings']}
          key={size}
          size={size}
        >
          <ToggleButton.Item
            aria-label="Sleep"
            icon={<CloudMoon />}
            value="sleep"
          />
          <ToggleButton.Item
            aria-label="Settings"
            icon={<Settings />}
            value="settings"
          />
          <ToggleButton.Item
            aria-label="Alerts"
            icon={<Bell />}
            value="alerts"
          />
        </ToggleButton.Group>
      ))}
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-[var(--space-3)]">
      <ToggleButton.Group
        aria-label="Primary notification settings"
        defaultValue={['settings']}
      >
        <ToggleButton.Item icon={<CloudMoon />} value="sleep">
          Sleep
        </ToggleButton.Item>
        <ToggleButton.Item icon={<Settings />} value="settings">
          Label
        </ToggleButton.Item>
        <ToggleButton.Item disabled icon={<Bell />} value="alerts">
          Alerts
        </ToggleButton.Item>
      </ToggleButton.Group>
      <ToggleButton.Group
        aria-label="Secondary notification settings"
        color="secondary"
        defaultValue={['settings']}
      >
        <ToggleButton.Item icon={<CloudMoon />} value="sleep">
          Sleep
        </ToggleButton.Item>
        <ToggleButton.Item icon={<Settings />} value="settings">
          Label
        </ToggleButton.Item>
        <ToggleButton.Item disabled icon={<Bell />} value="alerts">
          Alerts
        </ToggleButton.Item>
      </ToggleButton.Group>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-[var(--space-3)]">
      {sizes.map((size) => (
        <ToggleButton.Group
          aria-label={`${size} vertical notification settings`}
          defaultValue={['settings']}
          key={size}
          orientation="vertical"
          size={size}
        >
          <ToggleButton.Item
            aria-label="Sleep"
            icon={<CloudMoon />}
            value="sleep"
          />
          <ToggleButton.Item
            aria-label="Settings"
            icon={<Settings />}
            value="settings"
          />
          <ToggleButton.Item
            aria-label="Alerts"
            icon={<Bell />}
            value="alerts"
          />
        </ToggleButton.Group>
      ))}
    </div>
  ),
};

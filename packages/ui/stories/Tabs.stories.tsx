import { DirectionProvider } from '@base-ui/react/direction-provider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, UserRound } from 'lucide-react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '@/ui/components/Button';
import { Tabs } from '@/ui/components/Tabs';
import type { TabsRootProps, TabsValue } from '@/ui/components/Tabs';

const labels = ['Item one', 'Item two', 'Item three', 'Item four', 'Item five', 'Item six', 'Item seven'];

const content = (scrollable = false) => (
  <>
    <Tabs.List aria-label="Example tabs">
      {(scrollable ? labels : labels.slice(0, 3)).map((label, index) => (
        <Tabs.Tab disabled={!scrollable && index === 2} key={label} value={index}>
          {label}
        </Tabs.Tab>
      ))}
    </Tabs.List>
    {(scrollable ? labels : labels.slice(0, 3)).map((label, index) => (
      <Tabs.Panel key={label} value={index}>
        <p className="m-0 text-[length:var(--body2-size-desktop)]">Content for {label.toLowerCase()}.</p>
      </Tabs.Panel>
    ))}
  </>
);

const meta = {
  title: 'Components/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Horizontal Base UI tabs with the Minimals text treatment. Lists scroll automatically when constrained, with touch/trackpad scrolling and overflow buttons. Give each list an accessible label. Use matching string or numeric values for tabs and panels, and set defaultValue for the initial selection. Arrow keys move focus; Enter or Space activates unless activateOnFocus is enabled.',
      },
    },
  },
  args: { defaultValue: 0, children: content() },
} satisfies Meta<typeof Tabs.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    children: (
      <>
        <Tabs.List aria-label="Account">
          <Tabs.Tab value={0}><UserRound aria-hidden="true" />Profile</Tabs.Tab>
          <Tabs.Tab value={1}><Settings aria-hidden="true" />Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={0}>Your profile</Tabs.Panel>
        <Tabs.Panel value={1}>Your settings</Tabs.Panel>
      </>
    ),
  },
};

const ControlledExample = (props: TabsRootProps) => {
  const [value, setValue] = useState<TabsValue | null>(0);
  return <Tabs.Root {...props} onValueChange={setValue} value={value} />;
};

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Item two' }));
    await expect(canvas.getByRole('tabpanel', { name: 'Item two' })).toBeVisible();
  },
};

export const Scrollable: Story = {
  args: { children: content(true) },
  decorators: [(Story) => <div className="w-full max-w-[calc(var(--space-20)*2)]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forward = await canvas.findByRole('button', { name: 'Scroll tabs forward' });
    const backward = canvas.getByRole('button', { name: 'Scroll tabs backward' });
    const first = canvas.getByRole('tab', { name: 'Item one' });
    const last = canvas.getByRole('tab', { name: 'Item seven' });
    await expect(backward).toBeDisabled();
    const initialLeft = first.getBoundingClientRect().left;
    await userEvent.click(forward);
    await waitFor(() => expect(first.getBoundingClientRect().left).toBeLessThan(initialLeft));
    await expect(backward).toBeEnabled();

    // Keyboard focus must reveal an offscreen tab without activating it.
    await userEvent.click(first);
    await userEvent.keyboard('{End}');
    await expect(last).toHaveFocus();
    await waitFor(() => expect(last.getBoundingClientRect().right).toBeLessThanOrEqual(forward.getBoundingClientRect().left + 1));
    await expect(canvas.getByRole('tabpanel', { name: 'Item one' })).toBeVisible();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('tabpanel', { name: 'Item seven' })).toBeVisible();
    await expect(forward).toBeDisabled();
    await userEvent.click(backward);
    await waitFor(() => expect(forward).toBeEnabled());
  },
};

const ResponsiveExample = () => {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState<TabsValue | null>(6);
  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <Button onClick={() => setExpanded(!expanded)}>Toggle width</Button>
        <Button onClick={() => setValue(0)}>Select first tab</Button>
      </div>
      <div style={{ width: expanded ? '100%' : 'calc(var(--space-20) * 2)' }} className="max-w-full">
        <Tabs.Root onValueChange={setValue} value={value}>{content(true)}</Tabs.Root>
      </div>
    </div>
  );
};

export const InitialSelectionAndResize: Story = {
  render: () => <ResponsiveExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forward = await canvas.findByRole('button', { name: 'Scroll tabs forward' });
    const last = canvas.getByRole('tab', { name: 'Item seven' });
    await waitFor(() => expect(forward).toBeDisabled());
    await expect(last.getBoundingClientRect().right).toBeLessThanOrEqual(forward.getBoundingClientRect().left + 1);
    await userEvent.click(canvas.getByRole('button', { name: 'Select first tab' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Scroll tabs backward' })).toBeDisabled());
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle width' }));
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'Scroll tabs forward' })).toBeNull());
  },
};

export const Dark: Story = { globals: { theme: 'dark' } };

export const RightToLeft: Story = {
  args: { children: content(true) },
  decorators: [(Story) => <DirectionProvider direction="rtl"><div dir="rtl" className="w-full max-w-[calc(var(--space-20)*2)]"><Story /></div></DirectionProvider>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const forward = await canvas.findByRole('button', { name: 'Scroll tabs forward' });
    const first = canvas.getByRole('tab', { name: 'Item one' });
    const initialRight = first.getBoundingClientRect().right;
    await userEvent.click(forward);
    await waitFor(() => expect(first.getBoundingClientRect().right).toBeGreaterThan(initialRight));
    await userEvent.click(first);
    await userEvent.keyboard('{End}{Enter}');
    await expect(canvas.getByRole('tabpanel', { name: 'Item seven' })).toBeVisible();
    await waitFor(() => expect(forward).toBeDisabled());
  },
};

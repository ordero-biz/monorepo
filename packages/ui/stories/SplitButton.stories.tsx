import type { Meta, StoryObj } from '@storybook/react-vite';
import { GitPullRequest } from 'lucide-react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import type { ButtonColor, ButtonSize, ButtonVariant } from '@/ui/components/Button';
import {
  SplitButton,
  type SplitButtonActionProps,
  type SplitButtonRootProps,
} from '@/ui/components/SplitButton';

const actions = ['Create pull request', 'Create draft pull request'] as const;
const sizes = ['s', 'm', 'l'] satisfies readonly ButtonSize[];
const colors = [
  'inherit',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly ButtonColor[];
const variants = ['contained', 'outlined', 'soft', 'text'] satisfies readonly ButtonVariant[];

type PullRequestExampleProps = SplitButtonRootProps & Pick<SplitButtonActionProps, 'startIcon'>;

const PullRequestExample = ({ startIcon, ...args }: PullRequestExampleProps) => {
  const [selectedAction, setSelectedAction] = useState<string>(actions[0]);
  const [result, setResult] = useState('Choose an action, then click the main button.');

  return (
    <div className="flex flex-col gap-2">
      <SplitButton.Root {...args}>
        <SplitButton.Action
          onClick={() => setResult(`${selectedAction} executed.`)}
          startIcon={startIcon}
        >
          {selectedAction}
        </SplitButton.Action>
        <SplitButton.Trigger aria-label="Choose pull request action" />
        <SplitButton.Content>
          {actions.map((action) => (
            <SplitButton.Item key={action} onClick={() => setSelectedAction(action)}>
              {action}
            </SplitButton.Item>
          ))}
        </SplitButton.Content>
      </SplitButton.Root>
      <p aria-live="polite" className="text-muted-foreground">
        {result}
      </p>
    </div>
  );
};

const meta = {
  id: 'components-splitbutton',
  title: 'Components/Actions/SplitButton',
  component: SplitButton.Root,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A main action and a separate menu trigger, composed from Button and Menu. Root shares Button color, size, variant, and disabled state across both halves. Use Action, Trigger, and Content in that order; put Item elements inside Content. Give the group and trigger accessible labels. Keep the selected action in consumer state: Item.onClick can change the selection or run an alternative immediately, while Action.onClick runs the main action. Only Action accepts a submit type; the menu trigger never submits a form.',
      },
    },
  },
  args: {
    'aria-label': 'Pull request actions',
    children: null,
    color: 'primary',
    size: 'm',
    variant: 'contained',
  },
  render: (args) => <PullRequestExample {...args} />,
} satisfies Meta<typeof SplitButton.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Choose pull request action' }));
    await userEvent.click(await page.findByRole('menuitem', { name: actions[1] }));

    await expect(canvas.getByText('Choose an action, then click the main button.')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: actions[1] }));
    await expect(canvas.getByText(`${actions[1]} executed.`)).toBeVisible();
  },
};

const renderColors = (args: SplitButtonRootProps) => (
  <div className="flex flex-wrap gap-2">
    {colors.map((color) => (
      <SplitButton.Root {...args} key={color} aria-label={`${color} actions`} color={color}>
        <SplitButton.Action>{color}</SplitButton.Action>
        <SplitButton.Trigger aria-label={`More ${color} actions`} />
        <SplitButton.Content>
          <SplitButton.Item>Alternative action</SplitButton.Item>
        </SplitButton.Content>
      </SplitButton.Root>
    ))}
  </div>
);

export const Contained: Story = { render: renderColors };
export const Outlined: Story = { args: { variant: 'outlined' }, render: renderColors };
export const Soft: Story = { args: { variant: 'soft' }, render: renderColors };
export const Text: Story = { args: { variant: 'text' }, render: renderColors };

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {sizes.map((size) => (
        <SplitButton.Root {...args} key={size} size={size} aria-label={`${size} actions`}>
          <SplitButton.Action>Create pull request</SplitButton.Action>
          <SplitButton.Trigger aria-label={`Choose ${size} action`} />
          <SplitButton.Content>
            <SplitButton.Item>Create draft pull request</SplitButton.Item>
          </SplitButton.Content>
        </SplitButton.Root>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => <PullRequestExample {...args} startIcon={<GitPullRequest aria-hidden="true" />} />,
};

export const FullWidth: Story = { args: { fullWidth: true } };
export const MenuOpen: Story = { args: { defaultOpen: true } };

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => (
        <SplitButton.Root {...args} key={variant} variant={variant} disabled>
          <SplitButton.Action>Create pull request</SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose pull request action" />
          <SplitButton.Content>
            <SplitButton.Item>Create draft pull request</SplitButton.Item>
          </SplitButton.Content>
        </SplitButton.Root>
      ))}
    </div>
  ),
};

export const DisabledAction: Story = {
  render: (args) => (
    <SplitButton.Root {...args}>
      <SplitButton.Action disabled>Create pull request</SplitButton.Action>
      <SplitButton.Trigger aria-label="Choose an available action" />
      <SplitButton.Content>
        <SplitButton.Item>Create draft pull request</SplitButton.Item>
      </SplitButton.Content>
    </SplitButton.Root>
  ),
};

export const DisabledOption: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <SplitButton.Root {...args}>
      <SplitButton.Action>Create pull request</SplitButton.Action>
      <SplitButton.Trigger aria-label="Choose pull request action" />
      <SplitButton.Content>
        <SplitButton.Item>Create pull request</SplitButton.Item>
        <SplitButton.Item disabled>Create draft pull request</SplitButton.Item>
      </SplitButton.Content>
    </SplitButton.Root>
  ),
};

const ControlledMenuExample = (args: SplitButtonRootProps) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col gap-2">
        <SplitButton.Root {...args} open={open} onOpenChange={setOpen}>
          <SplitButton.Action>Create pull request</SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose pull request action" />
          <SplitButton.Content>
            <SplitButton.Item>Create draft pull request</SplitButton.Item>
          </SplitButton.Content>
        </SplitButton.Root>
        <p aria-live="polite">Menu is {open ? 'open' : 'closed'}.</p>
      </div>
    );
};

export const ControlledMenu: Story = {
  render: (args) => <ControlledMenuExample {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Choose pull request action' }));
    await expect(await canvas.findByText('Menu is open.')).toBeVisible();
    await userEvent.click(await page.findByRole('menuitem', { name: actions[1] }));
    await expect(await canvas.findByText('Menu is closed.')).toBeVisible();
  },
};

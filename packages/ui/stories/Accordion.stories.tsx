import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '@/ui/components/Accordion';

const items = [
  {
    content:
      'Donec id justo. Curabitur blandit mollis lacus. Vivamus quis mi. In ut quam vitae odio lacinia tincidunt. In consectetuer turpis ut velit.',
    title: 'Item 1',
    value: 'item-1',
  },
  {
    content: 'Content for item 2.',
    title: 'Item 2',
    value: 'item-2',
  },
  {
    content: 'Content for item 3.',
    title: 'Item 3',
    value: 'item-3',
  },
  {
    content: 'Content for item 4.',
    title: 'Item 4',
    value: 'item-4',
  },
] as const;

const meta = {
  title: 'Components/Accordion',
  component: Accordion.Root,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Accordion examples',
    defaultValue: ['item-1'],
    children: items.map(({ content, title, value }) => (
      <Accordion.Item key={value} value={value}>
        <Accordion.Header>
          <Accordion.Trigger>{title}</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>{content}</Accordion.Panel>
      </Accordion.Item>
    )),
  },
} satisfies Meta<typeof Accordion.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  args: { multiple: true },
};

export const DisabledItem: Story = {
  args: {
    'aria-label': 'Disabled accordion example',
    defaultValue: [],
    children: (
      <Accordion.Item disabled value="unavailable">
        <Accordion.Header>
          <Accordion.Trigger>Unavailable section</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>This panel is unavailable.</Accordion.Panel>
      </Accordion.Item>
    ),
  },
};

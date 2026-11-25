import type { Meta, StoryObj } from '@storybook/react-vite';
import { EllipsisVertical } from 'lucide-react';
import { Menu, type MenuPopupProps } from '@/ui/components/Menu';

const menuItems = [
  'Item 1',
  'Item 2',
  'Item 3',
  'Item 4',
  'Item 5',
  'Item 6',
  'Item 7',
  'Item 8',
  'Item 9',
  'Item 10',
] as const;

const meta = {
  title: 'Components/Menu',
  component: Menu.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof Menu.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

type RenderMenuArgs = {
  defaultOpen?: boolean;
  maxHeight?: MenuPopupProps['maxHeight'];
};

const renderMenu = ({ defaultOpen, maxHeight }: RenderMenuArgs) => (
  <Menu.Root defaultOpen={defaultOpen}>
    <Menu.Trigger>Open menu</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup maxHeight={maxHeight}>
          {menuItems.map((item) => (
            <Menu.Item key={item}>{item}</Menu.Item>
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

export const Default: Story = {
  render: () => renderMenu({}),
};

export const MaxHeight: Story = {
  render: () => renderMenu({ maxHeight: 280 }),
};

export const IconButtonTrigger: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger appearance="iconButton" aria-label="More actions">
        <EllipsisVertical aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end">
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const SecondaryIconButtonTrigger: Story = {
  render: () => (
    <Menu.Root>
      <Menu.Trigger
        appearance='iconButton'
        aria-label='More secondary actions'
        color='secondary'
      >
        <EllipsisVertical aria-hidden='true' />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align='end'>
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item>Duplicate</Menu.Item>
            <Menu.Item>Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

export const ItemColors: Story = {
  render: () => (
    <Menu.Root defaultOpen={true}>
      <Menu.Trigger>Open menu</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item color="primary">Duplicate</Menu.Item>
            <Menu.Item color="error">Delete</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  ),
};

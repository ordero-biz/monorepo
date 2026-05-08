import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Menu, Search, Settings } from 'lucide-react';
import { Header } from '@/ui/components/Header';
import { IconButton } from '@/ui/components/IconButton';

const meta = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithPrimaryActions: Story = {
  render: () => (
    <Header>
      <Header.Left>
        <IconButton aria-label='Open menu' size='l'>
          <Menu />
        </IconButton>
        <IconButton aria-label='Search' size='l'>
          <Search />
        </IconButton>
      </Header.Left>
      <Header.Right>
        <IconButton aria-label='Notifications' color='primary' size='l'>
          <Bell />
        </IconButton>
        <IconButton aria-label='Settings' size='l'>
          <Settings />
        </IconButton>
      </Header.Right>
    </Header>
  ),
};

export const DenseActions: Story = {
  render: () => (
    <Header>
      <Header.Left>
        <IconButton aria-label='Open menu' size='m'>
          <Menu />
        </IconButton>
        <IconButton aria-label='Search' size='m'>
          <Search />
        </IconButton>
      </Header.Left>
      <Header.Right>
        <IconButton aria-label='Notifications' size='m'>
          <Bell />
        </IconButton>
        <IconButton aria-label='Settings' size='m'>
          <Settings />
        </IconButton>
      </Header.Right>
    </Header>
  ),
};

export const RightOnlyActions: Story = {
  render: () => (
    <Header>
      <Header.Right>
        <IconButton aria-label='Notifications' color='primary' size='l'>
          <Bell />
        </IconButton>
        <IconButton aria-label='Settings' size='l'>
          <Settings />
        </IconButton>
      </Header.Right>
    </Header>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Menu, Search, Settings } from 'lucide-react';
import { TopBar } from '@/ui/components/TopBar';
import { IconButton } from '@/ui/components/IconButton';
import { Typography } from '@/ui/components/Typography';

const meta = {
  title: 'Components/TopBar',
  component: TopBar.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof TopBar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithPrimaryActions: Story = {
  render: () => (
    <TopBar.Root>
      <TopBar.Left>
        <IconButton aria-label='Open menu' size='l'>
          <Menu />
        </IconButton>
        <IconButton aria-label='Search' size='l'>
          <Search />
        </IconButton>
      </TopBar.Left>
      <TopBar.Right>
        <IconButton aria-label='Notifications' color='primary' size='l'>
          <Bell />
        </IconButton>
        <IconButton aria-label='Settings' size='l'>
          <Settings />
        </IconButton>
      </TopBar.Right>
    </TopBar.Root>
  ),
};

export const DenseActions: Story = {
  render: () => (
    <TopBar.Root>
      <TopBar.Left>
        <IconButton aria-label='Open menu' size='m'>
          <Menu />
        </IconButton>
        <IconButton aria-label='Search' size='m'>
          <Search />
        </IconButton>
      </TopBar.Left>
      <TopBar.Right>
        <IconButton aria-label='Notifications' size='m'>
          <Bell />
        </IconButton>
        <IconButton aria-label='Settings' size='m'>
          <Settings />
        </IconButton>
      </TopBar.Right>
    </TopBar.Root>
  ),
};

export const RightOnlyActions: Story = {
  render: () => (
    <TopBar.Root>
      <TopBar.Right>
        <IconButton aria-label='Notifications' color='primary' size='l'>
          <Bell />
        </IconButton>
        <IconButton aria-label='Settings' size='l'>
          <Settings />
        </IconButton>
      </TopBar.Right>
    </TopBar.Root>
  ),
};

export const WithLongTitleAndCompactActions: Story = {
  render: () => (
    <TopBar.Root>
      <TopBar.Left>
        <IconButton aria-label='Open menu' size='l'>
          <Menu />
        </IconButton>
        <div className='min-w-0'>
          <Typography variant='subtitle1'>
            North America enterprise accounts migration planning and support
            operations
          </Typography>
          <p className='truncate text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--text-secondary)]'>
            Retail platform / United States / Spring launch readiness review
          </p>
        </div>
      </TopBar.Left>
      <TopBar.Right>
        <IconButton aria-label='Search' size='m'>
          <Search />
        </IconButton>
        <IconButton aria-label='Notifications' size='m'>
          <Bell />
        </IconButton>
      </TopBar.Right>
    </TopBar.Root>
  ),
};

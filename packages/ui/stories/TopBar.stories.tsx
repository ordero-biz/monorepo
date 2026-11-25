import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, Search } from 'lucide-react';
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

export const Vertical: Story = {
  render: () => (
    <TopBar.Root>
      <TopBar.Left>
        <div className='flex min-w-0 items-center gap-[var(--space-1)]'>
          <Typography variant='subtitle1'>
            Product(s) list
          </Typography>
          <span className='inline-flex h-[24px] items-center rounded-[var(--radius-0-75-token)] bg-[var(--grey-100)] px-[var(--space-1)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--text-secondary)]'>
            Dev
          </span>
        </div>
      </TopBar.Left>
      <TopBar.Right>
        <button
          aria-label='Search products'
          className='inline-flex h-[32px] items-center gap-[var(--space-1)] rounded-[var(--radius-1-token)] bg-[var(--grey-100)] px-[var(--space-1)] text-[var(--text-secondary)] outline-none transition-[background-color,box-shadow] hover:bg-[var(--grey-200)] focus-visible:ring-3 focus-visible:ring-ring/50'
          type='button'
        >
          <Search />
          <span className='rounded-[var(--radius-0-75-token)] bg-background px-[var(--space-0-75)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--text-primary)]'>
            ⌘K
          </span>
        </button>
        <div className='relative'>
          <IconButton aria-label='Notifications' color='inherit' size='m'>
            <Bell />
          </IconButton>
          <span className='absolute -right-[2px] -top-[2px] inline-flex size-[18px] items-center justify-center rounded-[var(--radius-50-token)] bg-[var(--error-main)] text-[length:var(--caption-size-desktop)] leading-none font-[var(--caption-weight)] text-[var(--white-main)]'>
            1
          </span>
        </div>
        <div className='flex min-w-0 items-center gap-[var(--space-1)] pl-[var(--space-1)]'>
          <div className='min-w-0 text-right'>
            <p className='truncate text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--font-weight-600)] text-[var(--text-primary)]'>
              Ronald Richards
            </p>
            <p className='truncate text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--text-secondary)]'>
              r.richards@ordero.com
            </p>
          </div>
          <span
            aria-label='Ronald Richards profile'
            className='inline-flex size-[40px] shrink-0 items-center justify-center rounded-[var(--radius-50-token)] border-2 border-[var(--primary-main)] bg-[var(--primary-lighter)] text-[length:var(--caption-size-desktop)] leading-none font-[var(--font-weight-600)] text-[var(--primary-dark)]'
            role='img'
          >
            RR
          </span>
        </div>
      </TopBar.Right>
    </TopBar.Root>
  ),
};

export const WithLongTitleAndCompactActions: Story = {
  render: () => (
    <TopBar.Root>
      <TopBar.Left>
        <div className='flex min-w-0 items-center gap-[var(--space-1)]'>
          <div className='min-w-0'>
            <p className='truncate text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] text-[var(--text-primary)]'>
              North America enterprise accounts migration planning and support
              operations
            </p>
          </div>
          <span className='inline-flex h-[24px] shrink-0 items-center rounded-[var(--radius-0-75-token)] bg-[var(--grey-100)] px-[var(--space-1)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--text-secondary)]'>
            Dev
          </span>
        </div>
      </TopBar.Left>
      <TopBar.Right>
        <button
          aria-label='Search accounts'
          className='inline-flex h-[32px] items-center gap-[var(--space-1)] rounded-[var(--radius-1-token)] bg-[var(--grey-100)] px-[var(--space-1)] text-[var(--text-secondary)] outline-none transition-[background-color,box-shadow] hover:bg-[var(--grey-200)] focus-visible:ring-3 focus-visible:ring-ring/50'
          type='button'
        >
          <Search />
          <span className='rounded-[var(--radius-0-75-token)] bg-background px-[var(--space-0-75)] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] font-[var(--caption-weight)] text-[var(--text-primary)]'>
            ⌘K
          </span>
        </button>
        <div className='relative'>
          <IconButton aria-label='Notifications' color='inherit' size='m'>
            <Bell />
          </IconButton>
          <span className='absolute -right-[2px] -top-[2px] inline-flex size-[18px] items-center justify-center rounded-[var(--radius-50-token)] bg-[var(--error-main)] text-[length:var(--caption-size-desktop)] leading-none font-[var(--caption-weight)] text-[var(--white-main)]'>
            1
          </span>
        </div>
        <span
          aria-label='Ronald Richards profile'
          className='inline-flex size-[40px] shrink-0 items-center justify-center rounded-[var(--radius-50-token)] border-2 border-[var(--primary-main)] bg-[var(--primary-lighter)] text-[length:var(--caption-size-desktop)] leading-none font-[var(--font-weight-600)] text-[var(--primary-dark)]'
          role='img'
        >
          RR
        </span>
      </TopBar.Right>
    </TopBar.Root>
  ),
};

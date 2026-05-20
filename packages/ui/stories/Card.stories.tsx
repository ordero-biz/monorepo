import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart2,
  Clock,
  DollarSign,
  MoreVertical,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import { Card } from '@/ui/components/Card';
import { IconButton } from '@/ui/components/IconButton';

const meta = {
  title: 'Components/Card',
  component: Card.Root,
  tags: ['autodocs'],
  args: {
    variant: 'filled',
  },
} satisfies Meta<typeof Card.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

const CardBalanceTemplate = (args: any) => (
  <div className="max-w-[344px]">
    <Card.Root {...args}>
      <Card.Content>
        <div className="flex flex-col gap-[var(--spacing-2)]">
          {/* Top Stack */}
          <div className="flex flex-col gap-[var(--spacing-1)] mb-[var(--spacing-1)]">
            <span className="text-[length:var(--subtitle2-size-desktop)] leading-[var(--subtitle2-line-height-desktop)] font-semibold text-[color:var(--text-secondary)]">
              Your current balance
            </span>
            <h3 className="text-[length:var(--h3-size-desktop)] leading-[var(--h3-line-height-desktop)] font-bold text-[color:var(--text-primary)]">
              $9,990
            </h3>
          </div>

          {/* Details Stack */}
          <div className="flex flex-col gap-[var(--spacing-1-5)]">
            <div className="flex items-center justify-between">
              <span className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] text-[color:var(--text-secondary)] font-normal">
                Order total
              </span>
              <span className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] text-[color:var(--text-primary)] font-normal">
                $10,989
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] text-[color:var(--text-secondary)] font-normal">
                Earning
              </span>
              <span className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] text-[color:var(--text-primary)] font-normal">
                $11,988
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] text-[color:var(--text-secondary)] font-normal">
                Refunded
              </span>
              <span className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] text-[color:var(--text-primary)] font-normal">
                $93.10
              </span>
            </div>
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex gap-[var(--spacing-1-5)] w-full items-center justify-center">
          <button
            type="button"
            className="flex-1 rounded-[var(--button-radius)] bg-[var(--warning-main)] text-[color:var(--warning-contrast-text)] hover:bg-[var(--warning-dark)] h-[36px] font-bold text-sm flex items-center justify-center"
          >
            Request
          </button>
          <button
            type="button"
            className="flex-1 rounded-[var(--button-radius)] bg-[var(--primary-main)] text-[color:var(--primary-contrast-text)] hover:bg-[var(--primary-dark)] h-[36px] font-bold text-sm flex items-center justify-center"
          >
            Send
          </button>
        </div>
      </Card.Footer>
    </Card.Root>
  </div>
);

export const Default: Story = {
  render: (args) => <CardBalanceTemplate {...args} />,
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
  render: (args) => <CardBalanceTemplate {...args} />,
};

export const JobCardFigmaReplica: Story = {
  name: 'Figma Job Card Design',
  render: () => (
    <div className="max-w-[344px]">
      <Card.Root variant="filled">
        {/* Header Stack */}
        <div className="relative flex flex-col gap-[var(--spacing-2)] pt-[var(--card-content-p)] px-[var(--card-content-p)] pb-[var(--spacing-2)]">
          {/* Avatar */}
          <div
            className="flex items-center justify-center rounded-[var(--avatar-rounded-radius)] size-[48px] overflow-hidden select-none"
            style={{ backgroundColor: '#e60000' }}
          >
            <span className="text-white font-bold text-sm leading-none tracking-wider">TNF</span>
          </div>

          {/* Heading Stack */}
          <div className="flex flex-col gap-[var(--spacing-1)] items-start">
            <h3 className="text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-semibold text-[color:var(--text-primary)]">
              Software Engineer
            </h3>

            {/* Posted Date Info */}
            <div className="flex items-center gap-[4px] text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)] font-normal">
              <span>Posted date:</span>
              <span>28 Jul 2022 7:00 AM</span>
            </div>

            {/* Candidates Status */}
            <div className="flex items-center gap-[var(--spacing-0-5)] mt-[4px]">
              <Users className="size-[16px] text-[var(--primary-dark)]" />
              <span className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[color:var(--primary-dark)] font-semibold">
                223 candidates
              </span>
            </div>
          </div>

          {/* Action dots Menu */}
          <div className="absolute right-[var(--spacing-1)] top-[var(--spacing-1)] p-[var(--spacing-1)]">
            <IconButton color="inherit" size="s" aria-label="More options">
              <MoreVertical />
            </IconButton>
          </div>
        </div>

        {/* Dashed Divider */}
        <Card.Divider variant="dashed" />

        {/* 2x2 Grid of Job Details */}
        <Card.Content>
          <div className="grid grid-cols-2 gap-x-[var(--spacing-2)] gap-y-[var(--spacing-1-5)]">
            {/* Experience */}
            <div className="flex items-center gap-[var(--spacing-0-5)]">
              <BarChart2 className="size-[16px] text-[color:var(--text-disabled)]" />
              <span className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)]">
                1 year exp
              </span>
            </div>

            {/* Job Type */}
            <div className="flex items-center gap-[var(--spacing-0-5)]">
              <Clock className="size-[16px] text-[color:var(--text-disabled)]" />
              <span className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)]">
                Full Time
              </span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-[var(--spacing-0-5)]">
              <DollarSign className="size-[16px] text-[color:var(--text-disabled)]" />
              <span className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)]">
                Competitive
              </span>
            </div>

            {/* Manager Contact */}
            <div className="flex items-center gap-[var(--spacing-0-5)]">
              <User className="size-[16px] text-[color:var(--text-disabled)]" />
              <span className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)]">
                Manager
              </span>
            </div>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  ),
};

export const ClickableWithCenterIconButton: Story = {
  name: 'Card with Center IconButton',
  render: () => (
    <div className="max-w-sm">
      <Card.Root variant="filled">
        <Card.Header>
          <div>
            <Card.Title>Card with Center Action</Card.Title>
            <Card.Description>
              A clean container with an interactive action button centered.
            </Card.Description>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-col items-center justify-center min-h-[140px] gap-[var(--spacing-1-5)] border border-dashed border-[var(--color-divider)] rounded-[var(--button-radius)] p-4 bg-[var(--figma-grey-8)]">
            <IconButton
              color="primary"
              size="m"
              aria-label="Spark action"
              onClick={() => alert('IconButton clicked!')}
            >
              <Sparkles className="size-[20px]" />
            </IconButton>
            <span className="text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[color:var(--text-secondary)] font-medium">
              Click to activate spark
            </span>
          </div>
        </Card.Content>
      </Card.Root>
    </div>
  ),
};


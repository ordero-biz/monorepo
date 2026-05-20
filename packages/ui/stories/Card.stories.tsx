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

export const Default: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <Card.Root {...args}>
        <Card.Header>
          <div>
            <Card.Title>Standard Card Title</Card.Title>
            <Card.Description>Subheading or supporting text</Card.Description>
          </div>
        </Card.Header>
        <Card.Content>
          <p className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-[var(--text-secondary)]">
            This is a simple content-agnostic Card component. You can place any content
            here, including grids, media, forms, or custom layouts.
          </p>
        </Card.Content>
        <Card.Divider variant="solid" />
        <Card.Footer>
          <button
            type="button"
            className="rounded-[var(--button-radius)] bg-[var(--primary-dark)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--primary-darker)]"
          >
            Action 1
          </button>
          <button
            type="button"
            className="rounded-[var(--button-radius)] border border-[var(--color-divider)] px-4 py-2 text-xs font-bold text-foreground hover:bg-[var(--figma-grey-8)]"
          >
            Action 2
          </button>
        </Card.Footer>
      </Card.Root>
    </div>
  ),
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
  },
  render: (args) => (
    <div className="max-w-sm">
      <Card.Root {...args}>
        <Card.Header>
          <div>
            <Card.Title>Outlined Card Title</Card.Title>
            <Card.Description>Clean and modern outlined card style</Card.Description>
          </div>
        </Card.Header>
        <Card.Content>
          <p className="text-[length:var(--body2-size-desktop)] leading-[var(--body2-line-height-desktop)] font-[var(--body2-weight)] text-[var(--text-secondary)]">
            This outlined variant is perfect for lighter layouts or when placing multiple
            cards in a tight grid spacing.
          </p>
        </Card.Content>
        <Card.Divider variant="solid" />
        <Card.Footer>
          <button
            type="button"
            className="rounded-[var(--button-radius)] bg-[var(--primary-dark)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--primary-darker)]"
          >
            Action 1
          </button>
        </Card.Footer>
      </Card.Root>
    </div>
  ),
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

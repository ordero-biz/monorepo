import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography, type TypographyColor } from '@/ui/components/Typography';

const SAMPLE_TEXT = 'Sample text';
const colors = [
  'text-primary',
  'text-secondary',
  'text-disabled',
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] satisfies readonly TypographyColor[];

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    a11y: {
      test: 'off',
    },
  },
  args: {
    children: SAMPLE_TEXT,
    color: 'text-primary',
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const H1: Story = {
  args: {
    variant: 'h1',
  },
};

export const H2: Story = {
  args: {
    variant: 'h2',
  },
};

export const H3: Story = {
  args: {
    variant: 'h3',
  },
};

export const H4: Story = {
  args: {
    variant: 'h4',
  },
};

export const H5: Story = {
  args: {
    variant: 'h5',
  },
};

export const H6: Story = {
  args: {
    variant: 'h6',
  },
};

export const Subtitle1: Story = {
  args: {
    variant: 'subtitle1',
  },
};

export const Subtitle2: Story = {
  args: {
    variant: 'subtitle2',
  },
};

export const Body1: Story = {
  args: {
    variant: 'body1',
  },
};

export const Body2: Story = {
  args: {
    variant: 'body2',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
  },
};

export const Overline: Story = {
  args: {
    variant: 'overline',
  },
};

export const Colors: Story = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      {colors.map((color) => (
        <Typography key={color} color={color} variant="body1">
          {SAMPLE_TEXT}
        </Typography>
      ))}
    </div>
  ),
};

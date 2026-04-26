import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '@/ui/components/Typography';

const SAMPLE_TEXT = 'Sample text';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
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
      <Typography color="text-primary" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="text-secondary" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="text-disabled" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="primary" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="secondary" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="info" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="success" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="warning" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
      <Typography color="error" variant="body1">
        {SAMPLE_TEXT}
      </Typography>
    </div>
  ),
};

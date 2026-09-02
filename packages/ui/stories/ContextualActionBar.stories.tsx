import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash2 } from 'lucide-react';
import { Button } from '@/ui/components/Button';
import { ContextualActionBar } from '@/ui/components/ContextualActionBar';
import { Typography } from '@/ui/components/Typography';

const meta = {
  id: 'components-contextualactionbar',
  title: 'Components/Layout/ContextualActionBar',
  component: ContextualActionBar.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof ContextualActionBar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContextualActionBar.Root ariaLabel="Selected product actions">
      <ContextualActionBar.Left>
        <Typography variant="body1">3 selected</Typography>
        <Button color="inherit" size="s" variant="text">
          Clear selection
        </Button>
      </ContextualActionBar.Left>
      <ContextualActionBar.Right>
        <Button color="error" size="s" startIcon={<Trash2 aria-hidden="true" />}>
          Delete
        </Button>
      </ContextualActionBar.Right>
    </ContextualActionBar.Root>
  ),
};

export const UnsavedChanges: Story = {
  render: () => (
    <ContextualActionBar.Root ariaLabel="Unsaved changes actions">
      <ContextualActionBar.Left>
        <Typography variant="body1">You have unsaved changes</Typography>
      </ContextualActionBar.Left>
      <ContextualActionBar.Right>
        <Button color="inherit" size="s" variant="text">
          Discard
        </Button>
        <Button color="primary" size="s">
          Save changes
        </Button>
      </ContextualActionBar.Right>
    </ContextualActionBar.Root>
  ),
};

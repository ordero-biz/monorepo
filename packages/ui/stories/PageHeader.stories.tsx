import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus } from 'lucide-react';
import { Button } from '@/ui/components/Button';
import { PageHeader } from '@/ui/components/PageHeader';
import { Typography } from '@/ui/components/Typography';

const meta = {
  id: 'components-pageheader',
  title: 'Components/Layout/PageHeader',
  component: PageHeader.Root,
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithAction: Story = {
  render: () => (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">Attributes list</Typography>
      </PageHeader.Left>
      <PageHeader.Right>
        <Button type="button">
          <Plus aria-hidden="true" />
          Create attribute
        </Button>
      </PageHeader.Right>
    </PageHeader.Root>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <PageHeader.Root>
      <PageHeader.Left>
        <Typography variant="h5">Color</Typography>
      </PageHeader.Left>
    </PageHeader.Root>
  ),
};

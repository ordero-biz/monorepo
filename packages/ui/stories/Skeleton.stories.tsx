import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Chip } from '@/ui/components/Chip';
import { Skeleton } from '@/ui/components/Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'error' },
    docs: { description: { component: 'Wrap inline content to derive size from its layout, or use explicit dimensions for unknown content. loading defaults to true; false reveals children or removes a standalone placeholder. Children stay mounted, hidden and inert while loading, so their state is preserved. Use lightweight content, not portals or data-fetching subtrees. Explicit width and height override child sizing. The wrapper remains an inline grid when loaded. The parent owns layout, aria-busy, and one loading announcement outside the busy region. Retain loaded content during background refreshes. Pulse respects reduced-motion preferences.' } },
  },
  args: { width: 'var(--space-20)', height: 'var(--space-2)', shape: 'rounded', animated: true },
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Circle: Story = { args: { shape: 'circle', width: 'var(--space-6)', height: 'var(--space-6)' } };
export const Static: Story = { args: { animated: false } };
export const WithChildren: Story = {
  args: { width: undefined, height: undefined, children: <Chip size="s" variant="soft">Draft</Chip> },
};
export const Loaded: Story = {
  args: { ...WithChildren.args, loading: false },
};

const ChildrenSizingExample = () => {
  const [loading, setLoading] = useState(true);
  const toggleLoading = () => setLoading((previous) => !previous);
  return (
    <div className="flex flex-col items-start gap-[var(--space-2)]">
      <button type="button" onClick={toggleLoading}>Toggle loading</button>
      <output className="sr-only">{loading ? 'Loading preview' : 'Preview loaded'}</output>
      <div role="group" aria-label="Badge preview" aria-busy={loading}>
        <Skeleton loading={loading}><Chip size="s" variant="soft">Draft</Chip></Skeleton>
      </div>
      <div role="group" aria-label="Text preview" aria-busy={loading} className="w-[var(--space-20)]">
        <Skeleton loading={loading}>A category name that wraps onto multiple lines</Skeleton>
      </div>
      <Skeleton loading={loading}><button type="button">Select category</button></Skeleton>
      <button type="button">After preview</button>
    </div>
  );
};

export const ChildrenSizing: Story = {
  render: () => <ChildrenSizingExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByRole('group', { name: 'Badge preview' });
    const text = canvas.getByRole('group', { name: 'Text preview' });
    const badgeBefore = badge.getBoundingClientRect();
    const textBefore = text.getBoundingClientRect();
    await expect(canvas.queryByRole('button', { name: 'Select category' })).not.toBeInTheDocument();
    const toggle = canvas.getByRole('button', { name: 'Toggle loading' });
    toggle.focus();
    canvas.getByText('Select category').focus();
    await expect(toggle).toHaveFocus();
    await userEvent.click(toggle);
    await expect(canvas.getByRole('button', { name: 'Select category' })).toBeVisible();
    await expect(badge.getBoundingClientRect().width).toBe(badgeBefore.width);
    await expect(badge.getBoundingClientRect().height).toBe(badgeBefore.height);
    await expect(text.getBoundingClientRect().height).toBe(textBefore.height);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Select category' })).toHaveFocus();
  },
};
export const ContentPreview: Story = {
  render: () => (
    <>
      <output className="sr-only">Loading category details</output>
    <section aria-label="Category details" aria-busy="true" className="flex flex-col gap-[var(--space-2)]">
      <div className="flex items-center gap-[var(--space-1)]">
        <Skeleton width="var(--space-10)" />
        <Skeleton>Brewing Accessories</Skeleton>
        <Skeleton><Chip size="s" variant="soft">Draft</Chip></Skeleton>
      </div>
    </section>
    </>
  ),
};

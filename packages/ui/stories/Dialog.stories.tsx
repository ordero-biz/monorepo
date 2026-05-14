import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/ui/components/Button';
import { Dialog } from '@/ui/components/Dialog';

type DialogStoryProps = {
  fullscreen?: boolean;
  scrollable?: boolean;
  size?: 'xs' | 'sm' | 'md';
};

const DialogStory = ({ fullscreen, scrollable, size }: DialogStoryProps) => (
  <div className="flex min-h-[320px] items-center justify-center bg-[var(--background-paper)] p-[var(--space-3)]">
    <Dialog.Root>
      <Dialog.Trigger>View notifications</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Viewport>
          <Dialog.Popup fullscreen={fullscreen} size={size}>
            <Dialog.Header>
              <Dialog.Title>Notifications</Dialog.Title>
              <Dialog.Description>
                You are all caught up. Good job!
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Content scrollable={scrollable}>
              <p>No new alerts at this time.</p>
            </Dialog.Content>
            <Dialog.Footer />
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
);

const meta = {
  title: 'Components/Dialog',
  component: DialogStory,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DialogStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'sm',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const FullscreenDefault: Story = {
  args: {
    fullscreen: true,
    size: 'sm',
  },
};

export const Scrollable: Story = {
  render: (args) => (
    <div className="flex min-h-[320px] items-center justify-center bg-[var(--background-paper)] p-[var(--space-3)]">
      <Dialog.Root>
        <Dialog.Trigger>Open long content</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup {...args}>
              <Dialog.Header>
                <Dialog.Title>Terms and conditions</Dialog.Title>
                <Dialog.Description>
                  Please review all sections before proceeding.
                </Dialog.Description>
              </Dialog.Header>
              <Dialog.Content scrollable>
                {Array.from({ length: 20 }).map((_, index) => (
                  <p key={index}>
                    Section {index + 1}. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                ))}
              </Dialog.Content>
              <Dialog.Footer>
                <Button color="primary">Accept</Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  ),
  args: {
    size: 'sm',
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '@/ui/components/Button';
import { Dialog } from '@/ui/components/Dialog';

type DialogStoryProps = {
  fullscreen?: boolean;
  scrollable?: boolean;
  size?: 'xs' | 'sm' | 'md';
};

const CONTENT_SECTIONS = [
  {
    title: 'What a dialog is for',
    body: 'Use a dialog for focused tasks that should stay on top of the page while preserving the current context.',
  },
  {
    title: 'Anatomy at a glance',
    body: 'Compose Root, Trigger, Portal, Backdrop, Viewport, Popup, Title, Description, Content, and Close.',
  },
  {
    title: 'Keyboard and focus behavior',
    body: 'Focus moves into the dialog on open, stays trapped while open, and returns to the trigger when closed.',
  },
  {
    title: 'Accessible labeling',
    body: 'Keep title and description explicit so assistive technologies announce meaningful context.',
  },
  {
    title: 'Viewport overflow',
    body: 'Use internal scrolling for long content while keeping actions visible and reachable.',
  },
  {
    title: 'Transitions',
    body: 'Prefer short, subtle opacity and scale transitions to keep interaction responsive.',
  },
  {
    title: 'Mobile ergonomics',
    body: 'Ensure controls remain reachable and avoid forcing full-screen layouts unless the task requires it.',
  },
  {
    title: 'Content guidelines',
    body: 'Lead with outcome-oriented copy and keep supporting text concise and actionable.',
  },
  {
    title: 'Controlled state',
    body: 'Use controlled state when other page regions need to react to dialog open or close changes.',
  },
  {
    title: 'Close affordances',
    body: 'Provide a clear close action so users do not need to rely only on Escape or outside pointer presses.',
  },
  {
    title: 'Forms inside dialogs',
    body: 'Keep forms short, validate inline, and make the primary action specific to the outcome.',
  },
  {
    title: 'Internationalization',
    body: 'Plan for longer translated labels and copy so headings and buttons can wrap gracefully.',
  },
  {
    title: 'Performance',
    body: 'Keep heavy dialog content lazy unless the same dialog is reopened often enough to justify keeping it mounted.',
  },
  {
    title: 'When a popover is better',
    body: 'Use a popover or menu for lightweight anchored actions that should not interrupt the current workflow.',
  },
  {
    title: 'Follow-up and cleanup',
    body: 'After a successful action, close the dialog and show the result in the surrounding page context.',
  },
];

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const documentBody = canvasElement.ownerDocument.body;
    const viewport = canvasElement.ownerDocument.defaultView;

    await userEvent.click(
      canvas.getByRole('button', { name: 'View notifications' })
    );

    const dialog = within(documentBody).getByRole('dialog', {
      name: 'Notifications',
    });

    await waitFor(() => {
      const rect = dialog.getBoundingClientRect();
      const footer = dialog.querySelector('footer');
      const footerRect = footer?.getBoundingClientRect();

      expect(rect.top).toBe(0);
      expect(rect.left).toBe(0);
      expect(Math.round(rect.width)).toBe(viewport?.innerWidth);
      expect(Math.round(rect.height)).toBe(viewport?.innerHeight);
      expect(Math.round(footerRect?.bottom ?? 0)).toBe(viewport?.innerHeight);
    });
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
                {CONTENT_SECTIONS.map((item) => (
                  <section
                    className="flex flex-col gap-[var(--space-1)] p-[var(--space-2)]"
                    key={item.title}
                  >
                    <h3 className="text-[length:var(--body1-size-desktop)] leading-[var(--body1-line-height-desktop)] font-bold">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)]">{item.body}</p>
                  </section>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const documentBody = canvasElement.ownerDocument.body;

    await userEvent.click(
      canvas.getByRole('button', { name: 'Open long content' })
    );

    const dialog = within(documentBody).getByRole('dialog', {
      name: 'Terms and conditions',
    });
    const footerAction = within(dialog).getByRole('button', { name: 'Accept' });
    const finalSection = within(dialog).getByText('Follow-up and cleanup');

    await waitFor(() => expect(footerAction).toBeVisible());

    finalSection.scrollIntoView({ block: 'nearest' });

    await waitFor(() => expect(finalSection).toBeVisible());
    await waitFor(() => expect(footerAction).toBeVisible());
  },
};

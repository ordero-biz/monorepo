import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { Button } from '@/ui/components/Button';
import { Dialog } from './Dialog';
import type { DialogFooterProps, DialogPopupProps } from './types';

type DialogTestFixtureProps = {
  closeLabel?: string;
  content?: ReactNode;
  description?: string;
  footerChildren?: ReactNode;
  footerProps?: DialogFooterProps;
  title?: string;
  triggerLabel?: string;
} & Pick<DialogPopupProps, 'fullscreen' | 'size'>;

const DialogTestFixture = ({
  closeLabel,
  content = <p>Latest updates are available.</p>,
  description = 'You are all caught up. Good job!',
  footerChildren,
  footerProps,
  fullscreen,
  size,
  title = 'Notifications',
  triggerLabel = 'View notifications',
}: DialogTestFixtureProps) => (
  <Dialog.Root>
    <Dialog.Trigger>{triggerLabel}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Viewport>
        <Dialog.Popup fullscreen={fullscreen} size={size}>
          <Dialog.Header>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Content>{content}</Dialog.Content>
          <Dialog.Footer
            {...footerProps}
            closeButtonLabel={closeLabel ?? footerProps?.closeButtonLabel}
          >
            {footerChildren}
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
);

describe('Dialog', () => {
  const { setup } = prepareSetup<DialogTestFixtureProps>({
    component: DialogTestFixture,
    props: {},
  });

  it('opens and closes the popup', async () => {
    const user = userEvent.setup();

    setup({});

    expect(
      screen.queryByText('You are all caught up. Good job!')
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'View notifications' })
    );

    expect(
      screen.getByRole('heading', { name: 'Notifications' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('You are all caught up. Good job!')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(
      screen.queryByText('You are all caught up. Good job!')
    ).not.toBeInTheDocument();
  });

  it('applies fullscreen mode when enabled', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup fullscreen>
              <Dialog.Header>
                <Dialog.Title>Dialog</Dialog.Title>
                <Dialog.Description>Full screen mode</Dialog.Description>
              </Dialog.Header>
              <Dialog.Content>
                <p>Content</p>
              </Dialog.Content>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    );

    expect(screen.getByRole('dialog')).toHaveClass('max-w-none');
  });

  it('applies the selected popup size width class', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup size="xs">
              <Dialog.Header>
                <Dialog.Title>Dialog</Dialog.Title>
                <Dialog.Description>Sized popup</Dialog.Description>
              </Dialog.Header>
              <Dialog.Content>
                <p>Content</p>
              </Dialog.Content>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    );

    expect(screen.getByRole('dialog')).toHaveClass(
      'max-w-[var(--dialog-width-xs)]'
    );
  });

  it('applies scrollable popup behavior when enabled', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup>
              <Dialog.Header>
                <Dialog.Title>Dialog</Dialog.Title>
                <Dialog.Description>Scrollable body</Dialog.Description>
              </Dialog.Header>
              <Dialog.Content scrollable>
                {Array.from(
                  { length: 20 },
                  (_, rowNumber) => rowNumber + 1
                ).map((rowNumber) => (
                  <p key={rowNumber}>Row {rowNumber}</p>
                ))}
              </Dialog.Content>
              <Dialog.Footer />
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    );

    const popupElement = screen.getByRole('dialog');
    const popupContentElement = popupElement.querySelector(
      '[data-slot="dialog-content"]'
    );

    expect(popupElement).not.toHaveAttribute('data-scrollable');
    expect(popupContentElement).not.toBeNull();
    expect(popupContentElement).toHaveAttribute('data-scrollable', 'true');
  });

  it('renders footer children alongside the default close action', () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Portal>
          <Dialog.Backdrop />
          <Dialog.Viewport>
            <Dialog.Popup>
              <Dialog.Header>
                <Dialog.Title>Dialog</Dialog.Title>
                <Dialog.Description>Actions</Dialog.Description>
              </Dialog.Header>
              <Dialog.Content>
                <p>Content</p>
              </Dialog.Content>
              <Dialog.Footer>
                <Button color="primary">Accept</Button>
              </Dialog.Footer>
            </Dialog.Popup>
          </Dialog.Viewport>
        </Dialog.Portal>
      </Dialog.Root>
    );

    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});

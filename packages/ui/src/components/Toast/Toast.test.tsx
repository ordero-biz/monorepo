import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell } from 'lucide-react';
import { useRef } from 'react';
import { Toast, ToastProvider, ToastViewport, useToastManager } from './index';
import type { ToastLayout } from './types';

describe('Toast', () => {
  it('renders a default toast from the shared toast hook', async () => {
    const { user } = setupToast();

    await user.click(
      screen.getByRole('button', { name: 'Create default toast' })
    );

    expect(
      await screen.findByText('This is a default message!')
    ).toBeInTheDocument();
    expect(getDismissButton()).not.toBeNull();
  });

  it('renders the semantic variant icon for regular toasts', async () => {
    const { user } = setupToast();

    await user.click(screen.getByRole('button', { name: 'Create info toast' }));

    const toast = await screen.findByRole('dialog', { name: 'Notification' });

    expect(
      within(toast).getByText('This is an info message!')
    ).toBeInTheDocument();
    expect(toast.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders a custom icon from toast data', async () => {
    const { user } = setupToast();

    await user.click(
      screen.getByRole('button', { name: 'Create custom icon toast' })
    );

    expect(await screen.findByLabelText('Updates')).toBeInTheDocument();
  });

  it('supports separate title and description content', async () => {
    const { user } = setupToast();

    await user.click(
      screen.getByRole('button', { name: 'Create titled toast' })
    );

    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are live.')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Saved' })).toBeInTheDocument();
  });

  it('updates an existing toast instead of rendering a duplicate when id matches', async () => {
    const { user } = setupToast();

    await user.click(screen.getByRole('button', { name: 'Update sync toast' }));

    expect(await screen.findByText('Sync finished')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Sync started')).not.toBeInTheDocument();
    });

    expect(
      screen.getAllByRole('dialog', { name: 'Notification' })
    ).toHaveLength(1);
  });

  it('dismisses a toast when the close button is pressed', async () => {
    const { user } = setupToast();

    await user.click(
      screen.getByRole('button', { name: 'Create warning toast' })
    );

    const dismissButton = getDismissButton();

    expect(dismissButton).not.toBeNull();

    await user.click(dismissButton as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.queryByText('Temporary message')).not.toBeInTheDocument();
    });
  });

  it('respects the provider limit and keeps the latest toast visible', async () => {
    const { user } = setupToast({ limit: 1 });

    await user.click(
      screen.getByRole('button', { name: 'Create limited toasts' })
    );

    const visibleToast = await waitFor(() => {
      const toast = document.querySelector<HTMLElement>(
        '[data-slot="toast"]:not([data-limited]):not([data-ending-style])'
      );

      expect(toast).not.toBeNull();

      return toast;
    });

    expect(
      within(visibleToast as HTMLElement).getByText('Second toast')
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('First toast')).not.toBeInTheDocument();
    });
  });

  it('removes overflowed stack toasts after repeated additions', async () => {
    const { user } = setupToast({ limit: 3 });

    const trigger = screen.getByRole('button', {
      name: 'Create sequential toast',
    });

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    await waitFor(() => {
      expect(
        screen.getAllByRole('dialog', { name: 'Notification' })
      ).toHaveLength(3);
    });

    expect(screen.getByText('Toast 3')).toBeInTheDocument();
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
    expect(screen.getByText('Toast 5')).toBeInTheDocument();
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
  });

  it('reveals the next hidden toast when a visible toast is dismissed', async () => {
    const { user } = setupToast({ limit: 3 });

    const trigger = screen.getByRole('button', {
      name: 'Create sequential toast',
    });

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    const toastFourDescription = await screen.findByText('Toast 4');
    const toastFour = toastFourDescription.closest<HTMLElement>(
      '[data-slot="toast"]'
    );

    expect(toastFour).not.toBeNull();
    const dismissButton = (
      toastFour as HTMLElement
    ).querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss notification"]'
    );

    expect(dismissButton).not.toBeNull();

    await user.click(dismissButton as HTMLButtonElement);

    await waitFor(() => {
      expect(screen.queryByText('Toast 4')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });

  it('expands the stack while a toast is hovered', async () => {
    const { user } = setupToast({ limit: 5 });

    await user.click(
      screen.getByRole('button', { name: 'Create multiple default toasts' })
    );

    const dialogs = await screen.findAllByRole('dialog', {
      name: 'Notification',
    });
    const visibleToasts = getVisibleToasts();

    expect(visibleToasts).toHaveLength(3);
    expect(
      visibleToasts.every((toast) => !toast.hasAttribute('data-expanded'))
    ).toBe(true);

    await user.hover(dialogs[0] as HTMLElement);

    await waitFor(() => {
      expect(
        getVisibleToasts().every((toast) => toast.hasAttribute('data-expanded'))
      ).toBe(true);
    });

    await user.unhover(dialogs[0] as HTMLElement);

    await waitFor(() => {
      expect(
        getVisibleToasts().every(
          (toast) => !toast.hasAttribute('data-expanded')
        )
      ).toBe(true);
    });
  });

  it('renders a list layout when requested', async () => {
    const { user } = setupToast({ layout: 'list', limit: 5 });

    await user.click(
      screen.getByRole('button', { name: 'Create multiple default toasts' })
    );

    const visibleToasts = await waitFor(() => {
      const toasts = getVisibleToasts();

      expect(toasts).toHaveLength(3);

      return toasts;
    });

    expect(
      visibleToasts.every((toast) => toast.className.includes('relative'))
    ).toBe(true);
    expect(
      visibleToasts.every((toast) => !toast.className.includes('absolute'))
    ).toBe(true);
  });

  it('keeps overflowed list toasts mounted in a limited state for smooth promotion', async () => {
    const { user } = setupToast({ layout: 'list', limit: 3 });

    const trigger = screen.getByRole('button', {
      name: 'Create sequential toast',
    });

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    await waitFor(() => {
      expect(
        document.querySelectorAll('[data-slot="toast"][data-limited]')
      ).toHaveLength(1);
    });

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
  });

  it('marks a promoted list toast during dismissal so it can skip the fade-in blink', async () => {
    const { user } = setupToast({ layout: 'list', limit: 3 });

    const trigger = screen.getByRole('button', {
      name: 'Create sequential toast',
    });

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    const toastFour = (await screen.findByText('Toast 4')).closest<HTMLElement>(
      '[data-slot="toast"]'
    );

    expect(toastFour).not.toBeNull();

    await user.click(
      (toastFour as HTMLElement).querySelector<HTMLButtonElement>(
        'button[aria-label="Dismiss notification"]'
      ) as HTMLButtonElement
    );

    await waitFor(() => {
      expect(
        screen.getByText('Toast 1').closest('[data-slot="toast"]')
      ).toHaveAttribute('data-promoted');
    });
  });

  it('supports app-level provider and viewport with the shared toast hook', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider timeout={0}>
        <AppLevelToastTrigger />
        <ToastViewport viewportLabel="Application notifications" />
      </ToastProvider>
    );

    await user.click(
      screen.getByRole('button', { name: 'Create app-level toast' })
    );

    expect(
      await screen.findByRole('region', { name: 'Application notifications' })
    ).toBeInTheDocument();
    expect(await screen.findByText('Created from hook')).toBeInTheDocument();
  });
});

const setupToast = ({
  layout = 'stack',
  limit = 3,
}: {
  layout?: ToastLayout;
  limit?: number;
} = {}) => {
  const user = userEvent.setup();

  render(
    <Toast
      layout={layout}
      limit={limit}
      timeout={0}
      viewportLabel="Application notifications"
    >
      <ToastScenarioTriggers />
    </Toast>
  );

  return {
    user,
  };
};

const getDismissButton = () =>
  document.querySelector<HTMLButtonElement>(
    'button[aria-label="Dismiss notification"]'
  );

const getVisibleToasts = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-slot="toast"]:not([data-limited])'
    )
  );

const ToastScenarioTriggers = () => {
  const { add } = useToastManager();
  const countRef = useRef(0);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          add({
            description: 'This is a default message!',
            timeout: 0,
            type: 'default',
          });
        }}
      >
        Create default toast
      </button>
      <button
        type="button"
        onClick={() => {
          add({
            description: 'This is an info message!',
            timeout: 0,
            type: 'info',
          });
        }}
      >
        Create info toast
      </button>
      <button
        type="button"
        onClick={() => {
          add({
            data: {
              icon: <Bell aria-label="Updates" />,
            },
            description: 'New order received',
            timeout: 0,
            type: 'info',
          });
        }}
      >
        Create custom icon toast
      </button>
      <button
        type="button"
        onClick={() => {
          add({
            description: 'Your changes are live.',
            timeout: 0,
            title: 'Saved',
            type: 'success',
          });
        }}
      >
        Create titled toast
      </button>
      <button
        type="button"
        onClick={() => {
          add({
            description: 'Sync started',
            id: 'sync-toast',
            timeout: 0,
            type: 'info',
          });
          add({
            description: 'Sync finished',
            id: 'sync-toast',
            timeout: 0,
            type: 'success',
          });
        }}
      >
        Update sync toast
      </button>
      <button
        type="button"
        onClick={() => {
          add({
            description: 'Temporary message',
            timeout: 0,
            type: 'warning',
          });
        }}
      >
        Create warning toast
      </button>
      <button
        type="button"
        onClick={() => {
          add({
            description: 'First toast',
            timeout: 0,
            type: 'info',
          });
          add({
            description: 'Second toast',
            timeout: 0,
            type: 'warning',
          });
        }}
      >
        Create limited toasts
      </button>
      <button
        type="button"
        onClick={() => {
          add({
            description: 'First stacked toast',
            timeout: 0,
            type: 'default',
          });
          add({
            description: 'Second stacked toast',
            timeout: 0,
            type: 'default',
          });
          add({
            description: 'Third stacked toast',
            timeout: 0,
            type: 'default',
          });
        }}
      >
        Create multiple default toasts
      </button>
      <button
        type="button"
        onClick={() => {
          countRef.current += 1;

          add({
            description: `Toast ${countRef.current}`,
            timeout: 0,
            type: 'default',
          });
        }}
      >
        Create sequential toast
      </button>
    </>
  );
};

const AppLevelToastTrigger = () => {
  const { add } = useToastManager();

  return (
    <button
      type="button"
      onClick={() => {
        add({
          description: 'Created from hook',
          timeout: 0,
          type: 'info',
        });
      }}
    >
      Create app-level toast
    </button>
  );
};

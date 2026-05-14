import { prepareSetup } from '@ordero/test-config/react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Bell } from 'lucide-react';
import type { ReactNode } from 'react';
import { Toast, ToastProvider, ToastViewport, useToastManager } from './index';
import type { ToastLayout, ToastManagerValue, ToastProps } from './types';

type ToastTriggerProps = {
  children: ReactNode;
  onTrigger: (add: ToastManagerValue['add']) => void;
};

type SetupToastArgs = {
  layout?: ToastLayout;
  limit?: number;
  label: string;
  onTrigger: ToastTriggerProps['onTrigger'];
};

const ToastTrigger = ({ children, onTrigger }: ToastTriggerProps) => {
  const { add } = useToastManager();

  return (
    <button
      type="button"
      onClick={() => {
        onTrigger(add);
      }}
    >
      {children}
    </button>
  );
};

type AppLevelToastFixtureProps = {
  description: string;
  label: string;
};

const AppLevelToastFixture = ({
  description,
  label,
}: AppLevelToastFixtureProps) => (
  <ToastProvider timeout={0}>
    <ToastTrigger
      onTrigger={(add) => {
        add({
          description,
          timeout: 0,
          type: 'info',
        });
      }}
    >
      {label}
    </ToastTrigger>
    <ToastViewport viewportLabel="Application notifications" />
  </ToastProvider>
);

const { setup: setupAppLevelToastFixture } =
  prepareSetup<AppLevelToastFixtureProps>({
    component: AppLevelToastFixture,
    props: {
      description: 'Created from hook',
      label: 'Create app-level toast',
    },
  });

type ToastTestShellProps = ToastProps & {
  label: string;
  onTrigger: ToastTriggerProps['onTrigger'];
};

const ToastTestShell = ({
  onTrigger,
  label,
  layout,
  limit,
  swipeDirection,
  timeout,
  viewportLabel,
}: ToastTestShellProps) => (
  <Toast
    layout={layout}
    limit={limit}
    swipeDirection={swipeDirection}
    timeout={timeout}
    viewportLabel={viewportLabel}
  >
    <ToastTrigger onTrigger={onTrigger}>{label}</ToastTrigger>
  </Toast>
);

const { setup } = prepareSetup<ToastTestShellProps>({
  component: ToastTestShell,
  props: {
    layout: 'stack',
    limit: 3,
    timeout: 0,
    viewportLabel: 'Application notifications',
    label: 'Test',
    onTrigger: vi.fn(),
  },
});

const setupToast = ({
  layout = 'stack',
  limit = 3,
  label,
  onTrigger,
}: SetupToastArgs) => {
  const user = userEvent.setup();

  setup({
    layout,
    limit,
    label,
    onTrigger,
  });

  return {
    user,
    trigger: screen.getByRole('button', { name: label }),
  };
};

const getToastByText = (text: string) => {
  const allToasts = screen.queryAllByRole('dialog');
  const toast = allToasts.find((toast) => within(toast).queryByText(text));

  if (!toast) {
    throw new Error(`Expected to find toast with text: ${text}`);
  }

  return toast;
};

describe('Toast', () => {
  it('renders a default toast from the shared toast hook', async () => {
    const { trigger, user } = setupToast({
      label: 'Create default toast',
      onTrigger: (add) => {
        add({
          description: 'This is a default message!',
          timeout: 0,
          type: 'default',
        });
      },
    });

    await user.click(trigger);

    expect(
      await screen.findByText('This is a default message!')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Dismiss notification')).not.toBeNull();
  });

  it('renders regular toasts with notification content', async () => {
    const { trigger, user } = setupToast({
      label: 'Create info toast',
      onTrigger: (add) => {
        add({
          description: 'This is an info message!',
          timeout: 0,
          type: 'info',
        });
      },
    });

    await user.click(trigger);

    const toast = await screen.findByRole('dialog', {
      name: 'This is an info message!',
    });

    expect(
      within(toast).getByText('This is an info message!')
    ).toBeInTheDocument();
    expect(
      within(toast).getByLabelText('Dismiss notification')
    ).toBeInTheDocument();
  });

  it('renders a custom icon from toast data', async () => {
    const { trigger, user } = setupToast({
      label: 'Create custom icon toast',
      onTrigger: (add) => {
        add({
          data: {
            icon: <Bell aria-label="Updates" />,
          },
          description: 'New order received',
          timeout: 0,
          type: 'info',
        });
      },
    });

    await user.click(trigger);

    expect(await screen.findByLabelText('Updates')).toBeInTheDocument();
  });

  it('supports separate title and description content', async () => {
    const { trigger, user } = setupToast({
      label: 'Create titled toast',
      onTrigger: (add) => {
        add({
          description: 'Your changes are live.',
          timeout: 0,
          title: 'Saved',
          type: 'success',
        });
      },
    });

    await user.click(trigger);

    expect(await screen.findByText('Saved')).toBeInTheDocument();
    expect(screen.getByText('Your changes are live.')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Saved' })).toBeInTheDocument();
  });

  it('updates an existing toast instead of rendering a duplicate when id matches', async () => {
    const { trigger, user } = setupToast({
      label: 'Update sync toast',
      onTrigger: (add) => {
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
      },
    });

    await user.click(trigger);

    await waitFor(() => {
      expect(
        screen.getAllByRole('dialog', { name: 'Sync finished' })
      ).toHaveLength(1);
    });

    const toast = screen.getByRole('dialog', { name: 'Sync finished' });

    expect(within(toast).getByText('Sync finished')).toBeInTheDocument();
    expect(within(toast).queryByText('Sync started')).not.toBeInTheDocument();
  });

  it('dismisses a toast when the close button is pressed', async () => {
    const { trigger, user } = setupToast({
      label: 'Create warning toast',
      onTrigger: (add) => {
        add({
          description: 'Temporary message',
          timeout: 0,
          type: 'warning',
        });
      },
    });

    await user.click(trigger);

    const dismissButton = screen.getByLabelText('Dismiss notification');

    expect(dismissButton).not.toBeNull();

    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText('Temporary message')).not.toBeInTheDocument();
    });
  });

  it('respects the provider limit and keeps the latest toast visible', async () => {
    const { trigger, user } = setupToast({
      label: 'Create limited toasts',
      limit: 1,
      onTrigger: (add) => {
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
      },
    });

    await user.click(trigger);

    await waitFor(() => {
      expect(
        screen.getAllByRole('dialog', { name: 'Second toast' })
      ).toHaveLength(1);
    });

    expect(screen.getByText('Second toast')).toBeInTheDocument();
    expect(screen.queryByText('First toast')).not.toBeInTheDocument();
  });

  it('removes overflowed stack toasts after repeated additions', async () => {
    let toastCount = 0;
    const { trigger, user } = setupToast({
      label: 'Create sequential toast',
      limit: 3,
      onTrigger: (add) => {
        toastCount += 1;

        add({
          description: `Toast ${toastCount}`,
          timeout: 0,
          type: 'default',
        });
      },
    });

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    await waitFor(() => {
      expect(
        screen.getAllByRole('dialog', { name: /Toast [3-5]/ })
      ).toHaveLength(3);
    });

    expect(screen.getByText('Toast 3')).toBeInTheDocument();
    expect(screen.getByText('Toast 4')).toBeInTheDocument();
    expect(screen.getByText('Toast 5')).toBeInTheDocument();
    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Toast 2')).not.toBeInTheDocument();
  });

  it('reveals the next hidden toast when a visible toast is dismissed', async () => {
    let toastCount = 0;
    const { trigger, user } = setupToast({
      label: 'Create sequential toast',
      limit: 3,
      onTrigger: (add) => {
        toastCount += 1;

        add({
          description: `Toast ${toastCount}`,
          timeout: 0,
          type: 'default',
        });
      },
    });

    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);
    await user.click(trigger);

    await screen.findByText('Toast 4');

    const toastFour = getToastByText('Toast 4');
    const dismissButton = within(toastFour).getByLabelText(
      'Dismiss notification'
    );

    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText('Toast 4')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 3')).toBeInTheDocument();
  });

  it('renders list layout notifications with the same accessible contract', async () => {
    const { trigger, user } = setupToast({
      label: 'Create multiple default toasts',
      layout: 'list',
      limit: 5,
      onTrigger: (add) => {
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
      },
    });

    await user.click(trigger);

    await waitFor(() => {
      expect(
        screen.getAllByRole('dialog', {
          name: /First stacked toast|Second stacked toast|Third stacked toast/,
        })
      ).toHaveLength(3);
    });

    expect(screen.getByText('First stacked toast')).toBeInTheDocument();
    expect(screen.getByText('Second stacked toast')).toBeInTheDocument();
    expect(screen.getByText('Third stacked toast')).toBeInTheDocument();
  });

  it('supports app-level provider and viewport with the shared toast hook', async () => {
    const user = userEvent.setup();

    const { description, label } = setupAppLevelToastFixture({
      description: 'Toast description',
      label: 'Test label',
    });

    await user.click(screen.getByRole('button', { name: label }));

    expect(
      await screen.findByRole('region', { name: 'Application notifications' })
    ).toBeInTheDocument();
    expect(await screen.findByText(description)).toBeInTheDocument();
  });
});

import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { Button } from '@/ui/components/Button';
import { Toast, useToastManager } from '@/ui/components/Toast';
import type { ToastLayout, ToastVariant } from '@/ui/components/Toast';

const regularVariants = [
  'default',
  'info',
  'warning',
  'error',
  'success',
] satisfies readonly ToastVariant[];

const layouts = ['stack', 'list'] satisfies readonly ToastLayout[];

const TOAST_TIMEOUT = 5000;

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    viewportLabel: 'Storybook notifications',
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

const ToastStoryLayout = ({
  children,
}: {
  children?: ReactNode;
}) => (
  <div className='inline-flex max-w-full flex-col gap-4 bg-[var(--background-default)] p-4'>
    <div className='flex max-w-2xl flex-col gap-4'>
      {children}
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => (
    <ToastStoryLayout>
      <Toast {...args}>
        <div className='flex flex-wrap gap-3'>
          <ToastStoryButton type='default' />
        </div>
      </Toast>
    </ToastStoryLayout>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <ToastStoryLayout>
      <Toast {...args}>
        <div className='flex flex-wrap gap-3'>
          {regularVariants.map((variant) => (
            <ToastStoryButton key={variant} type={variant} />
          ))}
        </div>
      </Toast>
    </ToastStoryLayout>
  ),
};

export const Layouts: Story = {
  render: (args) => (
    <ToastStoryLayout>
      <div className='flex flex-wrap gap-6'>
        {layouts.map((layout) => (
          <Toast
            key={layout}
            {...args}
            layout={layout}
            viewportLabel={`${args.viewportLabel ?? 'Storybook notifications'} ${layout}`}
          >
            <div className='flex flex-col gap-3'>
              <span className='text-[length:var(--subtitle2-size-desktop)] font-[var(--subtitle2-weight)] capitalize text-[var(--text-primary)]'>
                {layout}
              </span>
              <div className='flex flex-wrap gap-3'>
                {regularVariants.map((variant) => (
                  <ToastStoryButton
                    key={`${layout}-${variant}`}
                    type={variant}
                  />
                ))}
              </div>
            </div>
          </Toast>
        ))}
      </div>
    </ToastStoryLayout>
  ),
};

export const Deduplicated: Story = {
  render: (args) => (
    <ToastStoryLayout>
      <Toast {...args}>
        <DeduplicatedToastButton />
      </Toast>
    </ToastStoryLayout>
  ),
};

export const WithoutAutoclose: Story = {
  render: (args) => (
    <ToastStoryLayout>
      <Toast {...args}>
        <ToastStoryButton autoclose={false} type="info" />
      </Toast>
    </ToastStoryLayout>
  ),
};

const ToastStoryButton = ({
  autoclose = true,
  type,
}: {
  autoclose?: boolean;
  type: ToastVariant;
}) => {
  const { add } = useToastManager();

  return (
    <Button
      color={type === 'default' ? 'inherit' : type}
      onClick={() => {
        add({
          description: getToastCopy(type),
          timeout: autoclose ? TOAST_TIMEOUT : 0,
          type,
        });
      }}
      variant={type === 'default' ? 'contained' : 'soft'}
    >
      {type}
    </Button>
  );
};

const DeduplicatedToastButton = () => {
  const { add } = useToastManager();
  const countRef = useRef(0);

  return (
    <Button
      color='info'
      onClick={() => {
        countRef.current += 1;

        add({
          description: `Sync notification updated ${countRef.current} times`,
          id: 'storybook-deduplicated-toast',
          timeout: TOAST_TIMEOUT,
          type: countRef.current % 2 === 0 ? 'success' : 'info',
        });
      }}
      variant='soft'
    >
      deduplicated
    </Button>
  );
};

const getToastCopy = (type: ToastVariant) => {
  switch (type) {
    case 'info':
      return 'This is an info message!';
    case 'error':
      return 'This is an error message!';
    case 'warning':
      return 'This is a warning message!';
    case 'success':
      return 'This is a success message!';
    default:
      return 'This is a default message!';
  }
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Textarea, type TextareaProps } from '@/ui/components/Textarea';

const previewGridClassName = 'grid gap-8 md:grid-cols-2';
const previewColumnClassName = 'min-w-0';

const renderPair = ({
  filled,
  outlined,
}: {
  filled: TextareaProps;
  outlined: TextareaProps;
}) => (
  <div className={previewGridClassName}>
    <div className={previewColumnClassName}>
      <Textarea {...outlined} />
    </div>
    <div className={previewColumnClassName}>
      <Textarea {...filled} />
    </div>
  </div>
);

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: 'Textarea',
    placeholder: 'Value',
    resize: 'vertical',
  },
  argTypes: {
    resize: {
      control: 'select',
      options: ['vertical', 'none'],
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        variant: 'filled',
      },
      outlined: {
        ...args,
      },
    }),
};

export const WithValue: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue:
          'Use this area for longer notes, comments, or internal details.',
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue:
          'Use this area for longer notes, comments, or internal details.',
      },
    }),
};

export const Disabled: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'Disabled value',
        disabled: true,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Disabled value',
        disabled: true,
      },
    }),
};

export const Invalid: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'Incorrect value',
        errorText: 'Textarea value is invalid.',
        invalid: true,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Incorrect value',
        errorText: 'Textarea value is invalid.',
        invalid: true,
      },
    }),
};

export const WithHelperText: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'Value',
        helperText: 'The filled textarea is described by supporting text.',
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Value',
        helperText: 'The outlined textarea is described by supporting text.',
      },
    }),
};

export const NonResizable: Story = {
  args: {
    resize: 'none',
  },
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'This textarea keeps a fixed size.',
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'This textarea keeps a fixed size.',
      },
    }),
};

export const ExplicitRows: Story = {
  render: () => (
    <div className={previewGridClassName}>
      {(['outlined', 'filled'] as const).map((variant) => (
        <div
          className="flex min-w-0 flex-col gap-[var(--space-2)]"
          key={variant}
        >
          <Textarea
            label={`${variant} default`}
            resize="none"
            variant={variant}
          />
          <Textarea
            label={`${variant} two rows`}
            resize="none"
            rows={2}
            variant={variant}
          />
          <Textarea
            label={`${variant} three rows`}
            resize="none"
            rows={3}
            variant={variant}
          />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const variant of ['outlined', 'filled']) {
      const defaultTextarea = canvas.getByRole('textbox', {
        name: `${variant} default`,
      });
      const twoRows = canvas.getByRole('textbox', {
        name: `${variant} two rows`,
      });
      const threeRows = canvas.getByRole('textbox', {
        name: `${variant} three rows`,
      });
      const defaultHeight = defaultTextarea.getBoundingClientRect().height;
      const lineHeight = Number.parseFloat(
        getComputedStyle(twoRows).lineHeight
      );
      await expect(twoRows.getBoundingClientRect().height).toBeCloseTo(
        lineHeight * 2,
        0
      );
      await expect(threeRows.getBoundingClientRect().height).toBeCloseTo(
        lineHeight * 3,
        0
      );
      await expect(threeRows.getBoundingClientRect().height).toBeLessThan(
        defaultHeight
      );
      await expect(defaultHeight).toBeGreaterThanOrEqual(
        Number.parseFloat(getComputedStyle(defaultTextarea).minHeight)
      );
      await expect(getComputedStyle(twoRows).resize).toBe('none');
    }
  },
};

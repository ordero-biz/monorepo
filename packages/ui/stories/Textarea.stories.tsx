import type { Meta, StoryObj } from '@storybook/react-vite';
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
    'aria-label': 'Textarea',
    placeholder: 'Value',
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
        invalid: true,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Incorrect value',
        invalid: true,
      },
    }),
};

export const WithAccessibleDescription: Story = {
  render: (args) => (
    <div className={previewGridClassName}>
      <div className={previewColumnClassName}>
        <Textarea
          {...args}
          aria-describedby="outlined-textarea-description"
          defaultValue="Value"
        />
        <p
          className="pt-2 text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[var(--text-secondary)]"
          id="outlined-textarea-description"
        >
          The outlined textarea is described by supporting text outside the
          component.
        </p>
      </div>
      <div className={previewColumnClassName}>
        <Textarea
          {...args}
          aria-describedby="filled-textarea-description"
          defaultValue="Value"
          variant="filled"
        />
        <p
          className="pt-2 text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[var(--text-secondary)]"
          id="filled-textarea-description"
        >
          The filled textarea is described by supporting text outside the
          component.
        </p>
      </div>
    </div>
  ),
};

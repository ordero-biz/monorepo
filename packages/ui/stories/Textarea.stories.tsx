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
  id: 'components-textarea',
  title: 'Components/Forms/Text Inputs/Textarea',
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eye, Search } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '@/ui/components/Button';
import { IconButton } from '@/ui/components/IconButton';
import { Input } from '@/ui/components/Input';

const previewGridClassName = 'grid gap-8 md:grid-cols-2';
const previewColumnClassName = 'min-w-0';

const renderPair = ({
  filled,
  outlined,
}: {
  filled: ComponentProps<typeof Input>;
  outlined: ComponentProps<typeof Input>;
}) => (
  <div className={previewGridClassName}>
    <div className={previewColumnClassName}>
      <Input {...outlined} />
    </div>
    <div className={previewColumnClassName}>
      <Input {...filled} />
    </div>
  </div>
);

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Input',
    placeholder: 'Value',
  },
} satisfies Meta<typeof Input>;

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

export const WithIconAdornments: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'Value',
        endAdornment: (
          <IconButton aria-label="Reveal value" color="default" size="m">
            <Eye />
          </IconButton>
        ),
        startIcon: Search,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Value',
        endAdornment: (
          <IconButton aria-label="Reveal value" color="default" size="m">
            <Eye />
          </IconButton>
        ),
        startIcon: Search,
      },
    }),
};

export const WithTextAndAction: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: '100',
        endAdornment: (
          <Button color="inherit" size="m" variant="contained">
            Action
          </Button>
        ),
        startAdornment: 'Kg',
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: '100',
        endAdornment: (
          <Button color="inherit" size="m" variant="contained">
            Action
          </Button>
        ),
        startAdornment: 'Kg',
      },
    }),
};

export const Disabled: Story = {
  render: (args) =>
    renderPair({
      filled: {
        ...args,
        defaultValue: 'Disabled',
        disabled: true,
        variant: 'filled',
      },
      outlined: {
        ...args,
        defaultValue: 'Disabled',
        disabled: true,
        startAdornment: 'Kg',
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
        <Input
          {...args}
          aria-describedby='outlined-input-description'
          defaultValue='Value'
        />
        <p
          className='pt-2 text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[var(--text-secondary)]'
          id='outlined-input-description'
        >
          The outlined input is described by supporting text outside the
          component.
        </p>
      </div>
      <div className={previewColumnClassName}>
        <Input
          {...args}
          aria-describedby='filled-input-description'
          defaultValue='Value'
          variant='filled'
        />
        <p
          className='pt-2 text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[var(--text-secondary)]'
          id='filled-input-description'
        >
          The filled input is described by supporting text outside the
          component.
        </p>
      </div>
    </div>
  ),
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
        <Input
          {...args}
          aria-describedby='outlined-input-description'
          defaultValue='Value'
        />
        <p
          className='pt-2 text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[var(--text-secondary)]'
          id='outlined-input-description'
        >
          The outlined input is described by supporting text outside the
          component.
        </p>
      </div>
      <div className={previewColumnClassName}>
        <Input
          {...args}
          aria-describedby='filled-input-description'
          defaultValue='Value'
          variant='filled'
        />
        <p
          className='pt-2 text-[length:var(--caption-size-desktop)] leading-[var(--caption-line-height-desktop)] text-[var(--text-secondary)]'
          id='filled-input-description'
        >
          The filled input is described by supporting text outside the
          component.
        </p>
      </div>
    </div>
  ),
};

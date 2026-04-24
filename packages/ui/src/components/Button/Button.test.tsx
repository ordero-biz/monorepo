import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SubmitEventHandler } from 'react';
import { Button } from './Button';

describe('Button', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders a button users can find by its accessible name', () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('uses the aria-label as the accessible name when provided', () => {
    render(<Button aria-label="Close dialog" />);

    expect(
      screen.getByRole('button', { name: 'Close dialog' })
    ).toBeInTheDocument();
  });

  it('calls the click handler when enabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call the click handler when disabled', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not submit a form by default when clicked', async () => {
    const handleSubmit = vi.fn();
    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      handleSubmit();
    };
    const user = userEvent.setup();

    render(
      <form onSubmit={onSubmit}>
        <Button>Save</Button>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits a form when type is submit', async () => {
    const handleSubmit = vi.fn();
    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      handleSubmit();
    };
    const user = userEvent.setup();

    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Submit</Button>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps the button accessible when icons are rendered', () => {
    render(
      <Button
        startIcon={<span aria-hidden="true">start</span>}
        endIcon={<span aria-hidden="true">end</span>}
      >
        Continue
      </Button>
    );

    expect(
      screen.getByRole('button', { name: 'Continue' })
    ).toBeInTheDocument();
  });
});

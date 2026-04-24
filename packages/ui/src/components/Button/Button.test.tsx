import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SubmitEventHandler } from 'react';
import { Button } from './Button';
import type { ButtonProps } from './types';

describe('Button', () => {
  const { setup } = prepareSetup<ButtonProps & { children: string }>({
    component: Button,
    props: {
      children: 'test label',
      onClick: vi.fn(),
      startIcon: <span aria-hidden="true">star</span>,
      endIcon: <span aria-hidden="true">end icon</span>,
    },
  });

  it('renders a button users can find by its accessible name', () => {
    setup({ children: 'Save' });

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('uses the aria-label as the accessible name when provided', () => {
    setup({ 'aria-label': 'Close dialog', children: '' });

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });

  it('calls the click handler when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    setup({ children: 'Click me', onClick });

    await user.click(screen.getByRole('button', { name: 'Click me' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call the click handler when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    setup({ children: 'Disabled', disabled: true, onClick });

    await user.click(screen.getByRole('button', { name: 'Disabled' }));

    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls the focus handler when the button receives focus', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();

    setup({ children: 'Focus me', onFocus });

    await user.tab();

    expect(screen.getByRole('button', { name: 'Focus me' })).toHaveFocus();
    expect(onFocus).toHaveBeenCalledTimes(1);
  });

  it('calls the blur handler when the button loses focus', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();

    render(
      <>
        <Button onBlur={onBlur}>Blur me</Button>
        <button type="button">Next focus target</button>
      </>
    );

    await user.tab();
    await user.tab();

    expect(screen.getByRole('button', { name: 'Next focus target' })).toHaveFocus();
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('calls the keydown handler when a key is pressed', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();

    setup({ children: 'Keyboard', onKeyDown });

    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: 'Keyboard' })).toHaveFocus();
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it('does not submit a form by default when clicked', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      handleSubmit();
    };

    render(
      <form onSubmit={onSubmit}>
        <Button>Save</Button>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits a form when type is submit', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    const onSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault();
      handleSubmit();
    };

    render(
      <form onSubmit={onSubmit}>
        <Button type="submit">Submit</Button>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps the button accessible when icons are rendered', () => {
    setup({
      children: 'Continue',
      startIcon: <span aria-hidden="true">start</span>,
      endIcon: <span aria-hidden="true">end</span>,
    });

    expect(
      screen.getByRole('button', { name: 'Continue' })
    ).toBeInTheDocument();
  });
});

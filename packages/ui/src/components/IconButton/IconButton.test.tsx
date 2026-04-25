import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefreshCw } from 'lucide-react';
import type { SubmitEventHandler } from 'react';
import { IconButton } from './IconButton';
import type { IconButtonProps } from './types';

describe('IconButton', () => {
  const { setup } = prepareSetup<IconButtonProps>({
    component: IconButton,
    props: {
      'aria-label': 'Refresh',
      children: <RefreshCw aria-hidden="true" />,
      onClick: vi.fn(),
    },
  });

  it('renders a button users can find by its accessible name', () => {
    const { 'aria-label': ariaLabel } = setup({ 'aria-label': 'Save' });

    expect(screen.getByRole('button', { name: ariaLabel })).toBeInTheDocument();
  });

  it('calls the click handler when enabled', async () => {
    const user = userEvent.setup();
    const { onClick, 'aria-label': ariaLabel } = setup({
      'aria-label': 'Save',
      onClick: vi.fn(),
    });

    await user.click(screen.getByRole('button', { name: ariaLabel }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call the click handler when disabled', async () => {
    const user = userEvent.setup();
    const { onClick, 'aria-label': ariaLabel } = setup({
      'aria-label': 'Save',
      onClick: vi.fn(),
      disabled: true,
    });

    await user.click(screen.getByRole('button', { name: ariaLabel }));

    expect(screen.getByRole('button', { name: ariaLabel })).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls the focus and blur handlers when focus changes', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    render(
      <>
        <IconButton aria-label="Refresh" onBlur={onBlur} onFocus={onFocus}>
          <RefreshCw aria-hidden="true" />
        </IconButton>
        <button type="button">Next focus target</button>
      </>
    );

    await user.tab();
    await user.tab();

    expect(screen.getByRole('button', { name: 'Next focus target' })).toHaveFocus();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
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
        <IconButton aria-label="Refresh">
          <RefreshCw aria-hidden="true" />
        </IconButton>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

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
        <IconButton aria-label="Refresh" type="submit">
          <RefreshCw aria-hidden="true" />
        </IconButton>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});

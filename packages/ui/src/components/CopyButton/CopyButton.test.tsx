import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyButton } from './CopyButton';
import type { CopyButtonProps } from './types';

describe('CopyButton', () => {
  const { setup } = prepareSetup<CopyButtonProps>({
    component: CopyButton,
    props: {
      copyLabel: 'Copy transfer number',
      value: 'TRF-COFFEE-002',
    },
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a button with its idle copy label by default', () => {
    const { copyLabel } = setup({
      copyLabel: 'Copy SKU',
    });

    expect(screen.getByRole('button', { name: copyLabel })).toBeInTheDocument();
  });

  it('copies the value to the clipboard and switches to the copied label', async () => {
    const user = userEvent.setup();
    const { copiedLabel, copyLabel, onCopy, value } = setup({
      copiedLabel: 'Copied transfer number',
      copyLabel: 'Copy transfer number',
      onCopy: vi.fn(),
      value: 'TRF-COFFEE-002',
    });

    await user.click(screen.getByRole('button', { name: copyLabel }));

    expect(await navigator.clipboard.readText()).toBe(value);
    expect(onCopy).toHaveBeenCalledWith(value);
    expect(
      screen.getByRole('button', { name: copiedLabel })
    ).toBeInTheDocument();
  });

  it('resets back to the copy label after the copied duration elapses', async () => {
    const user = userEvent.setup();
    const { copiedLabel, copyLabel } = setup({
      copiedDurationMs: 50,
      copiedLabel: 'Copied',
      copyLabel: 'Copy transfer number',
    });

    await user.click(screen.getByRole('button', { name: copyLabel }));

    expect(
      screen.getByRole('button', { name: copiedLabel })
    ).toBeInTheDocument();

    expect(
      await screen.findByRole('button', { name: copyLabel })
    ).toBeInTheDocument();
  });

  it('respects a copied default state', () => {
    const { copiedLabel } = setup({
      copiedLabel: 'Copied',
      defaultCopied: true,
    });

    expect(
      screen.getByRole('button', { name: copiedLabel })
    ).toBeInTheDocument();
  });

  it('calls onCopyError and stays in the idle state when clipboard write fails', async () => {
    const user = userEvent.setup();
    const clipboardError = new Error('Clipboard write denied');
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(
      clipboardError
    );

    const { copyLabel, onCopy, onCopyError } = setup({
      copyLabel: 'Copy transfer number',
      onCopy: vi.fn(),
      onCopyError: vi.fn(),
    });

    await user.click(screen.getByRole('button', { name: copyLabel }));

    expect(onCopyError).toHaveBeenCalledWith(clipboardError);
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: copyLabel })).toBeInTheDocument();
  });

  it('does not copy when disabled', async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
    const { copyLabel, onCopy } = setup({
      copyLabel: 'Copy transfer number',
      disabled: true,
      onCopy: vi.fn(),
    });

    const button = screen.getByRole('button', { name: copyLabel });
    await user.click(button);

    expect(button).toBeDisabled();
    expect(writeTextSpy).not.toHaveBeenCalled();
    expect(onCopy).not.toHaveBeenCalled();
  });
});

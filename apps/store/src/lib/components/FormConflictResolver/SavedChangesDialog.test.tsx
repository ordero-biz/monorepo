import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SavedChangesDialog } from './SavedChangesDialog';

const { setup } = prepareStoreSetup({
  component: SavedChangesDialog,
  props: {
    open: true,
    title: 'Record changed',
    description: 'New saved values are available. Your edits are preserved.',
    reviewAction: { label: 'Review new values', onClick: vi.fn() },
    onClose: vi.fn(),
  },
});

describe('SavedChangesDialog', () => {
  it('follows the controlled open state and describes the update accessibly', () => {
    const {
      title,
      description,
      renderResult: { rerender },
    } = setup({ open: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender({ open: true });
    expect(
      screen.getByRole('dialog', { name: title })
    ).toHaveAccessibleDescription(description);
    rerender({ open: false });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('lets the caller start a review without treating it as dismissal', async () => {
    const user = userEvent.setup();
    const { title, reviewAction, onClose } = setup({
      reviewAction: { label: 'Review new values', onClick: vi.fn() },
      onClose: vi.fn(),
    });
    await user.click(
      within(screen.getByRole('dialog', { name: title })).getByRole('button', {
        name: reviewAction.label,
      })
    );
    expect(reviewAction.onClick).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
  });

  it.each([
    'Keep editing',
    'Escape',
  ])('allows dismissal with %s without starting a review', async (action) => {
    const user = userEvent.setup();
    const { onClose, reviewAction } = setup({
      onClose: vi.fn(),
      reviewAction: { label: 'Review new values', onClick: vi.fn() },
    });
    if (action === 'Escape') {
      await user.keyboard('{Escape}');
    } else {
      await user.click(screen.getByRole('button', { name: action }));
    }
    expect(onClose).toHaveBeenCalledOnce();
    expect(reviewAction.onClick).not.toHaveBeenCalled();
  });

  it('shows a dismissible notice without a review action for read-only changes', async () => {
    const user = userEvent.setup();
    const { onClose } = setup({
      title: 'Record locked',
      description: 'Your edits are preserved but can no longer be saved.',
      reviewAction: undefined,
      onClose: vi.fn(),
    });
    const dialog = screen.getByRole('dialog', { name: 'Record locked' });
    expect(dialog).toHaveAccessibleDescription(
      'Your edits are preserved but can no longer be saved.'
    );
    expect(within(dialog).getAllByRole('button')).toHaveLength(1);
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

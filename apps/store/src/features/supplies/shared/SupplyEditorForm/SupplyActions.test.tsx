import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplyActions } from './SupplyActions';
import type { SupplyActionsProps } from './types';

const { setup } = prepareStoreSetup<SupplyActionsProps>({
  component: SupplyActions,
  props: {
    count: 1,
    selectedCount: 0,
    onClearSelection: vi.fn(),
    onDeleteSelected: vi.fn(),
    total: 560,
    pendingIntent: null,
    onSaveDraft: vi.fn(),
    onFinalize: vi.fn(),
  },
});

describe('SupplyActions', () => {
  it('shows bulk actions for selected entries and delegates clearing and deletion', async () => {
    const user = userEvent.setup();
    const { onClearSelection, onDeleteSelected } = setup({
      selectedCount: 2,
      onClearSelection: vi.fn(),
      onDeleteSelected: vi.fn(),
    });
    const actions = screen.getByRole('complementary', {
      name: 'Supply entry bulk actions',
    });

    expect(within(actions).getByText('2 selected')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'Save draft' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Finalize supply' })
    ).not.toBeInTheDocument();

    await user.click(
      within(actions).getByRole('button', { name: 'Clear selection' })
    );
    expect(onClearSelection).toHaveBeenCalledOnce();

    await user.click(within(actions).getByRole('button', { name: 'Delete' }));
    expect(onDeleteSelected).toHaveBeenCalledOnce();
  });

  it('saves a draft without confirmation', async () => {
    const user = userEvent.setup();
    const { onSaveDraft } = setup({ onSaveDraft: vi.fn() });

    await user.click(screen.getByRole('button', { name: 'Save draft' }));

    expect(onSaveDraft).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('only finalizes after confirmation and allows cancellation', async () => {
    const user = userEvent.setup();
    const { onFinalize } = setup({ onFinalize: vi.fn() });

    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    const dialog = screen.getByRole('dialog', { name: 'Finalize supply' });
    expect(onFinalize).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(onFinalize).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    await user.click(
      within(screen.getByRole('dialog', { name: 'Finalize supply' })).getByRole(
        'button',
        { name: 'Finalize supply' }
      )
    );
    expect(onFinalize).toHaveBeenCalledOnce();
  });

  it.each([
    ['draft', 'Saving...', 'Finalize supply'],
    ['finalize', 'Save draft', 'Finalizing...'],
  ] as const)('shows progress and disables actions while %s is pending', (pendingIntent, draftLabel, finalizeLabel) => {
    setup({ pendingIntent });

    expect(screen.getByRole('button', { name: draftLabel })).toBeDisabled();
    expect(screen.getByRole('button', { name: finalizeLabel })).toBeDisabled();
  });

  it('allows finalization attempts without complete entries', async () => {
    const user = userEvent.setup();
    const { onFinalize } = setup({ count: 0, total: 0, onFinalize: vi.fn() });

    expect(screen.getByRole('button', { name: 'Save draft' })).toBeEnabled();
    expect(
      screen.getByRole('button', { name: 'Finalize supply' })
    ).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Finalize supply' }));
    const confirm = within(
      screen.getByRole('dialog', { name: 'Finalize supply' })
    ).getByRole('button', { name: 'Finalize supply' });
    expect(confirm).toBeEnabled();
    await user.click(confirm);
    expect(onFinalize).toHaveBeenCalledOnce();
  });
});

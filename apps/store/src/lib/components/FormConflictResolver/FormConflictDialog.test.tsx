import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { FormConflictDialog } from './FormConflictDialog';
import type { FormConflictDialogProps } from './types';

const { setup } = prepareStoreSetup<FormConflictDialogProps<'name' | 'limit'>>({
  component: FormConflictDialog<'name' | 'limit'>,
  props: {
    revision: 1,
    updates: [],
    conflicts: [
      {
        field: 'name',
        label: 'Name',
        localValue: 'Local name',
        serverValue: 'Saved name',
      },
      { field: 'limit', label: 'Limit', localValue: '2', serverValue: '3' },
    ],
    onApply: vi.fn(),
    onClose: vi.fn(),
  },
});

describe('FormConflictDialog', () => {
  it('previews automatic updates and waits for explicit application', async () => {
    const user = userEvent.setup();
    const { onApply } = setup({
      conflicts: [],
      updates: [
        {
          field: 'name',
          label: 'Name',
          currentValue: 'Current name',
          mergedValue: 'Updated name',
        },
      ],
      onApply: vi.fn(),
    });
    const summary = within(
      screen.getByRole('region', { name: 'Updates to apply' })
    );
    expect(
      screen.getByRole('dialog', { name: 'Review updates' })
    ).toHaveAccessibleDescription(
      'Review the saved updates below. Your unsaved edits will be kept.'
    );
    expect(screen.queryByText(/choose which values/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Updates to apply' })
    ).not.toBeInTheDocument();
    expect(summary.getByText('Name')).toBeVisible();
    expect(summary.getByText('Current name')).toBeVisible();
    expect(summary.getByText('Updated name')).toBeVisible();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(onApply).not.toHaveBeenCalled();
    const apply = screen.getByRole('button', { name: 'Apply changes' });
    expect(apply).toHaveAccessibleDescription(
      'This action does not save your edits.'
    );
    await user.click(apply);
    await waitFor(() => expect(onApply).toHaveBeenCalledExactlyOnceWith({}));
  });

  it('allows cancelling automatic updates without applying them', async () => {
    const user = userEvent.setup();
    const { onClose, onApply } = setup({
      conflicts: [],
      updates: [
        { field: 'limit', label: 'Limit', currentValue: '2', mergedValue: '3' },
      ],
      onClose: vi.fn(),
      onApply: vi.fn(),
    });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onApply).not.toHaveBeenCalled();
  });

  it('explains when only the saved version needs updating', async () => {
    const user = userEvent.setup();
    const { onApply } = setup({ conflicts: [], onApply: vi.fn() });
    expect(
      screen.getByRole('dialog', { name: 'No updates to review' })
    ).toHaveAccessibleDescription(
      'There are no field updates to review. You can use the latest saved version while keeping your edits.'
    );
    expect(
      screen.queryByRole('button', { name: 'Apply changes' })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(onApply).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('button', { name: 'Use latest version' })
    );
    await waitFor(() => expect(onApply).toHaveBeenCalledExactlyOnceWith({}));
  });

  it('requires all decisions before returning choices for arbitrary form fields', async () => {
    const user = userEvent.setup();
    const { onApply } = setup({ onApply: vi.fn() });
    const apply = screen.getByRole('button', { name: 'Apply changes' });
    expect(
      screen.getByRole('dialog', { name: 'Review updates' })
    ).toHaveAccessibleDescription(
      'Some details changed both on your page and in the saved version. Choose which values to keep. Your other edits will be kept.'
    );
    const requiredMessage = 'Choose which value to keep.';
    expect(screen.queryByText(requiredMessage)).not.toBeInTheDocument();
    expect(apply).toBeEnabled();
    await user.click(apply);
    expect(await screen.findAllByText(requiredMessage)).toHaveLength(2);
    expect(
      screen.getByRole('radiogroup', { name: 'Name' })
    ).toHaveAccessibleDescription(requiredMessage);
    expect(
      screen.getByRole('radiogroup', { name: 'Limit' })
    ).toHaveAccessibleDescription(requiredMessage);
    expect(onApply).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('radio', { name: 'Keep my changes: Local name' })
    );
    expect(screen.getAllByText(requiredMessage)).toHaveLength(1);
    expect(
      screen.getByRole('radiogroup', { name: 'Name' })
    ).not.toHaveAccessibleDescription(requiredMessage);
    await user.click(apply);
    expect(
      screen.getByRole('radiogroup', { name: 'Limit' })
    ).toHaveAccessibleDescription(requiredMessage);
    expect(onApply).not.toHaveBeenCalled();
    await user.click(
      within(screen.getByRole('radiogroup', { name: 'Limit' })).getByRole(
        'radio',
        { name: 'Use saved value: 3' }
      )
    );
    expect(screen.queryByText(requiredMessage)).not.toBeInTheDocument();
    await user.tab();
    expect(apply).toHaveFocus();
    await user.keyboard('{Enter}');
    await waitFor(() =>
      expect(onApply).toHaveBeenCalledExactlyOnceWith({
        name: 'local',
        limit: 'server',
      })
    );
  });

  it('explains a mixed review and validates only the fields that need a choice', async () => {
    const user = userEvent.setup();
    const { onApply, updates, conflicts } = setup({
      updates: [
        {
          field: 'name',
          label: 'Name',
          currentValue: 'Original name',
          mergedValue: 'Saved name',
        },
      ],
      conflicts: [
        { field: 'limit', label: 'Limit', localValue: '2', serverValue: '3' },
      ],
      onApply: vi.fn(),
    });
    expect(
      screen.getByRole('dialog', { name: 'Review updates' })
    ).toHaveAccessibleDescription(
      'Review the saved updates below, then choose which values to keep where both versions changed.'
    );
    expect(
      within(
        screen.getByRole('region', { name: 'Updates to apply' })
      ).getByText(updates[0].mergedValue)
    ).toBeVisible();
    expect(screen.getAllByRole('radiogroup')).toHaveLength(1);
    expect(
      screen.getByRole('heading', { name: 'Updates to apply' })
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Choose which values to keep' })
    ).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      screen.getByRole('radiogroup', { name: conflicts[0].label })
    ).toHaveAccessibleDescription('Choose which value to keep.');
    expect(onApply).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('radio', {
        name: `Keep my changes: ${conflicts[0].localValue}`,
      })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    await waitFor(() =>
      expect(onApply).toHaveBeenCalledExactlyOnceWith({ limit: 'local' })
    );
  });

  it('clears choices and validation errors when a newer saved revision arrives', async () => {
    const user = userEvent.setup();
    const {
      renderResult: { rerender },
      conflicts,
      onApply,
    } = setup({ onApply: vi.fn() });
    await user.click(
      screen.getByRole('radio', { name: 'Keep my changes: Local name' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      await screen.findByText('Choose which value to keep.')
    ).toBeVisible();
    rerender({
      conflicts: conflicts.map((conflict) => ({
        ...conflict,
        serverValue: `New ${conflict.serverValue}`,
      })),
      revision: 2,
    });
    expect(
      screen.getByRole('radio', { name: 'Use saved value: New Saved name' })
    ).toBeVisible();
    expect(
      screen.getByRole('radio', { name: 'Keep my changes: Local name' })
    ).not.toBeChecked();
    expect(
      screen.getByRole('radio', { name: 'Use saved value: New 3' })
    ).not.toBeChecked();
    expect(
      screen.queryByText('Choose which value to keep.')
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(
      await screen.findAllByText('Choose which value to keep.')
    ).toHaveLength(2);
    expect(onApply).not.toHaveBeenCalled();
  });

  it('allows cancelling without applying selected values', async () => {
    const user = userEvent.setup();
    const { onClose, onApply } = setup({ onClose: vi.fn(), onApply: vi.fn() });
    await user.click(
      screen.getByRole('radio', { name: 'Keep my changes: Local name' })
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(onApply).not.toHaveBeenCalled();
  });
});

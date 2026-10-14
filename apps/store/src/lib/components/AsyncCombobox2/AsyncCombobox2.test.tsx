import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AsyncCombobox2 } from './AsyncCombobox2';
import type { AsyncCombobox2Props } from './types';

type Option = { id: number; name: string };
const selected: Option = { id: 1, name: 'Saved supplier' };
const loadOptions = vi.fn();
const queryKey = ['test', 'async-combobox2'];
const { setup } = prepareStoreSetup<AsyncCombobox2Props<Option>>({
  component: AsyncCombobox2<Option>,
  props: {
    label: 'Supplier',
    loadOptions,
    queryKey,
    getOptionValue: (option) => String(option.id),
    getOptionLabel: (option) => option.name,
  },
});

describe('AsyncCombobox2', () => {
  beforeEach(() => {
    loadOptions.mockReset();
  });

  it('shows the selection immediately and preserves it when loading fails', async () => {
    loadOptions.mockRejectedValue(new Error('offline'));
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    setup({ value: selected, onValueChange });
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    expect(input).toHaveValue('Saved supplier');
    expect(loadOptions).not.toHaveBeenCalled();
    await user.click(input);
    expect(
      await screen.findByText("We couldn't load options right now.")
    ).toBeVisible();
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('Saved supplier');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('updates display metadata on refetch without changing the form value', async () => {
    loadOptions.mockResolvedValue({
      options: [{ ...selected, name: 'Current supplier' }],
    });
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const { queryClient } = setup({ value: selected, onValueChange });
    await user.click(screen.getByRole('combobox', { name: 'Supplier' }));
    expect(
      await screen.findByRole('option', { name: 'Current supplier' })
    ).toHaveAttribute('aria-selected', 'true');
    loadOptions.mockResolvedValue({
      options: [{ ...selected, name: 'Renamed supplier' }],
    });
    await act(async () => {
      await queryClient.invalidateQueries({ queryKey });
    });
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveValue(
        'Renamed supplier'
      )
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('retains a selection outside the loaded pages and deduplicates paginated options', async () => {
    loadOptions
      .mockResolvedValueOnce({
        options: [{ id: 2, name: 'Other' }],
        nextPage: 2,
      })
      .mockResolvedValueOnce({
        options: [
          { id: 2, name: 'Other' },
          { id: 3, name: 'Third' },
        ],
      });
    const user = userEvent.setup();
    setup({ value: selected });
    await user.click(screen.getByRole('combobox', { name: 'Supplier' }));
    await screen.findByRole('option', { name: 'Other' });
    fireEvent.scroll(screen.getByRole('listbox'));
    await screen.findByRole('option', { name: 'Third' });
    expect(screen.getAllByRole('option')).toHaveLength(2);
    expect(loadOptions).toHaveBeenLastCalledWith({ page: 2, pageSize: 25 });
    await user.keyboard('{Escape}');
    expect(screen.getByRole('combobox', { name: 'Supplier' })).toHaveValue(
      'Saved supplier'
    );
  });

  it('shows the saved label during a pending request and does not restore an externally cleared value', async () => {
    let resolveOptions: (result: { options: Option[] }) => void = () => {};
    loadOptions.mockReturnValue(
      new Promise<{ options: Option[] }>((resolve) => {
        resolveOptions = resolve;
      })
    );
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const {
      renderResult: { rerender },
    } = setup({ value: selected, onValueChange });
    const input = screen.getByRole('combobox', { name: 'Supplier' });
    await user.click(input);
    expect(await screen.findByText('Loading...')).toBeVisible();
    expect(input).toHaveValue('Saved supplier');
    rerender({ value: null });
    await act(async () => {
      resolveOptions({ options: [selected] });
    });
    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps multiple selections while loading and returns the loaded record on selection', async () => {
    loadOptions.mockResolvedValue({ options: [{ id: 2, name: 'Other' }] });
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    setup({ multiple: true, defaultValue: [selected], onValueChange });
    expect(
      screen.getByRole('button', { name: 'Remove Saved supplier' })
    ).toBeVisible();
    await user.click(screen.getByRole('combobox', { name: 'Supplier' }));
    await user.click(await screen.findByRole('option', { name: 'Other' }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      [selected, { id: 2, name: 'Other' }],
      expect.any(Object)
    );
  });
});

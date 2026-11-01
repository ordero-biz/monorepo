import { prepareSetup } from '@ordero/test-config/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';
import type { ComboboxProps } from './types';

type Option = { id: number; name: string; revision?: number };
const first: Option = { id: 1, name: 'First' };
const second: Option = { id: 2, name: 'Second' };
const getOptionValue = (option: Option) => String(option.id);
const getOptionLabel = (option: Option) => option.name;
const { setup } = prepareSetup<ComboboxProps<Option>>({
  component: Combobox<Option>,
  props: {
    label: 'Choice',
    options: [first, second],
    getOptionValue,
    getOptionLabel,
  },
});

describe('Combobox', () => {
  it('preserves required, helper-text, and error-text accessibility', () => {
    const {
      renderResult: { rerender },
    } = setup({ required: true, helperText: 'Search by name' });
    const input = screen.getByRole('combobox', { name: 'Choice' });
    expect(input).toBeRequired();
    expect(input).toHaveAccessibleDescription('Search by name');
    rerender({ invalid: true, errorText: 'Selection required' });
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Selection required');
    expect(screen.queryByText('Search by name')).not.toBeInTheDocument();
  });

  it('renders loading, empty, loading-more, and list error states', async () => {
    const user = userEvent.setup();
    const {
      renderResult: { rerender },
    } = setup({
      options: [],
      loading: true,
      loadingText: 'Fetching records',
      emptyText: 'No matches',
    });
    await user.click(screen.getByRole('combobox', { name: 'Choice' }));
    expect(await screen.findByText('Fetching records')).toBeVisible();
    rerender({ loading: false });
    expect(await screen.findByText('No matches')).toBeVisible();
    rerender({ options: [first], loadingMore: true });
    expect(screen.getByRole('option', { name: 'First' })).toBeVisible();
    expect(screen.getByText('Fetching records')).toBeVisible();
    rerender({ loadingMore: false, listErrorText: 'Cannot load records' });
    expect(screen.getByText('Cannot load records')).toBeVisible();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  it('honors controlled open and input values while reporting user changes', async () => {
    const user = userEvent.setup();
    const {
      onOpenChange,
      onInputValueChange,
      renderResult: { rerender },
    } = setup({
      open: false,
      inputValue: '',
      onOpenChange: vi.fn(),
      onInputValueChange: vi.fn(),
    });
    const input = screen.getByRole('combobox', { name: 'Choice' });
    await user.click(input);
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.any(Object));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    rerender({ open: true, inputValue: 'Sec' });
    expect(input).toHaveValue('Sec');
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Second' })).toBeVisible()
    );
    expect(
      screen.queryByRole('option', { name: 'First' })
    ).not.toBeInTheDocument();
    await user.type(input, 'o');
    expect(onInputValueChange).toHaveBeenLastCalledWith(
      'Seco',
      expect.any(Object)
    );
    expect(input).toHaveValue('Sec');
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.any(Object));
  });

  it('forwards focus, blur, and keyboard events to the input', async () => {
    const user = userEvent.setup();
    const { onFocus, onBlur, onKeyDown } = setup({
      onFocus: vi.fn(),
      onBlur: vi.fn(),
      onKeyDown: vi.fn(),
    });
    await user.tab();
    expect(onFocus).toHaveBeenCalled();
    await user.keyboard('{ArrowDown}{Escape}{Tab}');
    expect(onKeyDown).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });

  it('displays a selected record before any options exist', () => {
    setup({ value: first, options: [] });
    expect(screen.getByRole('combobox', { name: 'Choice' })).toHaveValue(
      'First'
    );
  });

  it('refreshes the label by ID without changing the selection', () => {
    const onValueChange = vi.fn();
    const {
      renderResult: { rerender },
    } = setup({ value: first, options: [], onValueChange });
    rerender({ options: [{ id: 1, name: 'Renamed' }] });
    expect(screen.getByRole('combobox', { name: 'Choice' })).toHaveValue(
      'Renamed'
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    false,
    true,
  ])('renders rich selected chips with refreshed metadata (readOnly=%s)', (readOnly) => {
    const {
      onValueChange,
      renderResult: { rerender },
    } = setup({
      multiple: true,
      readOnly,
      value: [first],
      options: [],
      onValueChange: vi.fn(),
      renderOption: (option: Option) => (
        <span>
          {option.name}
          <span>Revision {option.revision ?? 1}</span>
        </span>
      ),
    });
    expect(screen.getByText('Revision 1')).toBeVisible();
    rerender({ options: [{ ...first, revision: 2 }] });
    expect(screen.getByText('Revision 2')).toBeVisible();
    expect(onValueChange).not.toHaveBeenCalled();
    if (!readOnly) {
      expect(
        screen.getByRole('button', { name: 'Remove First' })
      ).toBeVisible();
    }
  });

  it('uses rich list content but plain text for the single-selection input', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({
      onValueChange: vi.fn(),
      renderOption: (option: Option) => <span>{option.name} (Draft)</span>,
    });
    const input = screen.getByRole('combobox', { name: 'Choice' });
    await user.click(input);
    await user.click(screen.getByRole('option', { name: 'First (Draft)' }));
    expect(input).toHaveValue('First');
    expect(onValueChange).toHaveBeenCalledWith(first, expect.any(Object));
  });

  it('preserves an active search when loaded options refresh', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const {
      renderResult: { rerender },
    } = setup({ value: first, onValueChange });
    const input = screen.getByRole('combobox', { name: 'Choice' });
    await user.clear(input);
    await user.type(input, 'Sec');
    onValueChange.mockClear();
    rerender({ options: [{ id: 1, name: 'Renamed' }, { ...second }] });
    expect(input).toHaveValue('Sec');
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Second' })).toBeVisible()
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('matches recreated objects by ID and deduplicates loaded options', async () => {
    const user = userEvent.setup();
    setup({ value: { ...first }, options: [first, { ...first }] });
    await user.click(screen.getByRole('combobox', { name: 'Choice' }));
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: 'First' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  it('filters by the text label and returns the selected object', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({ onValueChange });
    await user.type(screen.getByRole('combobox', { name: 'Choice' }), 'Second');
    expect(
      screen.queryByRole('option', { name: 'First' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Second' }));
    expect(onValueChange).toHaveBeenCalledWith(second, expect.any(Object));
  });

  it('selects an object using the keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({ onValueChange });
    await user.click(screen.getByRole('combobox', { name: 'Choice' }));
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith(first, expect.any(Object));
  });

  it('clears a selection to null and accepts a controlled reset', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const {
      renderResult: { rerender },
    } = setup({ value: first, onValueChange });
    await user.clear(screen.getByRole('combobox', { name: 'Choice' }));
    expect(onValueChange).toHaveBeenCalledWith(null, expect.any(Object));
    rerender({ value: second });
    expect(screen.getByRole('combobox', { name: 'Choice' })).toHaveValue(
      'Second'
    );
    rerender({ value: null });
    expect(screen.getByRole('combobox', { name: 'Choice' })).toHaveValue('');
  });

  it('uses refreshed records for all selected items on an intentional multiple change', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const refreshed = { ...first, name: 'First updated', revision: 2 };
    setup({
      multiple: true,
      defaultValue: [first],
      options: [refreshed, second],
      onValueChange,
    });
    expect(
      screen.getByRole('button', { name: 'Remove First updated' })
    ).toBeVisible();
    await user.click(screen.getByRole('combobox', { name: 'Choice' }));
    await user.click(screen.getByRole('option', { name: 'Second' }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      [refreshed, second],
      expect.any(Object)
    );
    await user.keyboard('{Escape}');
    await user.click(
      screen.getByRole('button', { name: 'Remove First updated' })
    );
    expect(onValueChange).toHaveBeenLastCalledWith(
      [second],
      expect.any(Object)
    );
  });

  it('retains absent chips and toggles a recreated selected option without duplicates', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({
      multiple: true,
      defaultValue: [first, second],
      options: [{ ...second }],
      onValueChange,
    });
    expect(screen.getByRole('button', { name: 'Remove First' })).toBeVisible();
    await user.click(screen.getByRole('combobox', { name: 'Choice' }));
    await user.click(screen.getByRole('option', { name: 'Second' }));
    expect(onValueChange).toHaveBeenLastCalledWith([first], expect.any(Object));
  });

  it.each([
    { disabled: true },
    { readOnly: true },
  ])('prevents changes for %o', async (props) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({ ...props, multiple: true, defaultValue: [first], onValueChange });
    if ('readOnly' in props) {
      expect(
        screen.queryByRole('button', { name: 'Remove First' })
      ).not.toBeInTheDocument();
      expect(screen.getByText('First')).toBeVisible();
      expect(screen.getByRole('combobox', { name: 'Choice' })).toHaveAttribute(
        'readonly'
      );
    } else {
      await user.click(screen.getByRole('button', { name: 'Remove First' }));
    }
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps disabled options unselectable and error text accessible', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    setup({
      isOptionDisabled: (option) => option.id === 2,
      onValueChange,
      invalid: true,
      errorText: 'Choose an available record',
    });
    const input = screen.getByRole('combobox', { name: 'Choice' });
    expect(input).toHaveAccessibleDescription('Choose an available record');
    await user.click(input);
    await user.click(screen.getByRole('option', { name: 'Second' }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    false,
    true,
  ])('serializes IDs in a native form (multiple=%s)', (multiple) => {
    const props: ComboboxProps<Option> = multiple
      ? {
          multiple: true,
          defaultValue: [first, second],
          options: [],
          getOptionLabel,
          getOptionValue,
        }
      : { defaultValue: first, options: [], getOptionLabel, getOptionValue };
    render(
      <form aria-label="Selection">
        <Combobox<Option> {...props} name="choice" label="Choice" />
      </form>
    );
    const data = new FormData(
      screen.getByRole('form', { name: 'Selection' }) as HTMLFormElement
    );
    expect(data.getAll('choice')).toEqual(multiple ? ['1', '2'] : ['1']);
  });
});

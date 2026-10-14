import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox2 } from './Combobox2';
import type { Combobox2Props } from './types';

type Option = { id: number; name: string; revision?: number };
const first: Option = { id: 1, name: 'First' };
const second: Option = { id: 2, name: 'Second' };
const getOptionValue = (option: Option) => String(option.id);
const getOptionLabel = (option: Option) => option.name;
const { setup } = prepareSetup<Combobox2Props<Option>>({
  component: Combobox2<Option>,
  props: {
    label: 'Choice',
    options: [first, second],
    getOptionValue,
    getOptionLabel,
  },
});

describe('Combobox2', () => {
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
    expect(screen.getByRole('option', { name: 'Second' })).toBeVisible();
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
    const props: Combobox2Props<Option> = multiple
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
        <Combobox2<Option> {...props} name="choice" label="Choice" />
      </form>
    );
    const data = new FormData(
      screen.getByRole('form', { name: 'Selection' }) as HTMLFormElement
    );
    expect(data.getAll('choice')).toEqual(multiple ? ['1', '2'] : ['1']);
  });
});

import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Info } from 'lucide-react';
import { Combobox } from './Combobox';
import type { ComboboxProps } from './types';

const options = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
] satisfies ComboboxProps['options'];

describe('Combobox', () => {
  const { setup } = prepareSetup<ComboboxProps>({
    component: Combobox,
    props: {
      'aria-label': 'Language',
      onValueChange: vi.fn(),
      options,
      placeholder: 'Choose language',
    },
  });

  it('renders a searchable input with the selected value', () => {
    const { 'aria-label': ariaLabel } = setup({
      defaultValue: 'typescript',
    });

    expect(screen.getByRole('combobox', { name: ariaLabel })).toHaveValue(
      'TypeScript'
    );
  });

  it('marks required comboboxes as required', () => {
    const { 'aria-label': ariaLabel, required } = setup({
      required: true,
    });

    expect(screen.getByRole('combobox', { name: ariaLabel })).toHaveAttribute(
      'aria-required',
      String(required)
    );
  });

  it('opens the list and calls onValueChange when the user picks an option', async () => {
    const user = userEvent.setup();

    const { 'aria-label': ariaLabel, onValueChange } = setup({
      onValueChange: vi.fn(),
    });

    await user.click(screen.getByRole('combobox', { name: ariaLabel }));
    await user.click(screen.getByRole('option', { name: 'TypeScript' }));

    expect(onValueChange).toHaveBeenLastCalledWith(
      'typescript',
      expect.any(Object)
    );
  });

  it('supports selecting and removing multiple options', async () => {
    const user = userEvent.setup();

    const { 'aria-label': ariaLabel, onValueChange } = setup({
      'aria-label': 'Languages',
      defaultValue: ['javascript'],
      multiple: true,
      onValueChange: vi.fn(),
    });

    await user.click(screen.getByRole('combobox', { name: ariaLabel }));
    await user.click(screen.getByRole('option', { name: 'TypeScript' }));

    expect(onValueChange).toHaveBeenLastCalledWith(
      ['javascript', 'typescript'],
      expect.any(Object)
    );
    await user.keyboard('{Escape}');

    expect(
      screen.getByRole('button', { name: 'Remove JavaScript' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove JavaScript' }));

    expect(onValueChange).toHaveBeenLastCalledWith(
      ['typescript'],
      expect.any(Object)
    );
  });

  it('renders loading and empty states in the popup', async () => {
    const user = userEvent.setup();

    const { 'aria-label': ariaLabel } = setup({
      loading: true,
      loadingText: 'Loading languages',
      options: [],
    });

    await user.click(screen.getByRole('combobox', { name: ariaLabel }));

    expect(screen.getByText(/Loading languages/)).toBeInTheDocument();
  });

  it('renders helper and error text', () => {
    const { errorText } = setup({
      errorText: 'Selection is required',
      helperIcon: <Info aria-hidden="true" />,
      helperText: 'Start typing to search',
      invalid: true,
      label: 'Language',
    });

    expect(screen.getByText(errorText)).toBeInTheDocument();
  });
});

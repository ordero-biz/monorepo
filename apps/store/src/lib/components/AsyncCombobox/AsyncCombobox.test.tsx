import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AsyncCombobox } from './AsyncCombobox';
import type { AsyncComboboxProps } from './types';

const defaultProps = {
  'aria-label': 'Category',
  loadOptions: vi.fn(),
  placeholder: 'Select category',
  queryKey: ['test', 'async-combobox'],
} satisfies AsyncComboboxProps;

const { setup } = prepareStoreSetup<AsyncComboboxProps>({
  component: AsyncCombobox,
  props: defaultProps,
});

describe('AsyncCombobox', () => {
  beforeEach(() => {
    defaultProps.loadOptions.mockReset();
  });

  it('loads options after the combobox opens', async () => {
    const user = userEvent.setup();

    defaultProps.loadOptions.mockResolvedValue({
      options: [{ label: 'Shoes', value: '1' }],
    });

    setup();

    expect(defaultProps.loadOptions).not.toHaveBeenCalled();

    await user.click(screen.getByRole('combobox', { name: 'Category' }));

    expect(await screen.findByRole('option', { name: 'Shoes' })).toBeVisible();
    expect(defaultProps.loadOptions).toHaveBeenCalledWith({
      page: 0,
      pageSize: 25,
    });
  });
});

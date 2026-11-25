import { prepareSetup } from '@ordero/test-config/react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AttributeValue } from '@/lib/domain/attributes/types';
import { AttributeValuesCombobox } from './AttributeValuesCombobox';
import type { AttributeValuesComboboxProps } from './types';

const draft: AttributeValue = {
  id: 1,
  name: 'Light',
  status: 'DRAFT',
  sortOrder: 0,
  createdAt: '2026-11-01',
};
const active: AttributeValue = {
  ...draft,
  id: 2,
  name: 'Dark',
  status: 'ACTIVE',
};
const { setup } = prepareSetup<AttributeValuesComboboxProps>({
  component: AttributeValuesCombobox,
  props: { label: 'Roast', options: [draft, active], onValueChange: vi.fn() },
});

it('shows draft status and supports plain single-selection labels without product restrictions', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup();
  const input = screen.getByRole('combobox', { name: 'Roast' });
  await user.click(input);
  const option = screen.getByRole('option', { name: 'Light Draft' });
  expect(within(option).getByText('Draft')).toBeVisible();
  await user.click(option);
  expect(onValueChange).toHaveBeenCalledWith(draft, expect.any(Object));
  expect(input).toHaveValue('Light');
});

it('supports multiple selection and removal by stable value ID', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup({ multiple: true, defaultValue: [active] });
  await user.click(screen.getByRole('combobox', { name: 'Roast' }));
  await user.click(screen.getByRole('option', { name: 'Light Draft' }));
  expect(onValueChange).toHaveBeenLastCalledWith(
    [active, draft],
    expect.any(Object)
  );
  await user.keyboard('{Escape}');
  await user.click(screen.getByRole('button', { name: 'Remove Dark' }));
  expect(onValueChange).toHaveBeenLastCalledWith([draft], expect.any(Object));
});

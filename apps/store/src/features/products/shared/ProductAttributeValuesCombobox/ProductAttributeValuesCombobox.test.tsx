import { focusManager } from '@tanstack/react-query';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getAttribute,
  getAttributeValues,
  updateAttribute,
  updateAttributeValue,
} from '@/lib/client/api/attributes';
import type { Attribute, AttributeValue } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductAttributeValuesCombobox } from './ProductAttributeValuesCombobox';
import type { ProductAttributeValuesComboboxProps } from './types';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttribute: vi.fn(),
  getAttributeValues: vi.fn(),
  updateAttribute: vi.fn(),
  updateAttributeValue: vi.fn(),
}));
const attribute: Attribute = {
  id: 1,
  name: 'Roast',
  status: 'ACTIVE',
  sortOrder: 0,
  createdAt: '2026-11-01',
};
const draft: AttributeValue = {
  id: 11,
  name: 'Light',
  status: 'DRAFT',
  sortOrder: 0,
  createdAt: '2026-11-01',
};
const active: AttributeValue = {
  ...draft,
  id: 12,
  name: 'Dark',
  status: 'ACTIVE',
};
const { setup } = prepareStoreSetup<ProductAttributeValuesComboboxProps>({
  component: ProductAttributeValuesCombobox,
  props: {
    label: 'Roast',
    attribute,
    options: [draft, active],
    value: null,
    onValueChange: vi.fn(),
    onBlur: vi.fn(),
  },
});
const openReview = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('combobox', { name: 'Roast' }));
  await user.click(screen.getByRole('option', { name: 'Light Draft' }));
  return screen.findByRole('dialog', { name: 'Activate attribute value?' });
};
const confirmReview = async (user: ReturnType<typeof userEvent.setup>) => {
  const button = screen.getByRole('button', { name: 'Activate and select' });
  await waitFor(() => expect(button).toBeEnabled());
  await user.click(button);
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAttribute)
    .mockReset()
    .mockResolvedValue({ ok: true, data: attribute });
  vi.mocked(getAttributeValues)
    .mockReset()
    .mockResolvedValue({ ok: true, data: [draft, active] });
  vi.mocked(updateAttributeValue)
    .mockReset()
    .mockResolvedValue({ ok: true, data: { ...draft, status: 'ACTIVE' } });
});
afterEach(() => focusManager.setFocused(undefined));

it('selects an active value without loading review data', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup();
  await user.click(screen.getByRole('combobox', { name: 'Roast' }));
  await user.click(screen.getByRole('option', { name: 'Dark' }));
  expect(onValueChange).toHaveBeenCalledWith(active);
  expect(getAttributeValues).not.toHaveBeenCalled();
  expect(getAttribute).not.toHaveBeenCalled();
});

it.each([
  'mouse',
  'keyboard',
] as const)('reviews a draft through %s without triggering blur validation and restores focus on cancel', async (interaction) => {
  const user = userEvent.setup();
  const { onValueChange, onBlur } = setup();
  const input = screen.getByRole('combobox', { name: 'Roast' });
  await user.click(input);
  if (interaction === 'mouse') {
    await user.click(screen.getByRole('option', { name: 'Light Draft' }));
  } else {
    await user.keyboard('{ArrowDown}{Enter}');
  }
  const dialog = await screen.findByRole('dialog', {
    name: 'Activate attribute value?',
  });
  await waitFor(() =>
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled()
  );
  expect(onBlur).not.toHaveBeenCalled();
  expect(onValueChange).not.toHaveBeenCalled();
  await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
  await waitFor(() => expect(input).toHaveFocus());
  expect(onBlur).not.toHaveBeenCalled();
  await user.tab();
  expect(onBlur).toHaveBeenCalledTimes(1);
});

it('preserves the previous single selection on cancel', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup({ value: active });
  const dialog = await openReview(user);
  expect(
    within(dialog).getByText('You won’t be able to edit it afterward.')
  ).toBeVisible();
  expect(
    within(dialog).getByRole('link', { name: /View attribute details/ })
  ).toHaveAttribute('href', '/products/attributes/1');
  await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
  expect(screen.getByRole('combobox', { name: 'Roast' })).toHaveValue('Dark');
  expect(onValueChange).not.toHaveBeenCalled();
  expect(updateAttributeValue).not.toHaveBeenCalled();
});

it.each([
  false,
  true,
])('activates only the selected value after confirmation (multiple=%s)', async (multiple) => {
  const user = userEvent.setup();
  const { onValueChange } = setup(
    multiple ? { multiple: true, value: [active] } : { value: active }
  );
  await openReview(user);
  expect(onValueChange).not.toHaveBeenCalled();
  expect(updateAttributeValue).not.toHaveBeenCalled();
  await confirmReview(user);
  const selected = { ...draft, status: 'ACTIVE' };
  await waitFor(() =>
    expect(onValueChange).toHaveBeenCalledWith(
      multiple ? [active, selected] : selected
    )
  );
  expect(updateAttributeValue).toHaveBeenCalledExactlyOnceWith({
    attributeValueId: draft.id,
    status: 'ACTIVE',
  });
  expect(updateAttribute).not.toHaveBeenCalled();
});

it('removes an already selected draft without opening review', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup({ multiple: true, value: [active, draft] });
  await user.click(screen.getByRole('button', { name: 'Remove Light' }));
  expect(onValueChange).toHaveBeenCalledWith([active]);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(getAttributeValues).not.toHaveBeenCalled();
});

it('uses the confirmed cached status when reopening the selector with old form options', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup();
  await openReview(user);
  await confirmReview(user);
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await user.click(screen.getByRole('combobox', { name: 'Roast' }));
  await user.click(screen.getByRole('option', { name: 'Light' }));
  expect(onValueChange).toHaveBeenLastCalledWith({
    ...draft,
    status: 'ACTIVE',
  });
  expect(updateAttributeValue).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('blocks confirmation while loading and keeps the consequences visible', async () => {
  const user = userEvent.setup();
  let finish!: (result: Awaited<ReturnType<typeof getAttributeValues>>) => void;
  vi.mocked(getAttributeValues).mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  setup();
  const dialog = await openReview(user);
  expect(within(dialog).getByRole('status')).toHaveTextContent(
    'Loading value details'
  );
  expect(
    within(dialog).getByRole('button', { name: 'Activate and select' })
  ).toBeDisabled();
  expect(within(dialog).getByText(/Activation is permanent/)).toBeVisible();
  await act(async () => {
    finish({ ok: true, data: [draft, active] });
  });
  await waitFor(() =>
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled()
  );
});

it('requires an active parent and never silently activates it', async () => {
  const user = userEvent.setup();
  vi.mocked(getAttribute).mockResolvedValue({
    ok: true,
    data: { ...attribute, status: 'DRAFT' },
  });
  setup();
  const dialog = await openReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Activate the attribute before using this value.'
  );
  expect(
    within(dialog).getByRole('button', { name: 'Activate and select' })
  ).toBeDisabled();
  expect(updateAttribute).not.toHaveBeenCalled();
  expect(updateAttributeValue).not.toHaveBeenCalled();
});

it('blocks selection if the value has been removed', async () => {
  const user = userEvent.setup();
  vi.mocked(getAttributeValues).mockResolvedValue({ ok: true, data: [active] });
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'This value is no longer available'
  );
  expect(
    within(dialog).getByRole('button', { name: 'Activate and select' })
  ).toBeDisabled();
  expect(onValueChange).not.toHaveBeenCalled();
});

it.each([
  'parent',
  'values',
] as const)('offers retry if the %s request fails', async (request) => {
  const user = userEvent.setup();
  const failure = {
    ok: false as const,
    error: { status: 500, message: 'Could not load value details.' },
  };
  if (request === 'parent') {
    vi.mocked(getAttribute).mockResolvedValueOnce(failure);
  } else {
    vi.mocked(getAttributeValues).mockResolvedValueOnce(failure);
  }
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Could not load value details.'
  );
  expect(
    within(dialog).getByRole('button', { name: 'Activate and select' })
  ).toBeDisabled();
  await user.click(within(dialog).getByRole('button', { name: 'Try again' }));
  await waitFor(() =>
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled()
  );
  expect(onValueChange).not.toHaveBeenCalled();
});

it('retains the selection on activation failure and supports retry', async () => {
  const user = userEvent.setup();
  vi.mocked(updateAttributeValue).mockResolvedValueOnce({
    ok: false,
    error: { status: 403, message: 'Activation denied.' },
  });
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  await confirmReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Activation denied.'
  );
  expect(onValueChange).not.toHaveBeenCalled();
  await confirmReview(user);
  await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
});

it('blocks dismissal and duplicate confirmation while activation is pending', async () => {
  const user = userEvent.setup();
  let finish!: (
    result: Awaited<ReturnType<typeof updateAttributeValue>>
  ) => void;
  vi.mocked(updateAttributeValue).mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  await confirmReview(user);
  expect(
    within(dialog).getByRole('button', { name: 'Activating...' })
  ).toBeDisabled();
  expect(within(dialog).getByRole('button', { name: 'Cancel' })).toBeDisabled();
  await user.keyboard('{Escape}');
  expect(dialog).toBeVisible();
  expect(onValueChange).not.toHaveBeenCalled();
  await act(async () => {
    finish({ ok: true, data: { ...draft, status: 'ACTIVE' } });
  });
  await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
});

it('does not select an unconfirmed activation response', async () => {
  const user = userEvent.setup();
  vi.mocked(updateAttributeValue).mockResolvedValue({ ok: true, data: draft });
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  await confirmReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Activation could not be confirmed'
  );
  expect(onValueChange).not.toHaveBeenCalled();
});

it('refreshes external activation on window focus and selects only on confirmation', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  await waitFor(() =>
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled()
  );
  vi.mocked(getAttributeValues).mockResolvedValue({
    ok: true,
    data: [{ ...draft, status: 'ACTIVE' }, active],
  });
  act(() => focusManager.setFocused(false));
  await act(async () => focusManager.setFocused(true));
  const select = await within(dialog).findByRole('button', {
    name: 'Select value',
  });
  await waitFor(() => expect(select).toBeEnabled());
  expect(onValueChange).not.toHaveBeenCalled();
  await user.click(select);
  expect(onValueChange).toHaveBeenCalledWith({ ...draft, status: 'ACTIVE' });
  expect(updateAttributeValue).not.toHaveBeenCalled();
});

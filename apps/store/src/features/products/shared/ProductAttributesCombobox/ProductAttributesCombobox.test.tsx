import { focusManager } from '@tanstack/react-query';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getAttribute,
  getAttributesDropdown,
  getAttributeValues,
  updateAttribute,
} from '@/lib/client/api/attributes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductAttributesCombobox } from './ProductAttributesCombobox';
import type { ProductAttributesComboboxProps } from './types';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttribute: vi.fn(),
  getAttributesDropdown: vi.fn(),
  getAttributeValues: vi.fn(),
  updateAttribute: vi.fn(),
}));

const draft: AttributeDropdown = {
  id: 2,
  name: 'Roast',
  status: 'DRAFT',
  sortOrder: 0,
  createdAt: '2026-11-01',
  attributeValues: [
    {
      id: 21,
      name: 'Light',
      status: 'DRAFT',
      sortOrder: 0,
      createdAt: '2026-11-01',
    },
  ],
};
const active: AttributeDropdown = {
  ...draft,
  id: 3,
  name: 'Origin',
  status: 'ACTIVE',
};
const { attributeValues: values, ...draftDetails } = draft;
const { setup } = prepareStoreSetup<ProductAttributesComboboxProps>({
  component: ProductAttributesCombobox,
  props: {
    label: 'Attributes',
    value: null,
    onValueChange: vi.fn(),
    onBlur: vi.fn(),
  },
});

const openReview = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
  await user.click(await screen.findByRole('option', { name: 'Roast Draft' }));
  return screen.findByRole('dialog', { name: 'Activate attribute?' });
};
const confirmReview = async (user: ReturnType<typeof userEvent.setup>) => {
  const button = screen.getByRole('button', { name: 'Activate and select' });
  await waitFor(() => expect(button).toBeEnabled());
  await user.click(button);
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getAttributesDropdown)
    .mockReset()
    .mockResolvedValue({ ok: true, data: [draft, active] });
  vi.mocked(getAttribute)
    .mockReset()
    .mockResolvedValue({ ok: true, data: draftDetails });
  vi.mocked(getAttributeValues)
    .mockReset()
    .mockResolvedValue({ ok: true, data: values });
  vi.mocked(updateAttribute)
    .mockReset()
    .mockResolvedValue({
      ok: true,
      data: { ...draftDetails, status: 'ACTIVE' },
    });
});
afterEach(() => focusManager.setFocused(undefined));

it('selects active attributes directly, including their values', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup();
  await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
  await user.click(await screen.findByRole('option', { name: 'Origin' }));
  expect(onValueChange).toHaveBeenCalledWith(active);
  expect(getAttribute).not.toHaveBeenCalled();
  expect(updateAttribute).not.toHaveBeenCalled();
});

it.each([
  'mouse',
  'keyboard',
] as const)('opens review through %s without changing or blurring the field, then restores focus', async (interaction) => {
  const user = userEvent.setup();
  const { onValueChange, onBlur } = setup();
  const input = screen.getByRole('combobox', { name: 'Attributes' });
  await user.click(input);
  const option = await screen.findByRole('option', { name: 'Roast Draft' });
  if (interaction === 'mouse') {
    await user.click(option);
  } else {
    await user.keyboard('{ArrowDown}{Enter}');
  }
  const dialog = await screen.findByRole('dialog', {
    name: 'Activate attribute?',
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

it('keeps the previous selection on cancel and explains attribute-specific consequences', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup({ value: active });
  const dialog = await openReview(user);
  expect(
    within(dialog).getByText('You won’t be able to rename it afterward.')
  ).toBeVisible();
  expect(
    within(dialog).getByText(/You can still add and manage values/)
  ).toBeVisible();
  expect(
    within(dialog).getByRole('link', { name: /View attribute details/ })
  ).toHaveAttribute('href', '/products/attributes/2');
  await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
  expect(screen.getByRole('combobox', { name: 'Attributes' })).toHaveValue(
    'Origin'
  );
  expect(onValueChange).not.toHaveBeenCalled();
  expect(updateAttribute).not.toHaveBeenCalled();
});

it('activates only after confirmation and selects fresh details and values without changing value statuses', async () => {
  const user = userEvent.setup();
  const freshValues = [...values, { ...values[0], id: 22, name: 'Dark' }];
  vi.mocked(getAttributeValues).mockResolvedValue({
    ok: true,
    data: freshValues,
  });
  const { onValueChange } = setup();
  await openReview(user);
  expect(updateAttribute).not.toHaveBeenCalled();
  await confirmReview(user);
  await waitFor(() =>
    expect(onValueChange).toHaveBeenCalledWith({
      ...draft,
      status: 'ACTIVE',
      attributeValues: freshValues,
    })
  );
  expect(updateAttribute).toHaveBeenCalledWith({
    attributeId: 2,
    status: 'ACTIVE',
  });
  expect(getAttributeValues).toHaveBeenCalledWith(2);
});

it('preserves other selections while reviewing and adding a draft in multiple mode', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup({ multiple: true, value: [active] });
  await openReview(user);
  expect(onValueChange).not.toHaveBeenCalled();
  await confirmReview(user);
  await waitFor(() =>
    expect(onValueChange).toHaveBeenCalledWith([
      active,
      { ...draft, status: 'ACTIVE' },
    ])
  );
});

it('allows removing a selected draft without requesting activation', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup({ multiple: true, value: [active, draft] });
  await user.click(screen.getByRole('button', { name: 'Remove Roast' }));
  expect(onValueChange).toHaveBeenCalledWith([active]);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(getAttribute).not.toHaveBeenCalled();
});

it('keeps excluded attributes disabled', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup({ disabledAttributeIds: [draft.id] });
  await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
  const option = await screen.findByRole('option', { name: 'Roast Draft' });
  expect(option).toHaveAttribute('aria-disabled', 'true');
  await user.click(option);
  expect(onValueChange).not.toHaveBeenCalled();
  expect(getAttribute).not.toHaveBeenCalled();
});

it('disables confirmation until values have loaded and keeps the warning visible', async () => {
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
  expect(
    within(dialog).getByRole('button', { name: 'Activate and select' })
  ).toBeDisabled();
  expect(within(dialog).getByRole('status')).toHaveTextContent(
    'Loading attribute details'
  );
  expect(
    within(dialog).getByText('You won’t be able to rename it afterward.')
  ).toBeVisible();
  await act(async () => {
    finish({ ok: true, data: values });
  });
  await waitFor(() =>
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled()
  );
});

it.each([
  'details',
  'values',
] as const)('blocks selection after a failed %s request and offers retry', async (request) => {
  const user = userEvent.setup();
  const error = {
    ok: false as const,
    error: { status: 500, message: 'Could not load attribute.' },
  };
  if (request === 'details') {
    vi.mocked(getAttribute).mockResolvedValueOnce(error);
  } else {
    vi.mocked(getAttributeValues).mockResolvedValueOnce(error);
  }
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Could not load attribute.'
  );
  expect(
    within(dialog).getByRole('button', { name: 'Activate and select' })
  ).toBeDisabled();
  expect(onValueChange).not.toHaveBeenCalled();
  await user.click(within(dialog).getByRole('button', { name: 'Try again' }));
  await waitFor(() =>
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled()
  );
});

it('keeps the review open on activation failure and supports retry', async () => {
  const user = userEvent.setup();
  vi.mocked(updateAttribute).mockResolvedValueOnce({
    ok: false,
    error: { status: 403, message: 'Activation failed.' },
  });
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  await confirmReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Activation failed.'
  );
  expect(onValueChange).not.toHaveBeenCalled();
  await confirmReview(user);
  await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
});

it('blocks dismissal and duplicate activation while the request is pending', async () => {
  const user = userEvent.setup();
  let finish!: (result: Awaited<ReturnType<typeof updateAttribute>>) => void;
  vi.mocked(updateAttribute).mockImplementation(
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
    finish({ ok: true, data: { ...draftDetails, status: 'ACTIVE' } });
  });
  await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
  expect(updateAttribute).toHaveBeenCalledTimes(1);
});

it('does not select an attribute if activation is unconfirmed', async () => {
  const user = userEvent.setup();
  vi.mocked(updateAttribute).mockResolvedValue({
    ok: true,
    data: draftDetails,
  });
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  await confirmReview(user);
  expect(await within(dialog).findByRole('alert')).toHaveTextContent(
    'Activation could not be confirmed'
  );
  expect(onValueChange).not.toHaveBeenCalled();
});

it('refreshes on return from another tab and requires explicit selection of an externally activated attribute', async () => {
  const user = userEvent.setup();
  const { onValueChange } = setup();
  const dialog = await openReview(user);
  await waitFor(() =>
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled()
  );
  vi.mocked(getAttribute).mockResolvedValue({
    ok: true,
    data: { ...draftDetails, status: 'ACTIVE' },
  });
  act(() => focusManager.setFocused(false));
  await act(async () => focusManager.setFocused(true));
  const select = await within(dialog).findByRole('button', {
    name: 'Select attribute',
  });
  await waitFor(() => expect(select).toBeEnabled());
  expect(onValueChange).not.toHaveBeenCalled();
  await user.click(select);
  expect(onValueChange).toHaveBeenCalledWith({ ...draft, status: 'ACTIVE' });
  expect(updateAttribute).not.toHaveBeenCalled();
});

it('refreshes dropdown badges after activation', async () => {
  const user = userEvent.setup();
  setup();
  await openReview(user);
  vi.mocked(getAttributesDropdown).mockResolvedValue({
    ok: true,
    data: [{ ...draft, status: 'ACTIVE' }, active],
  });
  await confirmReview(user);
  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
  await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
  expect(await screen.findByRole('option', { name: 'Roast' })).toBeVisible();
});

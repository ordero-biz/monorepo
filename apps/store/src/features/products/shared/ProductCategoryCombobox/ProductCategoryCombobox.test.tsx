import { focusManager } from '@tanstack/react-query';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getCategories,
  getCategory,
  updateCategory,
} from '@/lib/client/api/categories';
import type { Category } from '@/lib/domain/categories/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ProductCategoryCombobox } from './ProductCategoryCombobox';
import type { ProductCategoryComboboxProps } from './types';

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  getCategories: vi.fn(),
  getCategory: vi.fn(),
  updateCategory: vi.fn(),
}));

const draft: Category = {
  id: 2,
  name: 'Black Tea',
  status: 'DRAFT',
  sortOrder: 0,
  createdAt: '2026-11-01',
  parentCategory: {
    id: 1,
    name: 'Tea',
    status: 'ACTIVE',
    createdAt: '2026-11-01',
  },
};
const active: Category = { ...draft, id: 3, name: 'Coffee', status: 'ACTIVE' };
const { setup } = prepareStoreSetup<ProductCategoryComboboxProps>({
  component: ProductCategoryCombobox,
  props: {
    label: 'Category',
    value: null,
    onValueChange: vi.fn(),
    onBlur: vi.fn(),
  },
});
const openReview = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('combobox', { name: 'Category' }));
  await user.click(await screen.findByRole('option', { name: /Black Tea/ }));
  return screen.findByRole('dialog', { name: 'Activate category?' });
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCategories)
    .mockReset()
    .mockResolvedValue({
      ok: true,
      data: {
        content: [draft, active],
        page: { number: 1, size: 100, totalPages: 1, totalElements: 2 },
      },
    });
  vi.mocked(getCategory)
    .mockReset()
    .mockResolvedValue({ ok: true, data: draft });
  vi.mocked(updateCategory)
    .mockReset()
    .mockResolvedValue({ ok: true, data: { ...draft, status: 'ACTIVE' } });
});

afterEach(() => focusManager.setFocused(undefined));

describe('Product category selection', () => {
  it('keeps the warning and actions visible while initially loading category details', async () => {
    const user = userEvent.setup();
    let finish!: (value: Awaited<ReturnType<typeof getCategory>>) => void;
    vi.mocked(getCategory).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const { onValueChange } = setup();
    const dialog = await openReview(user);
    await waitFor(() =>
      expect(
        within(dialog).getByRole('region', { name: 'Category details' })
      ).toHaveAttribute('aria-busy', 'true')
    );
    expect(within(dialog).getByRole('status')).toHaveTextContent(
      'Loading category details'
    );
    expect(
      within(dialog).queryByRole('list', { name: 'Category path' })
    ).not.toBeInTheDocument();
    expect(
      within(dialog).getByText(/You won’t be able to edit it afterward/)
    ).toBeVisible();
    expect(
      within(dialog).getByRole('button', { name: 'Cancel' })
    ).toBeEnabled();
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () => finish({ ok: true, data: draft }));
    await waitFor(() =>
      expect(
        within(dialog).getByRole('region', { name: 'Category details' })
      ).toHaveAttribute('aria-busy', 'false')
    );
    expect(
      within(dialog).getByRole('list', { name: 'Category path' })
    ).toHaveTextContent('Black Tea');
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeEnabled();
    expect(within(dialog).queryByRole('status')).not.toBeInTheDocument();
  });

  it.each([
    'mouse',
    'keyboard',
  ] as const)('suppresses review blur for %s selection and resumes normal blur after cancel', async (interaction) => {
    const user = userEvent.setup();
    const { onBlur, onValueChange } = setup();
    const input = screen.getByRole('combobox', { name: 'Category' });
    await user.click(input);
    const option = await screen.findByRole('option', { name: /Black Tea/ });
    if (interaction === 'mouse') await user.click(option);
    else await user.keyboard('{ArrowDown}{Enter}');
    const dialog = await screen.findByRole('dialog', {
      name: 'Activate category?',
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

  it('selects active categories directly', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();
    await user.click(screen.getByRole('combobox', { name: 'Category' }));
    await user.click(await screen.findByRole('option', { name: 'Coffee' }));
    expect(onValueChange).toHaveBeenCalledWith({
      id: 3,
      name: 'Coffee',
      status: 'ACTIVE',
    });
    expect(getCategory).not.toHaveBeenCalled();
    expect(updateCategory).not.toHaveBeenCalled();
  });

  it('explains drafts, reviews fresh details, and preserves the previous selection on cancel', async () => {
    const user = userEvent.setup();
    const { onValueChange, onBlur } = setup({ value: active });
    const dialog = await openReview(user);
    expect(await within(dialog).findByText('Tea')).toBeVisible();
    expect(
      within(dialog).getByText(/You won’t be able to edit it afterward/)
    ).toBeVisible();
    expect(
      within(dialog).getByText(/even if you cancel product creation/)
    ).toBeVisible();
    expect(
      within(dialog).getByRole('link', {
        name: /^View category details\s*\(opens in a new tab\)$/,
      })
    ).toHaveAttribute('href', '/products/categories/2');
    expect(getCategory).toHaveBeenCalledWith(2);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onBlur).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveValue(
      'Coffee'
    );
    await waitFor(() =>
      expect(screen.getByRole('combobox', { name: 'Category' })).toHaveFocus()
    );
    expect(updateCategory).not.toHaveBeenCalled();
  });

  it('activates only on confirmation and selects the returned category', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();
    const dialog = await openReview(user);
    const button = within(dialog).getByRole('button', {
      name: 'Activate and select',
    });
    await waitFor(() => expect(button).toBeEnabled());
    expect(updateCategory).not.toHaveBeenCalled();
    await user.click(button);
    await waitFor(() =>
      expect(onValueChange).toHaveBeenCalledWith({ ...draft, status: 'ACTIVE' })
    );
    expect(updateCategory).toHaveBeenCalledWith({
      categoryId: 2,
      status: 'ACTIVE',
    });
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
  });

  it('keeps the review open and selection unchanged when activation fails, then permits retry', async () => {
    const user = userEvent.setup();
    vi.mocked(updateCategory).mockResolvedValueOnce({
      ok: false,
      error: { status: 403, message: 'You cannot activate this category.' },
    });
    const { onValueChange } = setup();
    const dialog = await openReview(user);
    const button = within(dialog).getByRole('button', {
      name: 'Activate and select',
    });
    await waitFor(() => expect(button).toBeEnabled());
    await user.click(button);
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'You cannot activate this category.'
    );
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(button);
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
  });

  it('blocks confirmation after a failed details request and offers retry', async () => {
    const user = userEvent.setup();
    vi.mocked(getCategory).mockResolvedValueOnce({
      ok: false,
      error: { status: 404, message: 'Category not found.' },
    });
    const { onValueChange } = setup();
    const dialog = await openReview(user);
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Category not found.'
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

  it('offers selection without a write when the latest details are already active', async () => {
    const user = userEvent.setup();
    vi.mocked(getCategory).mockResolvedValue({
      ok: true,
      data: { ...draft, status: 'ACTIVE' },
    });
    const { onValueChange } = setup();
    await user.click(screen.getByRole('combobox', { name: 'Category' }));
    await user.click(await screen.findByRole('option', { name: /Black Tea/ }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Select category',
    });
    await user.click(
      within(dialog).getByRole('button', { name: 'Select category' })
    );
    expect(onValueChange).toHaveBeenCalledWith({ ...draft, status: 'ACTIVE' });
    expect(updateCategory).not.toHaveBeenCalled();
  });

  it('prevents duplicate confirmation and closing during activation', async () => {
    const user = userEvent.setup();
    let finish!: (value: Awaited<ReturnType<typeof updateCategory>>) => void;
    vi.mocked(updateCategory).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const { onValueChange } = setup();
    const dialog = await openReview(user);
    const button = within(dialog).getByRole('button', {
      name: 'Activate and select',
    });
    await waitFor(() => expect(button).toBeEnabled());
    await user.click(button);
    expect(
      within(dialog).getByRole('button', { name: 'Activating...' })
    ).toBeDisabled();
    expect(
      within(dialog).getByRole('button', { name: 'Cancel' })
    ).toBeDisabled();
    await user.keyboard('{Escape}');
    expect(dialog).toBeVisible();
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () =>
      finish({ ok: true, data: { ...draft, status: 'ACTIVE' } })
    );
    await waitFor(() => expect(onValueChange).toHaveBeenCalledTimes(1));
  });
  it('refreshes after activation elsewhere and selects only on explicit confirmation', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup();
    const dialog = await openReview(user);
    await waitFor(() =>
      expect(
        within(dialog).getByRole('button', { name: 'Activate and select' })
      ).toBeEnabled()
    );
    let finish!: (value: Awaited<ReturnType<typeof getCategory>>) => void;
    vi.mocked(getCategory).mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    act(() => focusManager.setFocused(false));
    await act(async () => focusManager.setFocused(true));
    await waitFor(() =>
      expect(
        within(dialog).getByRole('region', { name: 'Category details' })
      ).toHaveAttribute('aria-busy', 'true')
    );
    expect(
      within(dialog).getByRole('list', { name: 'Category path' })
    ).toHaveTextContent('Black Tea');
    expect(
      within(dialog).getByRole('button', { name: 'Activate and select' })
    ).toBeDisabled();
    await act(async () =>
      finish({ ok: true, data: { ...draft, status: 'ACTIVE' } })
    );
    const select = await within(dialog).findByRole('button', {
      name: 'Select category',
    });
    expect(onValueChange).not.toHaveBeenCalled();
    await user.click(select);
    expect(onValueChange).toHaveBeenCalledWith({ ...draft, status: 'ACTIVE' });
    expect(updateCategory).not.toHaveBeenCalled();
  });

  it('does not select a category if the activation response does not confirm active status', async () => {
    const user = userEvent.setup();
    vi.mocked(updateCategory).mockResolvedValue({ ok: true, data: draft });
    const { onValueChange } = setup();
    const dialog = await openReview(user);
    const button = within(dialog).getByRole('button', {
      name: 'Activate and select',
    });
    await waitFor(() => expect(button).toBeEnabled());
    await user.click(button);
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'Activation could not be confirmed'
    );
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('refreshes cached dropdown options after activating a category', async () => {
    const user = userEvent.setup();
    setup();
    const dialog = await openReview(user);
    const button = within(dialog).getByRole('button', {
      name: 'Activate and select',
    });
    await waitFor(() => expect(button).toBeEnabled());
    vi.mocked(getCategories).mockResolvedValue({
      ok: true,
      data: {
        content: [{ ...draft, status: 'ACTIVE' }, active],
        page: { number: 1, size: 100, totalPages: 1, totalElements: 2 },
      },
    });
    await user.click(button);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
    await user.click(screen.getByRole('combobox', { name: 'Category' }));
    expect(
      await screen.findByRole('option', { name: 'Black Tea' })
    ).toBeVisible();
  });
});

import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import type { EditProductVariantAttributesDialogProps } from './types';

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributesDropdown: vi.fn(),
}));

const colorAttribute: AttributeDropdown = {
  id: 1,
  name: 'Color',
  sortOrder: 0,
  status: 'DRAFT',
  createdAt: '2026-09-04T12:00:00.000Z',
  attributeValues: [
    {
      id: 11,
      name: 'Blue',
      sortOrder: 0,
      status: 'DRAFT',
      createdAt: '2026-09-04T12:00:00.000Z',
    },
    {
      id: 12,
      name: 'Red',
      sortOrder: 1,
      status: 'DRAFT',
      createdAt: '2026-09-04T12:00:00.000Z',
    },
  ],
};

const materialAttribute: AttributeDropdown = {
  id: 2,
  name: 'Material',
  sortOrder: 1,
  status: 'DRAFT',
  createdAt: '2026-09-04T12:00:00.000Z',
  attributeValues: [
    {
      id: 21,
      name: 'Cotton',
      sortOrder: 0,
      status: 'DRAFT',
      createdAt: '2026-09-04T12:00:00.000Z',
    },
  ],
};

const { setup } = prepareStoreSetup<EditProductVariantAttributesDialogProps>({
  component: EditProductVariantAttributesDialog,
  props: {
    allowMultipleValuesPerAttribute: true,
    attributeValueIds: [11],
    attributes: [colorAttribute, materialAttribute],
    onOpenChange: vi.fn(),
    onUpdate: vi.fn(),
    open: true,
    productVariantName: 'Running Shoes Blue',
  },
});

const getDialog = () =>
  screen.getByRole('dialog', {
    name: 'Edit attributes',
  });

describe('EditProductVariantAttributesDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAttributesDropdown).mockResolvedValue({
      ok: true,
      data: [colorAttribute, materialAttribute],
    });
  });

  it('adds and removes values for the same attribute without applying until confirmed', async () => {
    const user = userEvent.setup();
    const { onOpenChange, onUpdate } = setup();
    const dialog = getDialog();

    expect(within(dialog).getByText('Running Shoes Blue')).toBeVisible();
    expect(
      within(dialog).getByRole('button', { name: 'Remove Blue' })
    ).toBeVisible();
    await user.click(within(dialog).getByRole('combobox', { name: 'Color' }));
    await user.click(screen.getByRole('option', { name: 'Red' }));
    await user.keyboard('{Escape}');
    expect(
      within(dialog).getByRole('button', { name: 'Remove Blue' })
    ).toBeVisible();
    expect(
      within(dialog).getByRole('button', { name: 'Remove Red' })
    ).toBeVisible();
    await user.click(
      within(dialog).getByRole('button', { name: 'Remove Blue' })
    );
    expect(onUpdate).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole('button', { name: 'Apply changes' })
    );

    expect(onUpdate).toHaveBeenCalledWith({
      attributeValueIds: [12],
      attributes: [colorAttribute, materialAttribute],
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('replaces a value only within its attribute when multiple values are not allowed', async () => {
    const user = userEvent.setup();
    const { onUpdate } = setup({
      allowMultipleValuesPerAttribute: false,
      attributeValueIds: [11, 21],
    });
    const dialog = getDialog();
    expect(within(dialog).getByRole('combobox', { name: 'Color' })).toHaveValue(
      'Blue'
    );
    await user.click(within(dialog).getByRole('combobox', { name: 'Color' }));
    await user.click(screen.getByRole('option', { name: 'Red' }));
    expect(within(dialog).getByRole('combobox', { name: 'Color' })).toHaveValue(
      'Red'
    );
    expect(
      within(dialog).getByRole('combobox', { name: 'Material' })
    ).toHaveValue('Cotton');
    await user.click(
      within(dialog).getByRole('button', { name: 'Apply changes' })
    );

    expect(onUpdate).toHaveBeenCalledWith({
      attributeValueIds: [21, 12],
      attributes: [colorAttribute, materialAttribute],
    });
  });

  it('clears a single selection without removing other attribute values', async () => {
    const user = userEvent.setup();
    const { onUpdate } = setup({
      allowMultipleValuesPerAttribute: false,
      attributeValueIds: [11, 21],
    });
    const dialog = getDialog();
    await user.click(
      within(dialog).getByRole('button', { name: 'Clear Color' })
    );
    expect(within(dialog).getByRole('combobox', { name: 'Color' })).toHaveValue(
      ''
    );
    expect(
      within(dialog).getByRole('combobox', { name: 'Material' })
    ).toHaveValue('Cotton');
    await user.click(
      within(dialog).getByRole('button', { name: 'Apply changes' })
    );
    expect(onUpdate).toHaveBeenCalledWith({
      attributeValueIds: [21],
      attributes: [colorAttribute, materialAttribute],
    });
  });

  it('searches values and supports keyboard selection inside the dialog', async () => {
    const user = userEvent.setup();
    const { onUpdate } = setup({ allowMultipleValuesPerAttribute: false });
    const dialog = getDialog();
    const color = within(dialog).getByRole('combobox', { name: 'Color' });
    await user.clear(color);
    await user.type(color, 'Re');
    expect(screen.getByRole('option', { name: 'Red' })).toBeVisible();
    expect(
      screen.queryByRole('option', { name: 'Blue' })
    ).not.toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(color).toHaveValue('Red');
    expect(dialog).toBeVisible();
    expect(onUpdate).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole('button', { name: 'Apply changes' })
    );
    expect(onUpdate).toHaveBeenCalledWith({
      attributeValueIds: [12],
      attributes: [colorAttribute, materialAttribute],
    });
  });

  it('allows clearing the last value without adding per-attribute requirements', async () => {
    const user = userEvent.setup();
    const { onUpdate } = setup({ allowMultipleValuesPerAttribute: false });
    const dialog = getDialog();
    await user.click(
      within(dialog).getByRole('button', { name: 'Clear Color' })
    );
    await user.click(
      within(dialog).getByRole('button', { name: 'Apply changes' })
    );
    expect(onUpdate).toHaveBeenCalledWith({
      attributeValueIds: [],
      attributes: [colorAttribute, materialAttribute],
    });
  });

  it('discards draft changes when cancelled and restores the supplied values when reopened', async () => {
    const user = userEvent.setup();
    const { onOpenChange, onUpdate, renderResult } = setup();
    const dialog = getDialog();

    await user.click(within(dialog).getByRole('combobox', { name: 'Color' }));
    await user.click(screen.getByRole('option', { name: 'Red' }));
    await user.keyboard('{Escape}');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(onUpdate).not.toHaveBeenCalled();

    await act(async () => {
      renderResult.rerender({ open: false });
    });
    await act(async () => {
      renderResult.rerender({ open: true });
    });

    const reopenedDialog = getDialog();
    expect(
      within(reopenedDialog).getByRole('button', { name: 'Remove Blue' })
    ).toBeVisible();
    expect(
      within(reopenedDialog).queryByRole('button', { name: 'Remove Red' })
    ).not.toBeInTheDocument();
  });

  it('adds an attribute to an empty variant and keeps it local until Apply', async () => {
    const user = userEvent.setup();
    const { onUpdate } = setup({ attributes: [], attributeValueIds: [] });
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    await user.click(
      await screen.findByRole('option', { name: /^Material\b/ })
    );
    const values = screen.getByRole('combobox', { name: 'Material' });
    expect(values).toHaveFocus();
    await user.click(values);
    await user.click(screen.getByRole('option', { name: 'Cotton' }));
    await user.keyboard('{Escape}');
    expect(onUpdate).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(onUpdate).toHaveBeenCalledWith({
      attributeValueIds: [21],
      attributes: [materialAttribute],
    });
  });

  it('removes an attribute and its values, and permits adding it again without restoring removed values', async () => {
    const user = userEvent.setup();
    const { onUpdate } = setup({ attributeValueIds: [11, 21] });
    await user.click(
      screen.getByRole('button', { name: 'Remove Color attribute' })
    );
    expect(
      screen.queryByRole('combobox', { name: 'Color' })
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    expect(
      await screen.findByRole('option', { name: /^Material\b/ })
    ).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('option', { name: /^Color\b/ }));
    expect(
      screen.queryByRole('button', { name: 'Remove Blue' })
    ).not.toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Remove Color attribute' })
    );
    await user.click(screen.getByRole('button', { name: 'Apply changes' }));
    expect(onUpdate).toHaveBeenCalledWith({
      attributeValueIds: [21],
      attributes: [materialAttribute],
    });
  });

  it('discards added and removed attributes when cancelled', async () => {
    const user = userEvent.setup();
    const { onUpdate, renderResult } = setup({ attributes: [colorAttribute] });
    await user.click(
      screen.getByRole('button', { name: 'Remove Color attribute' })
    );
    await user.click(screen.getByRole('button', { name: 'Add attribute' }));
    await user.click(
      await screen.findByRole('option', { name: /^Material\b/ })
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onUpdate).not.toHaveBeenCalled();
    await act(async () => {
      renderResult.rerender({ open: false });
    });
    await act(async () => {
      renderResult.rerender({ open: true });
    });
    expect(screen.getByRole('combobox', { name: 'Color' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Remove Blue' })).toBeVisible();
    expect(
      screen.queryByRole('combobox', { name: 'Material' })
    ).not.toBeInTheDocument();
  });
});

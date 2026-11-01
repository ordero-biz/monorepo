import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { EditProductVariantAttributesDialog } from './EditProductVariantAttributesDialog';
import type { EditProductVariantAttributesDialogProps } from './types';

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
    name: 'Edit variant attributes for Running Shoes Blue',
  });

describe('EditProductVariantAttributesDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds and removes values for the same attribute when multiple values are allowed', async () => {
    const user = userEvent.setup();
    const { onOpenChange, onUpdate } = setup();
    const dialog = getDialog();

    expect(
      within(dialog).getByRole('button', { name: 'Blue', pressed: true })
    ).toBeVisible();

    await user.click(within(dialog).getByRole('button', { name: 'Red' }));

    expect(
      within(dialog).getByRole('button', { name: 'Blue', pressed: true })
    ).toBeVisible();
    expect(
      within(dialog).getByRole('button', { name: 'Red', pressed: true })
    ).toBeVisible();

    await user.click(
      within(dialog).getByRole('button', { name: 'Blue', pressed: true })
    );
    await user.click(within(dialog).getByRole('button', { name: 'Update' }));

    expect(onUpdate).toHaveBeenCalledWith([12]);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('replaces a value only within its attribute when multiple values are not allowed', async () => {
    const user = userEvent.setup();
    const { onUpdate } = setup({
      allowMultipleValuesPerAttribute: false,
      attributeValueIds: [11, 21],
    });
    const dialog = getDialog();

    await user.click(within(dialog).getByRole('button', { name: 'Red' }));
    await user.click(within(dialog).getByRole('button', { name: 'Update' }));

    expect(onUpdate).toHaveBeenCalledWith([21, 12]);
  });

  it('discards draft changes when cancelled and restores the supplied values when reopened', async () => {
    const user = userEvent.setup();
    const { onOpenChange, onUpdate, renderResult } = setup();
    const dialog = getDialog();

    await user.click(within(dialog).getByRole('button', { name: 'Red' }));
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
      within(reopenedDialog).getByRole('button', {
        name: 'Blue',
        pressed: true,
      })
    ).toBeVisible();
    expect(
      within(reopenedDialog).getByRole('button', {
        name: 'Red',
        pressed: false,
      })
    ).toBeVisible();
  });

  it('shows an empty state when no attributes are available', async () => {
    setup({ attributes: [] });

    expect(await screen.findByText('No attributes available')).toBeVisible();
  });
});

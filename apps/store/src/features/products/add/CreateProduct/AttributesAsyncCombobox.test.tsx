import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getAttributesDropdown } from '@/lib/client/api/attributes';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';
import { attributesQueryKeys } from '@/lib/query/attributes/attributesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributesAsyncCombobox } from './AttributesAsyncCombobox';
import type { AttributesAsyncComboboxProps } from './types';

const mocks = vi.hoisted(() => ({
  getAttributesDropdown: vi.fn(),
  onValueChange: vi.fn(),
}));

vi.mock('@/lib/client/api/attributes', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/attributes')>(
    '@/lib/client/api/attributes'
  )),
  getAttributesDropdown: mocks.getAttributesDropdown,
}));

const getAttributesDropdownMock = vi.mocked(getAttributesDropdown);

const { setup } = prepareStoreSetup<AttributesAsyncComboboxProps>({
  component: AttributesAsyncCombobox,
  props: {
    'aria-label': 'Attributes',
    multiple: true,
    onValueChange: mocks.onValueChange,
    placeholder: 'Select attributes',
  },
});

describe('AttributesAsyncCombobox', () => {
  beforeEach(() => {
    getAttributesDropdownMock.mockReset();
    mocks.onValueChange.mockReset();
  });

  const color: AttributeDropdown = {
    id: 1,
    name: 'Color',
    sortOrder: 10,
    status: 'DRAFT',
    createdAt: '2026-07-14T17:54:42.035Z',
    attributeValues: [
      {
        id: 3,
        name: 'Blue',
        sortOrder: 0,
        status: 'DRAFT',
        createdAt: '2026-07-14T17:54:42.036Z',
      },
    ],
  };
  const material: AttributeDropdown = {
    ...color,
    id: 2,
    name: 'Material',
    attributeValues: [{ ...color.attributeValues[0], id: 4, name: 'Cotton' }],
  };
  const mockSuccessfulAttributes = () => {
    getAttributesDropdownMock.mockResolvedValue({
      ok: true,
      data: [color, material],
    });
  };

  it('emits selected objects with their nested attribute values', async () => {
    const user = userEvent.setup();
    mockSuccessfulAttributes();
    setup();
    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
    await user.click(await screen.findByRole('option', { name: 'Color' }));
    await user.click(screen.getByRole('option', { name: 'Material' }));
    expect(getAttributesDropdownMock).toHaveBeenCalledWith();
    expect(mocks.onValueChange).toHaveBeenLastCalledWith(
      [color, material],
      expect.any(Object)
    );
    await user.click(screen.getByRole('button', { name: 'Remove Color' }));
    expect(mocks.onValueChange).toHaveBeenLastCalledWith(
      [material],
      expect.any(Object)
    );
  });

  it('displays controlled initial selections before loading and clears them on reset', () => {
    const {
      renderResult: { rerender },
    } = setup({ value: [color, material] });
    expect(screen.getByRole('button', { name: 'Remove Color' })).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Remove Material' })
    ).toBeVisible();
    expect(getAttributesDropdownMock).not.toHaveBeenCalled();
    rerender({ value: [] });
    expect(
      screen.queryByRole('button', { name: 'Remove Color' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Remove Material' })
    ).not.toBeInTheDocument();
    expect(mocks.onValueChange).not.toHaveBeenCalled();
  });

  it('preserves default selections absent from the loaded list when adding an attribute', async () => {
    const user = userEvent.setup();
    getAttributesDropdownMock.mockResolvedValue({ ok: true, data: [material] });
    setup({ defaultValue: [color] });
    expect(screen.getByRole('button', { name: 'Remove Color' })).toBeVisible();
    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
    await user.click(await screen.findByRole('option', { name: 'Material' }));
    expect(mocks.onValueChange).toHaveBeenLastCalledWith(
      [color, material],
      expect.any(Object)
    );
  });

  it('matches refreshed objects by ID and emits fresh nested values only on a user selection', async () => {
    const user = userEvent.setup();
    mockSuccessfulAttributes();
    const { queryClient } = setup({ value: [{ ...color }] });
    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
    expect(
      await screen.findByRole('option', { name: 'Color' })
    ).toHaveAttribute('aria-selected', 'true');
    const refreshedColor = {
      ...color,
      name: 'Colour',
      attributeValues: [{ ...color.attributeValues[0], name: 'Navy' }],
    };
    getAttributesDropdownMock.mockResolvedValue({
      ok: true,
      data: [refreshedColor, material],
    });
    await act(async () => {
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
    });
    await user.keyboard('{Escape}');
    expect(
      await screen.findByRole('button', { name: 'Remove Colour' })
    ).toBeVisible();
    expect(mocks.onValueChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));
    await user.click(screen.getByRole('option', { name: 'Material' }));
    expect(mocks.onValueChange).toHaveBeenLastCalledWith(
      [refreshedColor, material],
      expect.any(Object)
    );
  });

  it('refetches when attribute list queries are invalidated', async () => {
    const user = userEvent.setup();

    mockSuccessfulAttributes();
    const { queryClient } = setup();

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));

    await waitFor(() =>
      expect(getAttributesDropdownMock).toHaveBeenCalledTimes(1)
    );

    await act(async () => {
      await queryClient.invalidateQueries({
        queryKey: attributesQueryKeys.list,
      });
    });

    await waitFor(() =>
      expect(getAttributesDropdownMock).toHaveBeenCalledTimes(2)
    );
  });

  it('shows an empty state when no attributes are available', async () => {
    getAttributesDropdownMock.mockResolvedValue({
      ok: true,
      data: [],
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));

    expect(await screen.findByText('No attributes found')).toBeVisible();
  });

  it('shows a load error when attributes cannot be retrieved', async () => {
    getAttributesDropdownMock.mockResolvedValue({
      ok: false,
      error: {
        status: 500,
        message: 'Could not load attributes.',
      },
    });
    const user = userEvent.setup();

    setup({ value: [color] });

    await user.click(screen.getByRole('combobox', { name: 'Attributes' }));

    expect(
      await screen.findByText("We couldn't load attributes right now.")
    ).toBeVisible();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Remove Color' })).toBeVisible();
    expect(mocks.onValueChange).not.toHaveBeenCalled();
  });
});

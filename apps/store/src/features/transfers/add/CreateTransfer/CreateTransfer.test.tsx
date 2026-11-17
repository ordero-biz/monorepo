import { focusManager } from '@tanstack/react-query';
import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getWarehouse,
  getWarehouses,
  updateWarehouse,
} from '@/lib/client/api/warehouses';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { warehousesQueryKeys } from '@/lib/query/warehouses/warehousesQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CreateTransfer } from './CreateTransfer';
import type { CreateTransferProps } from './types';

const mocks = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

vi.mock('@/lib/client/api/warehouses', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/warehouses')>(
    '@/lib/client/api/warehouses'
  )),
  getWarehouse: vi.fn(),
  getWarehouses: vi.fn(),
  updateWarehouse: vi.fn(),
}));

const getWarehouseMock = vi.mocked(getWarehouse);
const getWarehousesMock = vi.mocked(getWarehouses);
const updateWarehouseMock = vi.mocked(updateWarehouse);

const warehouse = {
  id: 1,
  name: 'Main Warehouse',
  address: '14 Holovna St',
  comment: '',
  phone: null,
  status: WAREHOUSE_STATUS.ACTIVE,
  totalItemQuantity: 0,
  totalPrice: 0,
};

const draftWarehouse = {
  ...warehouse,
  id: 2,
  name: 'Unfinished Warehouse',
  status: WAREHOUSE_STATUS.DRAFT,
};

const { setup } = prepareStoreSetup<CreateTransferProps>({
  component: CreateTransfer,
});

describe('CreateTransfer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    updateWarehouseMock.mockReset();
    getWarehouseMock.mockImplementation(async (warehouseId) => ({
      ok: true,
      data: warehouseId === draftWarehouse.id ? draftWarehouse : warehouse,
    }));
    getWarehousesMock.mockResolvedValue({
      ok: true,
      data: {
        content: [warehouse, draftWarehouse],
        page: { number: 0, size: 100, totalElements: 2, totalPages: 1 },
      },
    });
  });

  it('shows the loading card before opening the form with the source warehouse selected', async () => {
    setup({ sourceWarehouseId: 1 });

    expect(screen.getByText('Loading warehouse...')).toBeVisible();
    expect(
      screen.queryByRole('navigation', { name: 'Breadcrumb' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('form', { name: 'Transfer' })
    ).not.toBeInTheDocument();

    expect(
      await screen.findByRole('combobox', { name: /From warehouse/ })
    ).toHaveValue('Main Warehouse');
    expect(screen.getByRole('combobox', { name: /To warehouse/ })).toHaveValue(
      ''
    );
    expect(
      within(screen.getByRole('navigation', { name: 'Breadcrumb' })).getByRole(
        'link',
        { name: 'Main Warehouse' }
      )
    ).toHaveAttribute('href', '/warehouse/1');
  });

  it('prompts the user to choose a source warehouse after a failed lookup', async () => {
    const user = userEvent.setup();
    getWarehouseMock.mockResolvedValueOnce({
      ok: false,
      error: { status: 404, message: 'Warehouse not found' },
    });
    setup({ sourceWarehouseId: 42 });

    expect(await screen.findByText('Choose a source warehouse')).toBeVisible();
    expect(screen.getByText('Create transfer')).toBeVisible();
    expect(
      screen.getByRole('navigation', { name: 'Breadcrumb' })
    ).toBeVisible();

    const form = screen.getByRole('form', { name: 'Transfer' });
    const source = within(form).getByRole('combobox', {
      name: /From warehouse/,
    });
    expect(source).toHaveValue('');
    await user.click(source);
    await user.click(
      await screen.findByRole('option', { name: 'Main Warehouse' })
    );
    expect(source).toHaveValue('Main Warehouse');
  });

  it('reviews a draft source from the URL and leaves the picker empty on cancel', async () => {
    const user = userEvent.setup();
    setup({ sourceWarehouseId: draftWarehouse.id });

    const review = await screen.findByRole('dialog', {
      name: 'Publish warehouse?',
    });
    await user.click(within(review).getByRole('button', { name: 'Cancel' }));

    const source = await screen.findByRole('combobox', {
      name: 'From warehouse',
    });
    expect(source).toHaveValue('');
    await waitFor(() => expect(source).toHaveFocus());
    expect(updateWarehouseMock).not.toHaveBeenCalled();

    await user.click(source);
    await user.click(screen.getByRole('option', { name: 'Main Warehouse' }));
    expect(source).toHaveValue('Main Warehouse');
  });

  it.each([
    { action: 'Cancel', expectedSource: '' },
    { action: 'Select warehouse', expectedSource: draftWarehouse.name },
  ])('keeps review open after a focus refresh and handles $action', async ({
    action,
    expectedSource,
  }) => {
    const user = userEvent.setup();
    setup({ sourceWarehouseId: draftWarehouse.id });

    const review = await screen.findByRole('dialog', {
      name: 'Publish warehouse?',
    });
    const publish = within(review).getByRole('button', {
      name: 'Publish and select',
    });
    await waitFor(() => expect(publish).toBeEnabled());
    getWarehouseMock.mockResolvedValueOnce({
      ok: true,
      data: { ...draftWarehouse, status: WAREHOUSE_STATUS.ACTIVE },
    });

    try {
      act(() => focusManager.setFocused(false));
      await act(async () => focusManager.setFocused(true));

      const activeReview = await screen.findByRole('dialog', {
        name: 'Select warehouse',
      });
      await user.click(
        within(activeReview).getByRole('button', { name: action })
      );

      const source = await screen.findByRole('combobox', {
        name: 'From warehouse',
      });
      expect(source).toHaveValue(expectedSource);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      await waitFor(() => expect(source).toHaveFocus());
      expect(updateWarehouseMock).not.toHaveBeenCalled();
    } finally {
      focusManager.setFocused(undefined);
    }
  });

  it('keeps the manually selected source when the browser tab regains focus', async () => {
    const user = userEvent.setup();
    getWarehouseMock.mockResolvedValueOnce({
      ok: false,
      error: { status: 404, message: 'Warehouse not found' },
    });
    setup({ sourceWarehouseId: 42 });

    const source = await screen.findByRole('combobox', {
      name: /From warehouse/,
    });
    await user.click(source);
    await user.click(
      await screen.findByRole('option', { name: 'Main Warehouse' })
    );

    try {
      act(() => focusManager.setFocused(false));
      await act(async () => focusManager.setFocused(true));

      expect(getWarehouseMock).toHaveBeenCalledTimes(1);
      expect(source).toHaveValue('Main Warehouse');
    } finally {
      focusManager.setFocused(undefined);
    }
  });

  it('allows selecting a source manually without a source warehouse id', async () => {
    const user = userEvent.setup();
    setup();

    const source = screen.getByRole('combobox', { name: /From warehouse/ });
    expect(source).toHaveValue('');
    await user.click(source);
    await user.click(
      await screen.findByRole('option', { name: 'Main Warehouse' })
    );
    expect(source).toHaveValue('Main Warehouse');
    expect(getWarehouseMock).not.toHaveBeenCalled();
  });

  it.each([
    'From warehouse',
    'To warehouse',
  ])('opens review instead of selecting a draft in %s', async (label) => {
    const user = userEvent.setup();
    setup();

    const picker = screen.getByRole('combobox', { name: label });
    await user.click(picker);
    const draftOption = await screen.findByRole('option', {
      name: 'Unfinished Warehouse Draft',
    });

    await user.click(draftOption);
    expect(picker).toHaveValue('');
    const review = await screen.findByRole('dialog', {
      name: 'Publish warehouse?',
    });
    expect(
      within(review).getByRole('link', { name: /View warehouse details/ })
    ).toHaveAttribute('href', '/warehouse/2');
    await user.click(within(review).getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(picker).toHaveFocus());

    await user.click(picker);
    await user.click(screen.getByRole('option', { name: 'Main Warehouse' }));
    expect(picker).toHaveValue('Main Warehouse');
  });

  it('opens review for a draft source ID and selects it after a successful publish retry', async () => {
    const user = userEvent.setup();
    const publishedWarehouse = {
      ...draftWarehouse,
      status: WAREHOUSE_STATUS.ACTIVE,
    };
    updateWarehouseMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 409, message: 'Could not publish warehouse' },
      })
      .mockResolvedValueOnce({
        ok: true,
        data: publishedWarehouse,
      });
    const { queryClient } = setup({ sourceWarehouseId: draftWarehouse.id });
    const invalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');

    const review = await screen.findByRole('dialog', {
      name: 'Publish warehouse?',
    });
    const publish = within(review).getByRole('button', {
      name: 'Publish and select',
    });
    await waitFor(() => expect(publish).toBeEnabled());
    expect(within(review).getByText('Draft')).toBeVisible();

    await user.click(publish);
    expect(await within(review).findByRole('alert')).toHaveTextContent(
      'Could not publish warehouse'
    );
    await user.click(publish);
    const picker = await screen.findByRole('combobox', {
      name: 'From warehouse',
    });
    expect(picker).toHaveValue(draftWarehouse.name);
    expect(updateWarehouseMock).toHaveBeenLastCalledWith({
      warehouseId: draftWarehouse.id,
      status: WAREHOUSE_STATUS.ACTIVE,
    });
    expect(
      queryClient.getQueryData(warehousesQueryKeys.detail(draftWarehouse.id))
    ).toEqual(publishedWarehouse);
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: warehousesQueryKeys.list,
    });
  });

  it('selects a warehouse published elsewhere without publishing again', async () => {
    const user = userEvent.setup();
    getWarehouseMock.mockResolvedValueOnce({
      ok: true,
      data: { ...draftWarehouse, status: WAREHOUSE_STATUS.ACTIVE },
    });
    setup();

    const picker = screen.getByRole('combobox', { name: 'To warehouse' });
    await user.click(picker);
    await user.click(
      await screen.findByRole('option', { name: 'Unfinished Warehouse Draft' })
    );
    const review = await screen.findByRole('dialog', {
      name: 'Select warehouse',
    });
    await user.click(
      within(review).getByRole('button', { name: 'Select warehouse' })
    );

    expect(picker).toHaveValue(draftWarehouse.name);
    expect(updateWarehouseMock).not.toHaveBeenCalled();
  });
});

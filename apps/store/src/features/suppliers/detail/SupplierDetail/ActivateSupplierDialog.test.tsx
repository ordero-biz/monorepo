import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateSupplier } from '@/lib/client/api/suppliers';
import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { SUPPLIER_STATUS } from '@/lib/domain/suppliers/constants';
import type { Supplier } from '@/lib/domain/suppliers/types';
import { suppliersQueryKeys } from '@/lib/query/suppliers/suppliersQueryKeys';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateSupplierDialog } from './ActivateSupplierDialog';

vi.mock('@/lib/client/api/suppliers', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/suppliers')>(
    '@/lib/client/api/suppliers'
  )),
  updateSupplier: vi.fn(),
}));

const updateSupplierMock = vi.mocked(updateSupplier);
const onOpenChangeMock = vi.fn();
const onUpdatedMock = vi.fn();

const supplier: Supplier = {
  id: 1,
  name: 'Fresh Farms',
  status: SUPPLIER_STATUS.DRAFT,
  email: 'orders@fresh.example',
  phone: '+1 555 0100',
  address: '123 Market St',
  comment: 'Preferred produce supplier',
};

const { setup } = prepareStoreSetup({
  component: ActivateSupplierDialog,
  props: {
    onOpenChange: onOpenChangeMock,
    onUpdated: onUpdatedMock,
    open: true,
    supplier,
  },
});

describe('ActivateSupplierDialog', () => {
  beforeEach(() => {
    updateSupplierMock.mockReset();
    onOpenChangeMock.mockClear();
    onUpdatedMock.mockClear();
  });

  it('publishes the supplier, invalidates caches, and closes on confirm', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: true,
      data: {
        ...supplier,
        status: SUPPLIER_STATUS.ACTIVE,
      },
    });
    const user = userEvent.setup();
    const { queryClient } = setup();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(updateSupplierMock).toHaveBeenCalledWith({
      supplierId: 1,
      status: SUPPLIER_STATUS.ACTIVE,
    });
    await waitFor(() =>
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: suppliersQueryKeys.list,
      })
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: suppliersQueryKeys.detail(1),
    });
    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    expect(onUpdatedMock).toHaveBeenCalled();
  });

  it('disables publish and cancel while the request is pending', async () => {
    let resolveUpdate:
      | ((value: Awaited<ReturnType<typeof updateSupplier>>) => void)
      | undefined;
    updateSupplierMock.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );
    const user = userEvent.setup();

    setup();

    const publishButton = screen.getByRole('button', { name: 'Publish' });
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    await user.click(publishButton);

    expect(publishButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Publishing...' })).toBeVisible();

    resolveUpdate?.({
      ok: true,
      data: {
        ...supplier,
        status: SUPPLIER_STATUS.ACTIVE,
      },
    });

    await screen.findByRole('button', { name: 'Publish' });
  });

  it('shows the mapped error and keeps the dialog open when publishing fails', async () => {
    updateSupplierMock.mockResolvedValue({
      ok: false,
      error: {
        status: 409,
        code: API_ERROR_CODES.SUPPLIER_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      },
    });
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      await screen.findByRole('dialog', {
        name: 'Cannot edit name or status of an active supplier',
      })
    ).toBeVisible();
    expect(
      screen.getByRole('dialog', { name: 'Publish supplier' })
    ).toBeVisible();
    expect(onOpenChangeMock).not.toHaveBeenCalledWith(false);
    expect(onUpdatedMock).not.toHaveBeenCalled();
  });
});

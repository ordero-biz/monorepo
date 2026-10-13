import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import {
  getSupplyFormDefaults,
  type SupplyFormValues,
  type SupplySubmitIntent,
} from '../../../shared/SupplyEditorForm';
import { submitCreateSupplyAction } from '../utils/submitCreateSupplyAction';
import { useCreateSupplyForm } from './useCreateSupplyForm';

vi.mock('../utils/submitCreateSupplyAction', async () => ({
  ...(await vi.importActual<typeof import('../utils/submitCreateSupplyAction')>(
    '../utils/submitCreateSupplyAction'
  )),
  submitCreateSupplyAction: vi.fn(),
}));

const submitCreateSupplyActionMock = vi.mocked(submitCreateSupplyAction);
const supply: SupplyDetails = {
  id: 9,
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-001',
  totalQuantity: 1,
  totalPrice: 28,
  version: 1,
  supplyEntries: [
    {
      id: 17,
      productVariant: { id: 11, name: 'Rice' },
      unitOfMeasurement: { id: 2, name: 'Bag', status: 'ACTIVE' },
      quantity: 1,
      unitPrice: 28,
    },
  ],
};

type TestHookProps = Parameters<typeof useCreateSupplyForm>[0] & {
  intent: SupplySubmitIntent;
  values: SupplyFormValues;
};

const useTestCreateSupplyForm = ({
  intent,
  values,
  ...args
}: TestHookProps) => {
  const { form, submit } = useCreateSupplyForm(args);
  return {
    form: {
      handleSubmit: () => {
        form.setFieldValue('supplierId', values.supplierId);
        form.setFieldValue('supplierName', values.supplierName);
        form.setFieldValue('warehouseId', values.warehouseId);
        form.setFieldValue('warehouseName', values.warehouseName);
        form.setFieldValue('supplyNumber', values.supplyNumber);
        form.setFieldValue(
          'supplierInvoiceNumber',
          values.supplierInvoiceNumber
        );
        form.setFieldValue('comment', values.comment);
        form.setFieldValue('supplyEntries', values.supplyEntries);
        return submit(intent);
      },
    },
  };
};

const { setup } = prepareFormHookTestSetup<TestHookProps>({
  useFormHook: useTestCreateSupplyForm,
  hookProps: {
    onCreated: vi.fn(),
    intent: 'draft',
    values: getSupplyFormDefaults(supply),
  },
});

describe('useCreateSupplyForm', () => {
  beforeEach(() => {
    submitCreateSupplyActionMock.mockReset();
  });

  it.each([
    ['draft', SUPPLY_STATUS.DRAFT, 'Supply draft created.'],
    [
      'finalize',
      SUPPLY_STATUS.COMPLETED,
      'Supply finalized. It can no longer be edited.',
    ],
  ] as const)('creates a supply with %s intent and reports the result', async (intent, status, message) => {
    const savedSupply = { ...supply, status };
    submitCreateSupplyActionMock.mockResolvedValue({
      ok: true,
      data: savedSupply,
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        onCreated: vi.fn(),
        intent,
        values: getSupplyFormDefaults(supply),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(hookProps.onCreated).toHaveBeenCalledWith(savedSupply)
    );
    expect(submitCreateSupplyActionMock).toHaveBeenCalledWith({
      value: hookProps.values,
      status,
    });
    expect(await screen.findByText(message)).toBeVisible();
  });

  it('does not report creation when the submit action fails', async () => {
    submitCreateSupplyActionMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Could not save the supply.' },
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        onCreated: vi.fn(),
        intent: 'draft',
        values: getSupplyFormDefaults(supply),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Could not save the supply.')).toBeVisible();
    expect(hookProps.onCreated).not.toHaveBeenCalled();
  });
});

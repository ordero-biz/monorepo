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
import { submitCreateSupply } from '../utils/submitAction';
import { useCreateSupplyForm } from './useCreateSupplyForm';

vi.mock('../utils/submitAction', async () => ({
  ...(await vi.importActual<typeof import('../utils/submitAction')>(
    '../utils/submitAction'
  )),
  submitCreateSupply: vi.fn(),
}));

const submitCreateSupplyMock = vi.mocked(submitCreateSupply);
const supply: SupplyDetails = {
  comment: null,
  completedAt: null,
  completedBy: null,
  supplierInvoiceNumber: null,
  createdAt: '2026-10-28T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-10-28T10:00:00Z',
  updatedBy: 'owner@example.test',

  id: 9,
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-001',

  totalPrice: 28,
  version: 1,
  supplyEntries: [
    {
      comment: null,

      id: 17,
      productVariant: {
        sku: '',
        barcode: '',
        id: 11,
        name: 'Rice',
      },
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
        form.setFieldValue('supplier', values.supplier);
        form.setFieldValue('warehouse', values.warehouse);
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
    submitCreateSupplyMock.mockReset();
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
    submitCreateSupplyMock.mockResolvedValue({
      ok: true,
      data: savedSupply,
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        onCreated: vi.fn(),
        intent,
        values: {
          ...getSupplyFormDefaults(supply),
          supplyNumber: ' SUP-001 ',
          comment: '   ',
        },
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(hookProps.onCreated).toHaveBeenCalledWith(savedSupply)
    );
    expect(submitCreateSupplyMock).toHaveBeenCalledWith({
      supplierId: 3,
      warehouseId: 4,
      supplyNumber: 'SUP-001',
      supplyEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 2,
          quantity: 1,
          unitPrice: 28,
        },
      ],
      status,
    });
    expect(await screen.findByText(message)).toBeVisible();
  });

  it.each([
    { supplyEntries: [] },
    { supplyEntries: getSupplyFormDefaults().supplyEntries },
  ])('rejects finalization without populated entries (%j)', async ({
    supplyEntries,
  }) => {
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        onCreated: vi.fn(),
        intent: 'finalize',
        values: { ...getSupplyFormDefaults(supply), supplyEntries },
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(
      await screen.findByText('Add at least one product before finalizing.')
    ).toBeVisible();
    expect(submitCreateSupplyMock).not.toHaveBeenCalled();
    expect(hookProps.onCreated).not.toHaveBeenCalled();
  });

  it('does not report creation when the submit action fails', async () => {
    submitCreateSupplyMock.mockResolvedValue({
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

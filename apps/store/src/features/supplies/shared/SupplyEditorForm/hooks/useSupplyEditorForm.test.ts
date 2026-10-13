import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { prepareFormHookTestSetup } from '@/test/prepareFormHookTestSetup';
import { submitUpdateSupplyAction } from '../submitUpdateSupplyAction';
import type { SupplySubmitIntent } from '../types';
import { useSupplyEditorForm } from './useSupplyEditorForm';

vi.mock('../submitUpdateSupplyAction', async () => ({
  ...(await vi.importActual<typeof import('../submitUpdateSupplyAction')>(
    '../submitUpdateSupplyAction'
  )),
  submitUpdateSupplyAction: vi.fn(),
}));

const submitUpdateSupplyActionMock = vi.mocked(submitUpdateSupplyAction);
const supply: SupplyDetails = {
  id: 9,
  supplier: { id: 3, name: 'Global Foods', status: 'ACTIVE' },
  warehouse: { id: 4, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-001',
  totalQuantity: 0,
  totalPrice: 0,
  version: 1,
  supplyEntries: [],
};

type TestHookProps = Parameters<typeof useSupplyEditorForm>[0] & {
  intent: SupplySubmitIntent;
  supplyNumber: string;
};

const useTestSupplyForm = ({
  intent,
  supplyNumber,
  ...args
}: TestHookProps) => {
  const { form, submit } = useSupplyEditorForm(args);
  return {
    form: {
      handleSubmit: () => {
        form.setFieldValue('supplyNumber', supplyNumber);
        return submit(intent);
      },
    },
  };
};

const { setup } = prepareFormHookTestSetup<TestHookProps>({
  useFormHook: useTestSupplyForm,
  hookProps: {
    initialSupply: supply,
    intent: 'draft',
    supplyNumber: 'SUP-002',
    onSaved: vi.fn(),
  },
});

describe('useSupplyEditorForm', () => {
  beforeEach(() => {
    submitUpdateSupplyActionMock.mockReset();
  });

  it('saves a metadata-only draft and reports the saved supply', async () => {
    const savedSupply = { ...supply, supplyNumber: 'SUP-002', version: 2 };
    submitUpdateSupplyActionMock.mockResolvedValue({
      ok: true,
      data: savedSupply,
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        initialSupply: supply,
        intent: 'draft',
        supplyNumber: 'SUP-002',
        onSaved: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() =>
      expect(hookProps.onSaved).toHaveBeenCalledWith(savedSupply)
    );
    expect(submitUpdateSupplyActionMock).toHaveBeenCalledWith({
      value: expect.objectContaining({ supplyNumber: 'SUP-002' }),
      initialSupply: supply,
      status: SUPPLY_STATUS.DRAFT,
    });
  });

  it('does not finalize a supply without products', async () => {
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        initialSupply: supply,
        intent: 'finalize',
        supplyNumber: 'SUP-002',
        onSaved: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(submitUpdateSupplyActionMock).not.toHaveBeenCalled();
    expect(hookProps.onSaved).not.toHaveBeenCalled();
  });

  it('does not report a save when the submit utility finds no changes', async () => {
    submitUpdateSupplyActionMock.mockResolvedValue(null);
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        initialSupply: supply,
        intent: 'draft',
        supplyNumber: 'SUP-001',
        onSaved: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('No changes to save.')).toBeVisible();
    expect(submitUpdateSupplyActionMock).toHaveBeenCalledOnce();
    expect(hookProps.onSaved).not.toHaveBeenCalled();
  });

  it('shows a submit error without reporting success', async () => {
    submitUpdateSupplyActionMock.mockResolvedValue({
      ok: false,
      error: { status: 500, message: 'Could not save the supply.' },
    });
    const user = userEvent.setup();
    const { hookProps } = setup({
      hookProps: {
        initialSupply: supply,
        intent: 'draft',
        supplyNumber: 'SUP-002',
        onSaved: vi.fn(),
      },
    });

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Could not save the supply.')).toBeVisible();
    expect(hookProps.onSaved).not.toHaveBeenCalled();
  });
});

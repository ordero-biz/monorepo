import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getSupply } from '@/lib/client/api/supplies';
import { SUPPLY_STATUS } from '@/lib/domain/supplies/constants';
import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { SupplyDetail } from './SupplyDetail';

vi.mock('@/lib/client/api/supplies', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/supplies')>(
    '@/lib/client/api/supplies'
  )),
  getSupply: vi.fn(),
}));

vi.mock('../../add/CreateSupply', () => ({
  CreateSupply: ({ initialSupply }: { initialSupply?: SupplyDetails }) => (
    <div>Editing supply {initialSupply?.supplyNumber}</div>
  ),
}));

const getSupplyMock = vi.mocked(getSupply);

const { setup } = prepareStoreSetup({
  component: SupplyDetail,
  props: {
    supplyId: '9',
  },
});

const supply = {
  id: 9,
  supplier: { id: 1, name: 'Fresh Farms', status: 'ACTIVE' },
  warehouse: { id: 2, name: 'Main Warehouse', status: 'ACTIVE' },
  status: SUPPLY_STATUS.DRAFT,
  supplyNumber: 'SUP-009',
  totalQuantity: 0,
  totalPrice: 0,
  supplyEntries: [],
  version: 1,
};

describe('SupplyDetail', () => {
  beforeEach(() => {
    getSupplyMock.mockReset();
  });

  it('opens the saved supply in the editor', async () => {
    getSupplyMock.mockResolvedValue({ ok: true, data: supply });

    setup();

    expect(await screen.findByText('Editing supply SUP-009')).toBeVisible();
    expect(getSupplyMock).toHaveBeenCalledWith('9');
  });

  it('retries when the supply cannot be loaded', async () => {
    getSupplyMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load supply.' },
      })
      .mockResolvedValueOnce({ ok: true, data: supply });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this supply right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText('Editing supply SUP-009')).toBeVisible();
    expect(getSupplyMock).toHaveBeenCalledTimes(2);
  });
});

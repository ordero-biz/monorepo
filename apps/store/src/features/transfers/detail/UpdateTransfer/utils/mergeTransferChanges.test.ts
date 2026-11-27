import { TRANSFER_STATUS } from '@/lib/domain/transfers/constants';
import type { TransferDetails } from '@/lib/domain/transfers/types';
import { WAREHOUSE_STATUS } from '@/lib/domain/warehouses/constants';
import { getTransferFormDefaults } from '../../../shared/TransferEditorForm';
import { getTransferUpdateChanges } from './getUpdateChanges';
import { mergeTransferChanges } from './mergeTransferChanges';

const baseline: TransferDetails = {
  id: 5,
  sourceWarehouse: {
    id: 1,
    name: 'Main Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  destinationWarehouse: {
    id: 2,
    name: 'East Warehouse',
    status: WAREHOUSE_STATUS.ACTIVE,
  },
  transferNumber: 'Weekend restock',
  status: TRANSFER_STATUS.DRAFT,
  comment: 'Original comment',
  dispatchedAt: null,
  dispatchedBy: null,
  completedAt: null,
  completedBy: null,
  createdAt: '2026-11-17T10:00:00Z',
  createdBy: 'owner@example.test',
  updatedAt: '2026-11-17T10:00:00Z',
  updatedBy: 'owner@example.test',
  transferEntries: [
    {
      id: 17,
      productVariant: {
        id: 11,
        name: 'Rice',
        sku: 'GR-1',
        barcode: '',
      },
      unitOfMeasurement: {
        id: 4,
        name: 'Bag',
        symbol: 'bag',
        status: 'ACTIVE',
        comment: null,
      },
      quantity: 2,
      comment: null,
    },
  ],
  version: 1,
};

describe('mergeTransferChanges', () => {
  it('keeps local edits and brings in changes to other fields', () => {
    const current = {
      ...getTransferFormDefaults(baseline),
      comment: 'Local comment',
    };
    const latest = {
      ...baseline,
      transferNumber: 'Monday restock',
      version: 2,
    };

    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.comment).toBe('Local comment');
    expect(merged.values.transferNumber).toBe('Monday restock');
    expect(
      getTransferUpdateChanges({
        transfer: latest,
        formValue: merged.values,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({
      comment: 'Local comment',
    });
  });

  it('requires an explicit choice when the same field changed differently', () => {
    const current = {
      ...getTransferFormDefaults(baseline),
      comment: 'My comment',
      transferNumber: 'My transfer',
    };
    const latest = { ...baseline, comment: 'Saved comment', version: 2 };

    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts).toEqual([
      {
        field: 'comment',
        label: 'Comment',
        localValue: 'My comment',
        serverValue: 'Saved comment',
      },
    ]);
    const keepMine = mergeTransferChanges({
      baseline,
      current,
      latest,
      choices: { comment: 'local' },
    });
    expect(keepMine.hasUnresolvedConflicts).toBe(false);
    expect(keepMine.values.comment).toBe('My comment');
    const useSaved = mergeTransferChanges({
      baseline,
      current,
      latest,
      choices: { comment: 'server' },
    });
    expect(useSaved.hasUnresolvedConflicts).toBe(false);
    expect(useSaved.values.comment).toBe('Saved comment');
    expect(useSaved.values.transferNumber).toBe('My transfer');
  });

  it('preserves clearing an optional value as a pending null update', () => {
    const latest = {
      ...baseline,
      transferNumber: 'Monday restock',
      version: 2,
    };
    const merged = mergeTransferChanges({
      baseline,
      current: { ...getTransferFormDefaults(baseline), comment: '' },
      latest,
    });

    expect(merged.values.comment).toBe('');
    expect(
      getTransferUpdateChanges({
        transfer: latest,
        formValue: merged.values,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({ comment: null });
  });

  it('refreshes option display metadata without treating it as a conflicting selection', () => {
    const current = {
      ...getTransferFormDefaults(baseline),
      comment: 'My comment',
    };
    const latest = {
      ...baseline,
      destinationWarehouse: {
        ...baseline.destinationWarehouse,
        name: 'Renamed warehouse',
      },
      version: 2,
    };
    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.destinationWarehouse).toEqual(
      latest.destinationWarehouse
    );
    expect(merged.changedFields).toEqual(['comment']);
  });

  it('preserves local product edits when only transfer metadata changed remotely', () => {
    const current = getTransferFormDefaults(baseline);
    current.transferEntries[0].quantity = 3;
    const merged = mergeTransferChanges({
      baseline,
      current,
      latest: { ...baseline, transferNumber: 'Monday restock', version: 2 },
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.transferEntries[0].quantity).toBe(3);
    expect(merged.values.transferNumber).toBe('Monday restock');
  });

  it('brings in saved products when the local product list is unchanged', () => {
    const current = {
      ...getTransferFormDefaults(baseline),
      comment: 'My comment',
    };
    const latest = {
      ...baseline,
      transferEntries: [{ ...baseline.transferEntries[0], quantity: 4 }],
      version: 2,
    };
    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.transferEntries[0].quantity).toBe(4);
    expect(merged.values.comment).toBe('My comment');
  });

  it('requires choosing a complete product list when both lists changed', () => {
    const current = getTransferFormDefaults(baseline);
    current.transferEntries[0].quantity = 3;
    const latest = {
      ...baseline,
      transferEntries: [
        { ...baseline.transferEntries[0], id: 20, quantity: 6 },
      ],
      version: 2,
    };
    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts[0].field).toBe('transferEntries');
    expect(merged.conflicts[0].localValue).toContain('quantity: 3');
    expect(merged.conflicts[0].serverValue).toContain('quantity: 6');
    const keepMine = mergeTransferChanges({
      baseline,
      current,
      latest,
      choices: { transferEntries: 'local' },
    });
    expect(keepMine.values.transferEntries).toEqual(current.transferEntries);
    const useSaved = mergeTransferChanges({
      baseline,
      current,
      latest,
      choices: { transferEntries: 'server' },
    });
    expect(useSaved.values.transferEntries).toEqual(
      getTransferFormDefaults(latest).transferEntries
    );
  });

  it('appends unsaved rows after refreshed products when existing rows are unchanged', () => {
    const current = getTransferFormDefaults(baseline);
    const addedEntry = {
      ...current.transferEntries[0],
      clientId: 'new-0',
      stockItem: {
        productVariant: { id: 12, name: 'Beans', sku: 'GR-2', barcode: '' },
        unitOfMeasurement: { id: 4, name: 'Bag', symbol: 'bag' },
        available: 25,
      },
      quantity: 3,
    };
    current.transferEntries.push(addedEntry);
    const latest = {
      ...baseline,
      transferEntries: [
        { ...baseline.transferEntries[0], id: 20, quantity: 4 },
      ],
      version: 2,
    };

    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.transferEntries).toEqual([
      ...getTransferFormDefaults(latest).transferEntries,
      addedEntry,
    ]);
    expect(merged.changedFields).toEqual(['transferEntries']);
    expect(
      getTransferUpdateChanges({
        transfer: latest,
        formValue: merged.values,
        status: TRANSFER_STATUS.DRAFT,
      })
    ).toEqual({
      transferEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 4,
          quantity: 4,
        },
        {
          productVariantId: 12,
          unitOfMeasurementId: 4,
          quantity: 3,
        },
      ],
    });
  });

  it('couples source warehouse and product choices when the source warehouse changed', () => {
    const northHub = {
      id: 3,
      name: 'North Hub',
      status: WAREHOUSE_STATUS.ACTIVE,
    };
    const current = getTransferFormDefaults(baseline);
    current.transferEntries.push({
      ...current.transferEntries[0],
      clientId: 'new-0',
      quantity: 3,
    });
    const latest = {
      ...baseline,
      sourceWarehouse: northHub,
      transferEntries: [],
      version: 2,
    };

    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts).toEqual([
      {
        field: 'transferEntries',
        label: 'Products to transfer',
        localValue: expect.stringContaining('From warehouse: Main Warehouse'),
        serverValue: expect.stringContaining('From warehouse: North Hub'),
        helperText:
          'Products belong to the source warehouse. Choose one source warehouse and its complete product list.',
      },
    ]);
    expect(merged.updates).toEqual([]);

    const keepLocal = mergeTransferChanges({
      baseline,
      current,
      latest,
      choices: { transferEntries: 'local' },
    });
    expect(keepLocal.hasUnresolvedConflicts).toBe(false);
    expect(keepLocal.values.sourceWarehouse).toEqual(baseline.sourceWarehouse);
    expect(keepLocal.values.transferEntries).toEqual(current.transferEntries);
    expect(keepLocal.changedFields).toEqual([
      'sourceWarehouse',
      'transferEntries',
    ]);

    const useServer = mergeTransferChanges({
      baseline,
      current,
      latest,
      choices: { transferEntries: 'server' },
    });
    expect(useServer.hasUnresolvedConflicts).toBe(false);
    expect(useServer.values.sourceWarehouse).toEqual(northHub);
    expect(useServer.values.transferEntries).toEqual(
      getTransferFormDefaults(latest).transferEntries
    );
    expect(useServer.changedFields).toEqual([]);
  });

  it('couples local source warehouse changes with remote product edits on the original warehouse', () => {
    const northHub = {
      id: 3,
      name: 'North Hub',
      status: WAREHOUSE_STATUS.ACTIVE,
    };
    const emptyBaseline = { ...baseline, transferEntries: [] };
    const current = {
      ...getTransferFormDefaults(emptyBaseline),
      sourceWarehouse: northHub,
    };
    const latest = {
      ...baseline,
      version: 2,
    };

    const merged = mergeTransferChanges({
      baseline: emptyBaseline,
      current,
      latest,
    });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts.map(({ field }) => field)).toEqual([
      'transferEntries',
    ]);
    expect(merged.updates).toEqual([]);

    const keepLocal = mergeTransferChanges({
      baseline: emptyBaseline,
      current,
      latest,
      choices: { transferEntries: 'local' },
    });
    expect(keepLocal.values.sourceWarehouse).toEqual(northHub);
    expect(keepLocal.values.transferEntries).toEqual(current.transferEntries);

    const useServer = mergeTransferChanges({
      baseline: emptyBaseline,
      current,
      latest,
      choices: { transferEntries: 'server' },
    });
    expect(useServer.values.sourceWarehouse).toEqual(baseline.sourceWarehouse);
    expect(useServer.values.transferEntries).toEqual(
      getTransferFormDefaults(latest).transferEntries
    );
  });

  it('preserves a new blank row across refreshes when the server removes every saved row', () => {
    const current = getTransferFormDefaults(baseline);
    const addedEntry = {
      ...getTransferFormDefaults().transferEntries[0],
      clientId: 'new-0',
    };
    current.transferEntries.push(addedEntry);
    const latest = { ...baseline, transferEntries: [], version: 2 };

    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.transferEntries).toEqual([addedEntry]);
    const refreshed = mergeTransferChanges({
      baseline: latest,
      current: merged.values,
      latest: { ...latest, version: 3 },
    });
    expect(refreshed.values.transferEntries).toEqual([addedEntry]);
    expect(refreshed.changedFields).toEqual(['transferEntries']);
  });

  it('appends edits to an empty transfer placeholder after newly saved rows', () => {
    const emptyTransfer = { ...baseline, transferEntries: [] };
    const current = getTransferFormDefaults(emptyTransfer);
    current.transferEntries[0].comment = 'Unfinished new row';
    const latest = { ...baseline, version: 2 };

    const merged = mergeTransferChanges({
      baseline: emptyTransfer,
      current,
      latest,
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.transferEntries).toEqual([
      ...getTransferFormDefaults(latest).transferEntries,
      ...current.transferEntries,
    ]);
  });

  it('replaces an untouched empty transfer placeholder with saved rows', () => {
    const emptyTransfer = { ...baseline, transferEntries: [] };
    const latest = { ...baseline, version: 2 };
    const merged = mergeTransferChanges({
      baseline: emptyTransfer,
      current: {
        ...getTransferFormDefaults(emptyTransfer),
        comment: 'My comment',
      },
      latest,
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.transferEntries).toEqual(
      getTransferFormDefaults(latest).transferEntries
    );
    expect(merged.changedFields).toEqual(['comment']);
  });

  it.each([
    'edited',
    'deleted',
    'reordered',
  ] as const)('still requires a product list choice when existing rows are %s as well as added', (change) => {
    const initial = {
      ...baseline,
      transferEntries: [
        ...baseline.transferEntries,
        { ...baseline.transferEntries[0], id: 18, quantity: 4 },
      ],
    };
    const current = getTransferFormDefaults(initial);
    if (change === 'edited') {
      current.transferEntries[0].quantity = 3;
    } else if (change === 'deleted') {
      current.transferEntries.shift();
    } else {
      current.transferEntries.reverse();
    }
    current.transferEntries.push({
      ...getTransferFormDefaults().transferEntries[0],
      clientId: 'new-0',
    });
    const latest = { ...baseline, transferEntries: [], version: 2 };

    const merged = mergeTransferChanges({ baseline: initial, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts.map(({ field }) => field)).toEqual([
      'transferEntries',
    ]);
    expect(merged.values.transferEntries).toEqual(current.transferEntries);
  });

  it('preserves unfinished product rows', () => {
    const current = getTransferFormDefaults(baseline);
    current.transferEntries.push({
      ...getTransferFormDefaults().transferEntries[0],
      clientId: 'new-1',
    });
    const merged = mergeTransferChanges({
      baseline,
      current,
      latest: { ...baseline, transferNumber: 'Monday restock', version: 2 },
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.transferEntries).toEqual(current.transferEntries);
    expect(merged.changedFields).toContain('transferEntries');
  });

  it('does not create conflicts for equivalent text formatting and stock snapshots', () => {
    const current = getTransferFormDefaults(baseline);
    if (current.transferEntries[0].stockItem) {
      current.transferEntries[0].stockItem = {
        ...current.transferEntries[0].stockItem,
        available: 50,
      };
    }
    current.transferNumber = ' Weekend restock ';
    const latest = {
      ...baseline,
      transferNumber: 'Monday restock',
      transferEntries: [{ ...baseline.transferEntries[0], quantity: 4 }],
      version: 2,
    };
    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values).toEqual(getTransferFormDefaults(latest));
    expect(merged.changedFields).toEqual([]);
  });

  it('treats matching local and saved changes as already saved', () => {
    const current = {
      ...getTransferFormDefaults(baseline),
      comment: 'Same edit',
    };
    const latest = { ...baseline, comment: 'Same edit', version: 2 };
    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.changedFields).toEqual([]);
  });

  it('allows a standalone source warehouse conflict when both product lists are empty', () => {
    const northHub = {
      id: 3,
      name: 'North Hub',
      status: WAREHOUSE_STATUS.ACTIVE,
    };
    const returnsCenter = {
      id: 4,
      name: 'Returns Center',
      status: WAREHOUSE_STATUS.ACTIVE,
    };
    const emptyBaseline = { ...baseline, transferEntries: [] };
    const current = {
      ...getTransferFormDefaults(emptyBaseline),
      sourceWarehouse: northHub,
    };
    const latest = {
      ...emptyBaseline,
      sourceWarehouse: returnsCenter,
      version: 2,
    };

    const merged = mergeTransferChanges({
      baseline: emptyBaseline,
      current,
      latest,
    });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts).toEqual([
      {
        field: 'sourceWarehouse',
        label: 'From warehouse',
        localValue: 'North Hub',
        serverValue: 'Returns Center',
      },
    ]);
  });

  it('preserves unrelated conflicts and updates alongside a coupled source warehouse and products conflict', () => {
    const northHub = {
      id: 3,
      name: 'North Hub',
      status: WAREHOUSE_STATUS.ACTIVE,
    };
    const current = {
      ...getTransferFormDefaults(baseline),
      comment: 'Local comment',
    };
    current.transferEntries[0].quantity = 5;
    const latest = {
      ...baseline,
      sourceWarehouse: northHub,
      transferNumber: 'Monday restock',
      comment: 'Saved comment',
      transferEntries: [],
      version: 2,
    };

    const merged = mergeTransferChanges({ baseline, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.updates).toEqual([
      {
        field: 'transferNumber',
        label: 'Name',
        currentValue: 'Weekend restock',
        mergedValue: 'Monday restock',
      },
    ]);
    expect(merged.conflicts.map(({ field }) => field)).toEqual([
      'comment',
      'transferEntries',
    ]);
    expect(
      mergeTransferChanges({
        baseline,
        current,
        latest,
        choices: { transferEntries: 'local' },
      }).hasUnresolvedConflicts
    ).toBe(true);

    const resolved = mergeTransferChanges({
      baseline,
      current,
      latest,
      choices: { comment: 'server', transferEntries: 'local' },
    });
    expect(resolved.hasUnresolvedConflicts).toBe(false);
    expect(resolved.values.comment).toBe('Saved comment');
    expect(resolved.values.transferNumber).toBe('Monday restock');
    expect(resolved.values.sourceWarehouse).toEqual(baseline.sourceWarehouse);
    expect(resolved.values.transferEntries).toEqual(current.transferEntries);
  });
});

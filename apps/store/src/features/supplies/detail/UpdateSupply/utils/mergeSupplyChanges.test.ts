import type { SupplyDetails } from '@/lib/domain/supplies/types';
import { getSupplyFormDefaults } from '../../../shared/SupplyEditorForm';
import { getSupplyUpdateChanges } from './getUpdateChanges';
import { mergeSupplyChanges } from './mergeSupplyChanges';

const baseline: SupplyDetails = {
  id: 9,
  supplier: { id: 1, name: 'Supplier', status: 'ACTIVE' },
  warehouse: { id: 2, name: 'Warehouse', status: 'ACTIVE' },
  status: 'DRAFT',
  supplyNumber: 'SUP-9',
  supplierInvoiceNumber: 'INV-1',
  comment: 'Original comment',
  totalQuantity: 2,
  totalPrice: 10,
  supplyEntries: [
    {
      id: 17,
      productVariant: { id: 11, name: 'Rice' },
      unitOfMeasurement: { id: 3, name: 'Bag', status: 'ACTIVE' },
      quantity: 2,
      unitPrice: 5,
    },
  ],
  version: 1,
};

describe('mergeSupplyChanges', () => {
  it('keeps local edits and brings in changes to other fields', () => {
    const current = {
      ...getSupplyFormDefaults(baseline),
      supplierInvoiceNumber: 'LOCAL-INVOICE',
    };
    const latest = { ...baseline, supplyNumber: 'SERVER-NUMBER', version: 2 };

    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplierInvoiceNumber).toBe('LOCAL-INVOICE');
    expect(merged.values.supplyNumber).toBe('SERVER-NUMBER');
    expect(
      getSupplyUpdateChanges({
        supply: latest,
        formValue: merged.values,
        status: 'DRAFT',
      })
    ).toEqual({
      supplierInvoiceNumber: 'LOCAL-INVOICE',
    });
  });

  it('requires an explicit choice when the same field changed differently', () => {
    const current = {
      ...getSupplyFormDefaults(baseline),
      comment: 'My comment',
      supplierInvoiceNumber: 'My invoice',
    };
    const latest = { ...baseline, comment: 'Saved comment', version: 2 };

    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts).toEqual([
      {
        field: 'comment',
        label: 'Comment',
        localValue: 'My comment',
        serverValue: 'Saved comment',
      },
    ]);
    const keepMine = mergeSupplyChanges({
      baseline,
      current,
      latest,
      choices: { comment: 'local' },
    });
    expect(keepMine.hasUnresolvedConflicts).toBe(false);
    expect(keepMine.values.comment).toBe('My comment');
    const useSaved = mergeSupplyChanges({
      baseline,
      current,
      latest,
      choices: { comment: 'server' },
    });
    expect(useSaved.hasUnresolvedConflicts).toBe(false);
    expect(useSaved.values.comment).toBe('Saved comment');
    expect(useSaved.values.supplierInvoiceNumber).toBe('My invoice');
  });

  it('preserves clearing an optional value as a pending null update', () => {
    const latest = { ...baseline, supplyNumber: 'SERVER-NUMBER', version: 2 };
    const merged = mergeSupplyChanges({
      baseline,
      current: { ...getSupplyFormDefaults(baseline), comment: '' },
      latest,
    });

    expect(merged.values.comment).toBe('');
    expect(
      getSupplyUpdateChanges({
        supply: latest,
        formValue: merged.values,
        status: 'DRAFT',
      })
    ).toEqual({ comment: null });
  });

  it('refreshes option display metadata without treating it as a conflicting selection', () => {
    const current = {
      ...getSupplyFormDefaults(baseline),
      comment: 'My comment',
    };
    const latest = {
      ...baseline,
      supplier: { ...baseline.supplier, name: 'Renamed supplier' },
      version: 2,
    };
    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplier).toEqual(latest.supplier);
    expect(merged.changedFields).toEqual(['comment']);
  });

  it('preserves local product edits when only supply metadata changed remotely', () => {
    const current = getSupplyFormDefaults(baseline);
    current.supplyEntries[0].quantity = '3';
    const merged = mergeSupplyChanges({
      baseline,
      current,
      latest: { ...baseline, supplyNumber: 'SERVER-NUMBER', version: 2 },
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries[0].quantity).toBe('3');
    expect(merged.values.supplyNumber).toBe('SERVER-NUMBER');
  });

  it('brings in saved products when the local product list is unchanged', () => {
    const current = {
      ...getSupplyFormDefaults(baseline),
      comment: 'My comment',
    };
    const latest = {
      ...baseline,
      supplyEntries: [{ ...baseline.supplyEntries[0], quantity: 4 }],
      version: 2,
    };
    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries[0].quantity).toBe('4');
    expect(merged.values.comment).toBe('My comment');
  });

  it('requires choosing a complete product list when both lists changed', () => {
    const current = getSupplyFormDefaults(baseline);
    current.supplyEntries[0].quantity = '3';
    const latest = {
      ...baseline,
      supplyEntries: [{ ...baseline.supplyEntries[0], id: 20, unitPrice: 6 }],
      version: 2,
    };
    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts[0].field).toBe('supplyEntries');
    expect(merged.conflicts[0].localValue).toContain('quantity: 3');
    expect(merged.conflicts[0].serverValue).toContain('unit price: 6');
    const keepMine = mergeSupplyChanges({
      baseline,
      current,
      latest,
      choices: { supplyEntries: 'local' },
    });
    expect(keepMine.values.supplyEntries).toEqual(current.supplyEntries);
    const useSaved = mergeSupplyChanges({
      baseline,
      current,
      latest,
      choices: { supplyEntries: 'server' },
    });
    expect(useSaved.values.supplyEntries).toEqual(
      getSupplyFormDefaults(latest).supplyEntries
    );
  });

  it('appends unsaved rows after refreshed products when existing rows are unchanged', () => {
    const current = getSupplyFormDefaults(baseline);
    current.supplyEntries[0].unitPrice = '5.00';
    const addedEntry = {
      ...current.supplyEntries[0],
      clientId: 'new-0',
      quantity: '3',
    };
    current.supplyEntries.push(addedEntry);
    const latest = {
      ...baseline,
      supplyEntries: [
        { ...baseline.supplyEntries[0], id: 20, quantity: 4 },
        {
          ...baseline.supplyEntries[0],
          id: 21,
          productVariant: { id: 12, name: 'Beans' },
        },
      ],
      version: 2,
    };

    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries).toEqual([
      ...getSupplyFormDefaults(latest).supplyEntries,
      addedEntry,
    ]);
    expect(merged.changedFields).toEqual(['supplyEntries']);
    expect(
      getSupplyUpdateChanges({
        supply: latest,
        formValue: merged.values,
        status: 'DRAFT',
      })
    ).toEqual({
      supplyEntries: [
        {
          productVariantId: 11,
          unitOfMeasurementId: 3,
          quantity: 4,
          unitPrice: 5,
          comment: null,
        },
        {
          productVariantId: 12,
          unitOfMeasurementId: 3,
          quantity: 2,
          unitPrice: 5,
          comment: null,
        },
        {
          productVariantId: 11,
          unitOfMeasurementId: 3,
          quantity: 3,
          unitPrice: 5,
          comment: null,
        },
      ],
    });
  });

  it('keeps separately added local and saved rows even when their values match', () => {
    const current = getSupplyFormDefaults(baseline);
    const addedEntry = { ...current.supplyEntries[0], clientId: 'new-0' };
    current.supplyEntries.push(addedEntry);
    const latest = {
      ...baseline,
      supplyEntries: [
        ...baseline.supplyEntries,
        { ...baseline.supplyEntries[0], id: 20 },
      ],
      version: 2,
    };

    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries).toEqual([
      ...getSupplyFormDefaults(latest).supplyEntries,
      addedEntry,
    ]);
  });

  it('preserves a new blank row across refreshes when the server removes every saved row', () => {
    const current = getSupplyFormDefaults(baseline);
    const addedEntry = {
      ...getSupplyFormDefaults().supplyEntries[0],
      clientId: 'new-0',
    };
    current.supplyEntries.push(addedEntry);
    const latest = { ...baseline, supplyEntries: [], version: 2 };

    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries).toEqual([addedEntry]);
    const refreshed = mergeSupplyChanges({
      baseline: latest,
      current: merged.values,
      latest: { ...latest, version: 3 },
    });
    expect(refreshed.values.supplyEntries).toEqual([addedEntry]);
    expect(refreshed.changedFields).toEqual(['supplyEntries']);
  });

  it('appends edits to an empty supply placeholder after newly saved rows', () => {
    const emptySupply = { ...baseline, supplyEntries: [] };
    const current = getSupplyFormDefaults(emptySupply);
    current.supplyEntries[0].comment = 'Unfinished new row';
    const latest = { ...baseline, version: 2 };

    const merged = mergeSupplyChanges({
      baseline: emptySupply,
      current,
      latest,
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries).toEqual([
      ...getSupplyFormDefaults(latest).supplyEntries,
      ...current.supplyEntries,
    ]);
  });

  it('replaces an untouched empty supply placeholder with saved rows', () => {
    const emptySupply = { ...baseline, supplyEntries: [] };
    const latest = { ...baseline, version: 2 };
    const merged = mergeSupplyChanges({
      baseline: emptySupply,
      current: { ...getSupplyFormDefaults(emptySupply), comment: 'My comment' },
      latest,
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries).toEqual(
      getSupplyFormDefaults(latest).supplyEntries
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
      supplyEntries: [
        ...baseline.supplyEntries,
        { ...baseline.supplyEntries[0], id: 18, quantity: 4 },
      ],
    };
    const current = getSupplyFormDefaults(initial);
    if (change === 'edited') {
      current.supplyEntries[0].quantity = '3';
    } else if (change === 'deleted') {
      current.supplyEntries.shift();
    } else {
      current.supplyEntries.reverse();
    }
    current.supplyEntries.push({
      ...getSupplyFormDefaults().supplyEntries[0],
      clientId: 'new-0',
    });
    const latest = { ...baseline, supplyEntries: [], version: 2 };

    const merged = mergeSupplyChanges({ baseline: initial, current, latest });

    expect(merged.hasUnresolvedConflicts).toBe(true);
    expect(merged.conflicts.map(({ field }) => field)).toEqual([
      'supplyEntries',
    ]);
    expect(merged.values.supplyEntries).toEqual(current.supplyEntries);
  });

  it('preserves unfinished product rows', () => {
    const current = getSupplyFormDefaults(baseline);
    current.supplyEntries.push({
      ...getSupplyFormDefaults().supplyEntries[0],
      clientId: 'new-1',
    });
    const merged = mergeSupplyChanges({
      baseline,
      current,
      latest: { ...baseline, supplyNumber: 'SERVER-NUMBER', version: 2 },
    });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values.supplyEntries).toEqual(current.supplyEntries);
    expect(merged.changedFields).toContain('supplyEntries');
  });

  it('does not create conflicts for equivalent numeric and text formatting', () => {
    const current = getSupplyFormDefaults(baseline);
    current.supplyEntries[0].unitPrice = '5.00';
    current.supplyNumber = ' SUP-9 ';
    const latest = {
      ...baseline,
      supplyNumber: 'NEW',
      supplyEntries: [{ ...baseline.supplyEntries[0], quantity: 4 }],
      version: 2,
    };
    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.values).toEqual(getSupplyFormDefaults(latest));
    expect(merged.changedFields).toEqual([]);
  });

  it('treats matching local and saved changes as already saved', () => {
    const current = {
      ...getSupplyFormDefaults(baseline),
      comment: 'Same edit',
    };
    const latest = { ...baseline, comment: 'Same edit', version: 2 };
    const merged = mergeSupplyChanges({ baseline, current, latest });

    expect(merged.conflicts).toEqual([]);
    expect(merged.changedFields).toEqual([]);
  });
});

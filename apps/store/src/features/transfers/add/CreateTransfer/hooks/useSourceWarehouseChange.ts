'use client';

import { useRef, useState } from 'react';
import type {
  PendingSourceWarehouseChange,
  TransferForm,
  TransferWarehouseSelection,
} from '../types';
import { createEmptyTransferEntry } from '../utils/entries';

/**
 * Transfer rows are lines of the source warehouse stock, so switching the
 * source drops them. Ask before discarding picked products.
 */
export const useSourceWarehouseChange = (form: TransferForm) => {
  const nextClientId = useRef(0);
  const [pendingChange, setPendingChange] =
    useState<PendingSourceWarehouseChange | null>(null);

  const clearEntries = async () => {
    const count = form.getFieldValue('transferEntries').length;
    // Removing rows (instead of replacing the array) also drops their errors.
    for (let index = count - 1; index >= 0; index -= 1) {
      await form.removeFieldValue('transferEntries', index);
    }
    form.pushFieldValue(
      'transferEntries',
      createEmptyTransferEntry(`source-change-${nextClientId.current++}`)
    );
  };

  const applyChange = async (
    warehouse: TransferWarehouseSelection | null,
    removeEntries: boolean
  ) => {
    form.setFieldValue('sourceWarehouse', warehouse);
    if (removeEntries) {
      await clearEntries();
    }
  };

  const requestChange = (warehouse: TransferWarehouseSelection | null) => {
    const currentWarehouse = form.getFieldValue('sourceWarehouse');
    if (currentWarehouse?.id === warehouse?.id) {
      form.setFieldValue('sourceWarehouse', warehouse);
      return;
    }

    const hasPickedProducts = form
      .getFieldValue('transferEntries')
      .some((entry) => entry.stockItem !== null);

    if (!hasPickedProducts) {
      void applyChange(warehouse, false);
      return;
    }

    setPendingChange({ warehouse });
  };

  const confirmChange = async () => {
    if (!pendingChange) {
      return;
    }

    setPendingChange(null);
    await applyChange(pendingChange.warehouse, true);
  };

  const cancelChange = () => setPendingChange(null);

  return { pendingChange, requestChange, confirmChange, cancelChange };
};

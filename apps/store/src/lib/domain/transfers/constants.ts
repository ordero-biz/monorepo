export const TRANSFER_SOURCE_WAREHOUSE_SEARCH_PARAM = 'sourceWarehouseId';

export const getTransferSourceWarehouseId = (
  value?: string | string[] | null
) => {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const warehouseId = Number(rawValue);

  return Number.isInteger(warehouseId) && warehouseId > 0
    ? warehouseId
    : undefined;
};

import {
  getAttributeDetailRoute,
  getSupplierDetailRoute,
  getSupplyDetailRoute,
  getWarehouseDetailRoute,
} from './routes';

describe('client detail routes', () => {
  it.each([
    ['attribute', getAttributeDetailRoute, 1, '/products/attributes/1'],
    ['attribute', getAttributeDetailRoute, 'size', '/products/attributes/size'],
    ['supplier', getSupplierDetailRoute, 1, '/warehouse/suppliers/1'],
    ['supply', getSupplyDetailRoute, 1, '/warehouse/supplies/1'],
    [
      'supply',
      getSupplyDetailRoute,
      'new-delivery',
      '/warehouse/supplies/new-delivery',
    ],
    [
      'supplier',
      getSupplierDetailRoute,
      'fresh-farms',
      '/warehouse/suppliers/fresh-farms',
    ],
    ['warehouse', getWarehouseDetailRoute, 1, '/warehouse/1'],
    ['warehouse', getWarehouseDetailRoute, 'main', '/warehouse/main'],
  ])('builds the %s detail route for %s', (_, getRoute, id, route) => {
    expect(getRoute(id)).toBe(route);
  });
});

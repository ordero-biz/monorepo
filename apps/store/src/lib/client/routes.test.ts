import {
  getAttributeDetailRoute,
  getSupplierDetailRoute,
  getWarehouseDetailRoute,
} from './routes';

describe('client detail routes', () => {
  it.each([
    ['attribute', getAttributeDetailRoute, 1, '/products/attributes/1'],
    ['attribute', getAttributeDetailRoute, 'size', '/products/attributes/size'],
    ['supplier', getSupplierDetailRoute, 1, '/products/suppliers/1'],
    [
      'supplier',
      getSupplierDetailRoute,
      'fresh-farms',
      '/products/suppliers/fresh-farms',
    ],
    ['warehouse', getWarehouseDetailRoute, 1, '/products/warehouse/1'],
    ['warehouse', getWarehouseDetailRoute, 'main', '/products/warehouse/main'],
  ])('builds the %s detail route for %s', (_, getRoute, id, route) => {
    expect(getRoute(id)).toBe(route);
  });
});

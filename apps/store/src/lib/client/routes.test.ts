import { getAttributeDetailRoute, getSupplierDetailRoute } from './routes';

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
  ])('builds the %s detail route for %s', (_, getRoute, id, route) => {
    expect(getRoute(id)).toBe(route);
  });
});

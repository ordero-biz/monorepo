import { tokenizePath } from './tokenizePath';

describe('tokenizePath', () => {
  it('replaces named path tokens with encoded values', () => {
    expect(
      tokenizePath('/api/items/{id}/values/{value}', { id: 'a/b', value: 10 })
    ).toBe('/api/items/a%2Fb/values/10');
  });

  it('throws when a path token value is missing', () => {
    expect(() => tokenizePath('/api/items/{id}', {})).toThrow(
      'Missing value for path token "id".'
    );
  });
});

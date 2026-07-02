import {
  DEFAULT_PAGE,
  getPaginationSearch,
  getPaginationSearchInput,
} from './url';

describe('url utils', () => {
  it('builds default pagination search params', () => {
    expect(getPaginationSearch()).toBe('page=0&size=25');
    expect(DEFAULT_PAGE).toEqual({
      page: 0,
      size: 25,
    });
  });

  it('builds pagination search params with repeated sort values', () => {
    expect(
      getPaginationSearch({
        page: 2,
        size: 10,
        sort: ['name,asc', 'code,desc'],
      })
    ).toBe('page=2&size=10&sort=name%2Casc&sort=code%2Cdesc');
  });

  it('reads pagination input from URLSearchParams', () => {
    expect(
      getPaginationSearchInput(
        new URLSearchParams('page=2&size=10&sort=name%2Casc&sort=code%2Cdesc')
      )
    ).toEqual({
      page: 2,
      size: 10,
      sort: ['name,asc', 'code,desc'],
    });
  });

  it('reads pagination input from route search params', () => {
    expect(
      getPaginationSearchInput({
        page: '3',
        size: '15',
        sort: ['name,asc', 'code,desc'],
      })
    ).toEqual({
      page: 3,
      size: 15,
      sort: ['name,asc', 'code,desc'],
    });
  });

  it('falls back to default pagination for missing or invalid values', () => {
    expect(
      getPaginationSearchInput({
        page: '-1',
        size: '0',
      })
    ).toEqual({
      page: 0,
      size: 25,
    });
  });
});

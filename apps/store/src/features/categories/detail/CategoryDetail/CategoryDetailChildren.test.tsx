import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategoryChildren } from '@/lib/client/api/categories';
import { CATEGORY_STATUS, type Category } from '@/lib/domain/categories';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryDetailChildren } from './CategoryDetailChildren';

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  getCategoryChildren: vi.fn(),
}));

const getCategoryChildrenMock = vi.mocked(getCategoryChildren);

const { setup } = prepareStoreSetup({
  component: CategoryDetailChildren,
  props: {
    categoryId: '2',
  },
});

const children: Category[] = [
  {
    id: 3,
    name: 'Running shoes',
    sortOrder: 20,
    status: CATEGORY_STATUS.ACTIVE,
    color: '#15803d',
    createdAt: '2026-07-01T11:22:53.562Z',
    parentCategory: {
      id: 2,
      name: 'Shoes',
      createdAt: '2026-07-01T10:54:34.839Z',
    },
  },
];

describe('CategoryDetailChildren', () => {
  beforeEach(() => {
    getCategoryChildrenMock.mockReset();
  });

  it('shows child categories in a table with name, status, and creation date columns', async () => {
    getCategoryChildrenMock.mockResolvedValue({ ok: true, data: children });

    setup();

    expect(
      await screen.findByRole('table', { name: 'Child categories' })
    ).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeVisible();
    expect(
      screen.getByRole('columnheader', { name: 'Created at' })
    ).toBeVisible();
    expect(screen.getByRole('link', { name: 'Running shoes' })).toHaveAttribute(
      'href',
      '/products/categories/3'
    );
    expect(screen.getByText('Active')).toBeVisible();
    expect(screen.getByText('01 Jul 2026')).toBeVisible();
  });

  it('retries after the child categories request fails', async () => {
    getCategoryChildrenMock
      .mockResolvedValueOnce({
        ok: false,
        error: {
          status: 500,
          message: 'Could not load child categories.',
        },
      })
      .mockResolvedValueOnce({ ok: true, data: children });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText(
        "We couldn't load this category's children right now."
      )
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() =>
      expect(screen.getByRole('link', { name: 'Running shoes' })).toBeVisible()
    );
  });
});

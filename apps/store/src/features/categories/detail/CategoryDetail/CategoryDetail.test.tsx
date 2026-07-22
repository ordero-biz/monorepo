import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getCategory } from '@/lib/client/api/categories';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryDetail } from './CategoryDetail';

vi.mock('@/lib/client/api/categories', async () => ({
  ...(await vi.importActual<typeof import('@/lib/client/api/categories')>(
    '@/lib/client/api/categories'
  )),
  getCategory: vi.fn(),
}));

const getCategoryMock = vi.mocked(getCategory);

const category = {
  id: 2,
  name: 'Sneakers',
  sortOrder: 15,
  color: '#16a34a',
  createdAt: '2026-07-01T11:22:53.562Z',
  parentCategory: {
    id: 1,
    name: 'Shoes',
    createdAt: '2026-07-01T10:54:34.839Z',
  },
};

const { setup } = prepareStoreSetup({
  component: CategoryDetail,
  props: {
    categoryId: '2',
  },
});

describe('CategoryDetail', () => {
  beforeEach(() => {
    getCategoryMock.mockReset();
  });

  it('renders category details and its edit action', async () => {
    getCategoryMock.mockResolvedValue({ ok: true, data: category });
    setup();

    expect(
      await screen.findByRole('heading', { name: 'Sneakers' })
    ).toBeVisible();
    expect(screen.getByText('Category details')).toBeVisible();
    expect(screen.getByText('Shoes')).toBeVisible();

    await userEvent
      .setup()
      .click(screen.getByRole('button', { name: 'Edit Sneakers' }));

    expect(screen.getByRole('dialog', { name: 'Edit category' })).toBeVisible();
  });

  it('retries loading after a category request fails', async () => {
    getCategoryMock
      .mockResolvedValueOnce({
        ok: false,
        error: { status: 500, message: 'Could not load category.' },
      })
      .mockResolvedValueOnce({ ok: true, data: category });
    const user = userEvent.setup();

    setup();

    expect(
      await screen.findByText("We couldn't load this category right now.")
    ).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Retry' }));

    await waitFor(() => expect(getCategoryMock).toHaveBeenCalledTimes(2));
  });
});

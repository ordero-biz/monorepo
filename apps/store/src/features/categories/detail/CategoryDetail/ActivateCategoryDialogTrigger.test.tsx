import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { ActivateCategoryDialogTrigger } from './ActivateCategoryDialogTrigger';

const { setup } = prepareStoreSetup({
  component: ActivateCategoryDialogTrigger,
  props: {
    onUpdated: vi.fn(),
    category: {
      id: 2,
      name: 'Sneakers',
      sortOrder: 15,
      status: CATEGORY_STATUS.DRAFT,
      createdAt: '2026-07-01T11:22:53.562Z',
      parentCategory: null,
    },
  },
});

describe('ActivateCategoryDialogTrigger', () => {
  it('opens a confirmation dialog before publishing', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Publish' }));

    expect(
      screen.getByRole('dialog', { name: 'Publish category' })
    ).toBeVisible();
  });
});

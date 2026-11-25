import { screen } from '@testing-library/react';
import { CATEGORY_STATUS } from '@/lib/domain/categories/constants';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { CategoryDetailInfo } from './CategoryDetailInfo';
import type { CategoryDetailInfoProps } from './types';

const { setup } = prepareStoreSetup<CategoryDetailInfoProps>({
  component: CategoryDetailInfo,
  props: {
    category: {
      id: 2,
      name: 'Sneakers',
      sortOrder: 15,
      status: CATEGORY_STATUS.DRAFT,
      createdAt: '2026-07-01T11:22:53.562Z',
      parentCategory: {
        id: 1,
        name: 'Shoes',
        createdAt: '2026-07-01T10:54:34.839Z',
      },
    },
  },
});

describe('CategoryDetailInfo', () => {
  it('renders the parent category', () => {
    setup();

    expect(screen.getByText('Category details')).toBeVisible();
    expect(screen.getByText('Parent category')).toBeVisible();
    expect(screen.getByText('Shoes')).toBeVisible();
  });

  it('renders a placeholder when the category has no parent', () => {
    setup({
      category: {
        id: 2,
        name: 'Sneakers',
        sortOrder: 15,
        status: CATEGORY_STATUS.DRAFT,
        createdAt: '2026-07-01T11:22:53.562Z',
        parentCategory: null,
      },
    });

    expect(screen.getByText('-')).toBeVisible();
  });
});

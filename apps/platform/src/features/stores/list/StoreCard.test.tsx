import { screen } from '@testing-library/react';
import { preparePlatformSetup } from '@/test/prepareSetup';
import { StoreCard } from './StoreCard';

const { setup } = preparePlatformSetup({
  component: StoreCard,
  props: {
    store: {
      id: 1,
      name: 'North Shop',
      subDomain: 'north-shop',
    },
  },
});

describe('StoreCard', () => {
  it('renders the store name, subdomain, and options action', () => {
    setup();

    expect(screen.getByRole('heading', { name: 'North Shop' })).toBeVisible();
    expect(screen.getByText('north-shop.ordero.biz')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'North Shop options' })
    ).toBeVisible();
  });
});

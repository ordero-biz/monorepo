import { screen, within } from '@testing-library/react';
import { BaseLayout } from '@/components/BaseLayout';
import { prepareStoreSetup } from '@/test/prepareSetup';

const { setup } = prepareStoreSetup({
  component: BaseLayout,
  props: {
    children: <div>Store content</div>,
  },
});

describe('BaseLayout', () => {
  it('displays the side navigation, header, and page content', () => {
    setup();

    const sidebar = screen.getByRole('complementary');
    const main = screen.getByRole('main');

    expect(
      within(sidebar).getByRole('link', { name: 'Dashboard' })
    ).toBeVisible();
    expect(within(main).getByRole('heading', { name: 'Store' })).toBeVisible();
    expect(within(main).getByText('Store content')).toBeVisible();
  });
});

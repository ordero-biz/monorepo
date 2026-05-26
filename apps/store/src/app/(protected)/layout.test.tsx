import { screen } from '@testing-library/react';
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
    const { renderResult } = setup();

    expect(renderResult.container.querySelector('#store-sidebar')).toBeVisible();
    expect(
      renderResult.container.querySelector('#store-page-header')
    ).toBeVisible();
    expect(screen.getByText('Store content')).toBeVisible();
  });
});

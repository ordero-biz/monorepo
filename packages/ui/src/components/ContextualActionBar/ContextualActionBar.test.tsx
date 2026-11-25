import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import { ContextualActionBar } from './index';

type ContextualActionBarFixtureProps = {
  ariaLabel?: string;
};

const ContextualActionBarFixture = ({
  ariaLabel = 'Selected invoice actions',
}: ContextualActionBarFixtureProps) => (
  <ContextualActionBar.Root ariaLabel={ariaLabel}>
    <ContextualActionBar.Left>
      <span>3 selected</span>
      <button type="button">Clear selection</button>
    </ContextualActionBar.Left>
    <ContextualActionBar.Right>
      <button type="button">Delete</button>
    </ContextualActionBar.Right>
  </ContextualActionBar.Root>
);

describe('ContextualActionBar', () => {
  const { setup } = prepareSetup<ContextualActionBarFixtureProps>({
    component: ContextualActionBarFixture,
    props: {},
  });

  it('groups contextual content and actions in a labelled landmark', () => {
    const { ariaLabel } = setup({
      ariaLabel: 'Selected invoices actions',
    });

    expect(
      screen.getByRole('complementary', { name: ariaLabel })
    ).toHaveTextContent('3 selected');
    expect(
      screen.getByRole('button', { name: 'Clear selection' })
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeVisible();
  });
});

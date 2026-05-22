import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Card } from './index';

type CardTestFixtureProps = {
  includeAction?: boolean;
  variant?: 'filled' | 'outlined';
  onClick?: () => void;
  dividerVariant?: 'solid' | 'dashed';
  title?: string;
};

const CardTestFixture = ({
  includeAction = true,
  variant = 'filled',
  onClick,
  dividerVariant = 'dashed',
  title = 'Card Title',
}: CardTestFixtureProps) => (
  <Card.Root variant={variant} onClick={onClick}>
    <Card.Header>
      <Card.Title>{title}</Card.Title>
      <Card.Description>Card Description</Card.Description>
    </Card.Header>
    <Card.Divider variant={dividerVariant} />
    <Card.Content>
      <p>Card content goes here.</p>
    </Card.Content>
    {includeAction ? (
      <Card.Footer>
        <button type="button">Action</button>
      </Card.Footer>
    ) : null}
  </Card.Root>
);

describe('Card', () => {
  const { setup } = prepareSetup<CardTestFixtureProps>({
    component: CardTestFixture,
    props: {},
  });

  it('renders all compound card sections with correct semantic content', () => {
    setup({});

    expect(
      screen.getByRole('heading', { name: 'Card Title' })
    ).toBeInTheDocument();
    expect(screen.getByText('Card Description')).toBeInTheDocument();
    expect(screen.getByText('Card content goes here.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('does not expose the card as a button unless it is clickable', () => {
    setup({ includeAction: false });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('handles click events on the root card element', async () => {
    const user = userEvent.setup();

    const { onClick, title } = setup({
      includeAction: false,
      onClick: vi.fn(),
      title: 'Open details',
    });

    await user.click(screen.getByRole('button', { name: new RegExp(title) }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard activation when the root card is clickable', async () => {
    const user = userEvent.setup();

    const { onClick, title } = setup({
      includeAction: false,
      onClick: vi.fn(),
      title: 'Open details',
    });

    await user.tab();
    expect(screen.getByRole('button', { name: new RegExp(title) })).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

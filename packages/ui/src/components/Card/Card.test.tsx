import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Card } from './index';

type CardTestFixtureProps = {
  variant?: 'filled' | 'outlined';
  onClick?: () => void;
  dividerVariant?: 'solid' | 'dashed';
};

const CardTestFixture = ({
  variant = 'filled',
  onClick,
  dividerVariant = 'dashed',
}: CardTestFixtureProps) => (
  <Card.Root variant={variant} onClick={onClick}>
    <Card.Header>
      <Card.Title>Card Title</Card.Title>
      <Card.Description>Card Description</Card.Description>
    </Card.Header>
    <Card.Divider variant={dividerVariant} />
    <Card.Content>
      <p>Card content goes here.</p>
    </Card.Content>
    <Card.Footer>
      <button type="button">Action</button>
    </Card.Footer>
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

  it('applies the correct classes for the filled variant by default', () => {
    const { renderResult } = setup({ variant: 'filled' });
    const card = renderResult.container.firstChild;
    expect(card).toHaveClass('bg-[var(--card)]');
    expect(card).toHaveClass(
      'shadow-[var(--card-x1)_var(--card-y1)_var(--card-blur1)_var(--card-spread1)_var(--color-shadow-20),var(--card-x2)_var(--card-y2)_var(--card-blur2)_var(--card-spread2)_var(--color-shadow-12)]'
    );
  });

  it('applies the correct classes for the outlined variant', () => {
    const { renderResult } = setup({ variant: 'outlined' });
    const card = renderResult.container.firstChild;
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-[var(--color-divider)]');
    expect(card).toHaveClass('bg-transparent');
  });

  it('renders dashed divider by default', () => {
    const { renderResult } = setup({ dividerVariant: 'dashed' });
    const divider = renderResult.container.querySelector(
      '[data-slot="card-divider"]'
    );
    expect(divider).toHaveClass('border-dashed');
  });

  it('renders solid divider when requested', () => {
    const { renderResult } = setup({ dividerVariant: 'solid' });
    const divider = renderResult.container.querySelector(
      '[data-slot="card-divider"]'
    );
    expect(divider).not.toHaveClass('border-dashed');
  });

  it('handles click events on the root card element', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    const { renderResult } = setup({ onClick: handleClick });
    const card = renderResult.container.firstChild;

    if (card) {
      await user.click(card as HTMLElement);
    }
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

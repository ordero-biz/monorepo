import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from './index';
import type { AccordionRootProps } from './types';

const accordionItems = (
  <>
    <Accordion.Item value="shipping">
      <Accordion.Header>
        <Accordion.Trigger>Shipping</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Delivery takes 3–5 business days.</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="returns">
      <Accordion.Header>
        <Accordion.Trigger>Returns</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Returns are accepted within 30 days.</Accordion.Panel>
    </Accordion.Item>
  </>
);

describe('Accordion', () => {
  const { setup } = prepareSetup<AccordionRootProps>({
    component: Accordion.Root,
    props: {
      'aria-label': 'Frequently asked questions',
      children: accordionItems,
    },
  });

  it('reveals its panel when users expand an item', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Shipping' }));

    expect(screen.getByRole('region', { name: 'Shipping' })).toHaveTextContent(
      'Delivery takes 3–5 business days.'
    );
  });

  it('only keeps one item open by default', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await user.click(screen.getByRole('button', { name: 'Returns' }));

    expect(screen.getByRole('region', { name: 'Returns' })).toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'Shipping' })
    ).not.toBeInTheDocument();
  });

  it('allows multiple items to remain open when requested', async () => {
    const user = userEvent.setup();

    setup({ multiple: true });

    await user.click(screen.getByRole('button', { name: 'Shipping' }));
    await user.click(screen.getByRole('button', { name: 'Returns' }));

    expect(
      screen.getByRole('region', { name: 'Shipping' })
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Returns' })).toBeInTheDocument();
  });

  it('does not expand disabled items', async () => {
    const user = userEvent.setup();

    setup({
      children: (
        <Accordion.Item disabled value="disabled">
          <Accordion.Header>
            <Accordion.Trigger>Unavailable section</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel>Unavailable details</Accordion.Panel>
        </Accordion.Item>
      ),
    });

    const trigger = screen.getByRole('button', { name: 'Unavailable section' });

    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-disabled', 'true');
    expect(
      screen.queryByRole('region', { name: 'Unavailable section' })
    ).not.toBeInTheDocument();
  });
});

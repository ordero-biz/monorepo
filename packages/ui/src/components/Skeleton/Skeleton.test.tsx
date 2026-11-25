import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Skeleton } from './Skeleton';

const LoadingSection = () => (
  <section aria-label="Loading preview" aria-busy="true">
    <output>Loading details</output>
    <button type="button">Before</button>
    <Skeleton width="40%" />
    <Skeleton shape="circle" width="var(--space-5)" height="var(--space-5)" />
    <Skeleton animated={false} />
    <button type="button">After</button>
  </section>
);
const { setup } = prepareSetup({ component: LoadingSection });

it('leaves loading announcements to the owning region and adds no keyboard stops', async () => {
  const user = userEvent.setup();
  setup();
  expect(screen.getAllByRole('status')).toHaveLength(1);
  expect(screen.getByRole('status')).toHaveTextContent('Loading details');
  await user.tab();
  expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
});

const LoadingContent = () => {
  const [loading, setLoading] = useState(true);
  const toggleLoading = () => setLoading((previous) => !previous);
  return (
    <>
      <button type="button" onClick={toggleLoading}>
        Toggle loading
      </button>
      <Skeleton loading={loading}>
        <input aria-label="Product name" defaultValue="Coffee" />
      </Skeleton>
    </>
  );
};
const { setup: setupContent } = prepareSetup({ component: LoadingContent });

it('exposes children after loading and preserves their state across loading changes', async () => {
  const user = userEvent.setup();
  setupContent();
  expect(
    screen.queryByRole('textbox', { name: 'Product name' })
  ).not.toBeInTheDocument();
  const toggle = screen.getByRole('button', { name: 'Toggle loading' });
  await user.click(toggle);
  await user.type(
    screen.getByRole('textbox', { name: 'Product name' }),
    ' beans'
  );
  await user.click(toggle);
  expect(
    screen.queryByRole('textbox', { name: 'Product name' })
  ).not.toBeInTheDocument();
  await user.click(toggle);
  expect(screen.getByRole('textbox', { name: 'Product name' })).toHaveValue(
    'Coffee beans'
  );
});

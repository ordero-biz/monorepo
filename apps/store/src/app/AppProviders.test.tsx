import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { AppProviders } from './AppProviders';

const clients: QueryClient[] = [];

const QueryClientProbe = () => {
  clients.push(useQueryClient());

  return null;
};

describe('AppProviders', () => {
  beforeEach(() => {
    clients.length = 0;
  });

  it('renders children without recreating the browser query client', () => {
    const { rerender } = render(
      <AppProviders>
        <QueryClientProbe />
      </AppProviders>
    );

    rerender(
      <AppProviders>
        <QueryClientProbe />
      </AppProviders>
    );

    expect(clients).toHaveLength(2);
    expect(clients[0]).toBe(clients[1]);
  });
});

import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { Providers } from './providers';

const clients: QueryClient[] = [];

const QueryClientProbe = () => {
  clients.push(useQueryClient());

  return null;
};

describe('Providers', () => {
  beforeEach(() => {
    clients.length = 0;
  });

  it('renders children without recreating the browser query client', () => {
    const { rerender } = render(
      <Providers>
        <QueryClientProbe />
      </Providers>
    );

    rerender(
      <Providers>
        <QueryClientProbe />
      </Providers>
    );

    expect(clients).toHaveLength(2);
    expect(clients[0]).toBe(clients[1]);
  });
});

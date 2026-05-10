import { prepareSetup } from '@ordero/test-config/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ComponentType, ReactNode } from 'react';

type TestQueryProviderProps = {
  children: ReactNode;
};

type PreparePlatformSetupArgs<T extends object> = {
  component: ComponentType<T>;
  props?: T;
};

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60_000,
      },
    },
  });

export const createTestQueryProvider = (queryClient: QueryClient) => {
  return ({ children }: TestQueryProviderProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export const preparePlatformSetup = <T extends object>({
  component,
  props,
}: PreparePlatformSetupArgs<T>) => {
  const setup = <const U extends Partial<T>>(caseProps: U = {} as U) => {
    const queryClient = createTestQueryClient();
    const TestQueryProvider = createTestQueryProvider(queryClient);
    const { setup: baseSetup } = prepareSetup({
      component,
      props,
      wrapper: TestQueryProvider,
    });

    return {
      queryClient,
      ...baseSetup(caseProps),
    };
  };

  return { setup };
};

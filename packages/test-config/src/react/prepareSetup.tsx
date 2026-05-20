import type { RenderResult } from '@testing-library/react';
import { render } from '@testing-library/react';
import type { ComponentType, ReactNode } from 'react';

type TestWrapperProps = {
  children: ReactNode;
};

type TestWrapper = ComponentType<TestWrapperProps>;

type PrepareSetupArgs<T extends object> = {
  component: ComponentType<T>;
  props?: T;
  wrapper?: TestWrapper;
};

type CombinedProps<T extends object, U extends Partial<T>> = Omit<T, keyof U> &
  U;

type SetupRenderResult<T extends object> = Omit<
  RenderResult,
  'rerender'
> & {
  rerender: (rerenderProps?: Partial<T>) => void;
};

type SetupResult<T extends object, U extends Partial<T>> = CombinedProps<T, U> & {
  renderResult: SetupRenderResult<T>;
};

export const prepareSetup = <T extends object>({
  component,
  props = {} as T,
  wrapper,
}: PrepareSetupArgs<T>) => {
  const setup = <const U extends Partial<T>>(
    caseProps: U = {} as U
  ): SetupResult<T, U> => {
    const combinedProps = {
      ...props,
      ...caseProps,
    } as CombinedProps<T, U>;

    const CaseComponent = component;
    const renderResult = render(
      <CaseComponent {...(combinedProps as unknown as T)} />,
      { wrapper }
    );
    const rerender = (rerenderProps: Partial<T> = {}) =>
      renderResult.rerender(
        <CaseComponent
          {...(combinedProps as unknown as T)}
          {...(rerenderProps as Partial<CombinedProps<T, U>>)}
        />
      );

    return {
      ...combinedProps,
      renderResult: {
        ...renderResult,
        rerender,
      },
    };
  };

  return { setup };
};

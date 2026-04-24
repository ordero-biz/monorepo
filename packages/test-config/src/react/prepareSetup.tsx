import { render } from '@testing-library/react';
import type { ComponentType } from 'react';

type PrepareSetupArgs<T extends object> = {
  component: ComponentType<T>;
  props?: T;
};

type CombinedProps<T extends object, U extends Partial<T>> = {
  [K in keyof (T & U)]: (T & U)[K];
};

export const prepareSetup = <T extends object>({
  component,
  props = {} as T,
}: PrepareSetupArgs<T>) => {
  const setup = <U extends Partial<T>>(caseProps: U = {} as U) => {
    const combinedProps = {
      ...props,
      ...caseProps,
    } as CombinedProps<T, U>;

    const CaseComponent = component;
    const renderResult = render(<CaseComponent {...combinedProps} />);
    const rerender = (rerenderProps: Partial<T> = {}) =>
      renderResult.rerender(
        <CaseComponent
          {...combinedProps}
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

import { act, screen } from '@testing-library/react';
import { type ReactNode, useEffect, useState } from 'react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { useInitialFocus } from './useInitialFocus';

type FocusRegionProps = {
  children?: ReactNode;
  preferInvalid?: boolean;
};

const FocusRegion = ({ children, preferInvalid }: FocusRegionProps) => {
  const ref = useInitialFocus({ preferInvalid });
  return <div ref={ref}>{children}</div>;
};

const { setup } = prepareStoreSetup({ component: FocusRegion });
const focusOnNextFrame = () => act(() => vi.advanceTimersToNextFrame());

describe('useInitialFocus', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('focuses the first available control in DOM order', () => {
    setup({
      children: (
        <>
          <input aria-label="Disabled" disabled />
          <fieldset disabled>
            <input aria-label="Disabled by fieldset" />
          </fieldset>
          <div hidden>
            <input aria-label="Hidden" />
          </div>
          <div inert>
            <input aria-label="Inert" />
          </div>
          <button aria-disabled="true" type="button">
            Unavailable
          </button>
          <input aria-label="Outside tab order" tabIndex={-1} />
          <input aria-label="Product name" />
          <textarea aria-label="Description" />
        </>
      ),
    });
    focusOnNextFrame();
    expect(screen.getByRole('textbox', { name: 'Product name' })).toHaveFocus();
  });

  it('prioritizes the first available invalid field when requested', () => {
    setup({
      preferInvalid: true,
      children: (
        <>
          <input aria-label="Product name" />
          <input aria-label="Unavailable error" aria-invalid="true" disabled />
          <input aria-label="Category" aria-invalid="true" />
          <textarea aria-label="Description" aria-invalid="true" />
        </>
      ),
    });
    focusOnNextFrame();
    expect(screen.getByRole('textbox', { name: 'Category' })).toHaveFocus();
  });

  it('focuses the selected control inside an invalid group', () => {
    setup({
      preferInvalid: true,
      children: (
        <>
          <input aria-label="Product name" />
          <div role="radiogroup" aria-label="Status" aria-invalid="true">
            <input
              type="radio"
              aria-label="Draft"
              name="status"
              tabIndex={-1}
            />
            <input
              type="radio"
              aria-label="Active"
              name="status"
              defaultChecked
            />
          </div>
        </>
      ),
    });
    focusOnNextFrame();
    expect(screen.getByRole('radio', { name: 'Active' })).toHaveFocus();
  });

  it('falls back to the first control when no invalid control is available', () => {
    setup({
      preferInvalid: true,
      children: (
        <>
          <input aria-label="Product name" />
          <textarea aria-label="Description" aria-invalid="true" disabled />
        </>
      ),
    });
    focusOnNextFrame();
    expect(screen.getByRole('textbox', { name: 'Product name' })).toHaveFocus();
  });

  it('waits for initial validation errors to render', () => {
    const ValidatedFields = () => {
      const [invalid, setInvalid] = useState(false);
      useEffect(() => setInvalid(true), []);
      return (
        <>
          <input aria-label="Product name" />
          <textarea aria-label="Description" aria-invalid={invalid} />
        </>
      );
    };
    setup({ preferInvalid: true, children: <ValidatedFields /> });
    focusOnNextFrame();
    expect(screen.getByRole('textbox', { name: 'Description' })).toHaveFocus();
  });

  it('preserves focus already placed inside the wrapper', () => {
    setup({
      children: (
        <>
          <input aria-label="Product name" />
          <textarea aria-label="Description" />
        </>
      ),
    });
    const description = screen.getByRole('textbox', { name: 'Description' });
    act(() => description.focus());
    focusOnNextFrame();
    expect(description).toHaveFocus();
  });

  it('does not reset focus when the wrapper rerenders', () => {
    const { renderResult } = setup({
      children: <input aria-label="Product name" />,
    });
    focusOnNextFrame();
    renderResult.rerender({
      children: (
        <>
          <input aria-label="Category" />
          <input aria-label="Product name" />
        </>
      ),
    });
    const name = screen.getByRole('textbox', { name: 'Product name' });
    act(() => name.focus());
    focusOnNextFrame();
    expect(name).toHaveFocus();
  });

  it('handles an empty wrapper or unmount before focus without errors', () => {
    const { renderResult } = setup();
    focusOnNextFrame();
    renderResult.unmount();
    const mounted = setup({ children: <input aria-label="Product name" /> });
    mounted.renderResult.unmount();
    expect(focusOnNextFrame).not.toThrow();
  });
});

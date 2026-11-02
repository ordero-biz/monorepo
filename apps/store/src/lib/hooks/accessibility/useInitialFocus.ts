'use client';

import { useEffect, useRef } from 'react';

const focusableSelector =
  'input:not([type="hidden"]), select, textarea, button, a[href], [tabindex], [contenteditable="true"]';

type UseInitialFocusOptions = {
  preferInvalid?: boolean;
};

/** Focus on mount, in DOM order, optionally prioritizing invalid fields. */
export const useInitialFocus = <T extends HTMLElement = HTMLDivElement>({
  preferInvalid = false,
}: UseInitialFocusOptions = {}) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Wait for mount effects to populate validation errors before choosing a control.
    const frame = requestAnimationFrame(() => {
      const { ownerDocument } = container;
      if (container.contains(ownerDocument.activeElement)) return;

      const controls = Array.from(
        container.querySelectorAll<HTMLElement>(focusableSelector)
      );
      const focus = (control: HTMLElement) => {
        if (
          control.tabIndex < 0 ||
          control.matches(':disabled') ||
          control.closest('[hidden], [inert], [aria-disabled="true"]') ||
          control.checkVisibility?.({ visibilityProperty: true }) === false
        ) {
          return false;
        }

        control.focus();
        return ownerDocument.activeElement === control;
      };

      const focusedInvalid =
        preferInvalid &&
        controls.some((control) => {
          const invalidField = control.closest('[aria-invalid="true"]');
          return (
            invalidField !== null &&
            container.contains(invalidField) &&
            focus(control)
          );
        });

      if (!focusedInvalid) controls.some(focus);
    });

    return () => cancelAnimationFrame(frame);
  }, [preferInvalid]);

  return ref;
};

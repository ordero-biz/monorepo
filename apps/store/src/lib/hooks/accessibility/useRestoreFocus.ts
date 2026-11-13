'use client';

import { useEffect, useRef } from 'react';

/** Attach the returned ref to the trigger; focus it when isOpen changes from true to false. */
export const useRestoreFocus = <T extends HTMLElement = HTMLElement>(
  isOpen: boolean
) => {
  const triggerRef = useRef<T>(null);
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) triggerRef.current?.focus();
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  return triggerRef;
};

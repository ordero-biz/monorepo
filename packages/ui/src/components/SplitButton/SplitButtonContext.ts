'use client';

import { createContext, useContext } from 'react';
import type { SplitButtonContextValue } from './types';

export const SplitButtonContext = createContext<SplitButtonContextValue | null>(
  null
);

export const useSplitButtonContext = () => {
  const context = useContext(SplitButtonContext);

  if (!context) {
    throw new Error('SplitButton parts must be used inside SplitButton.Root.');
  }

  return context;
};

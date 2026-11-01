'use client';

import { createContext, use } from 'react';
import type { FormConflictResolverContextValue } from './types';

export const FormConflictResolverContext =
  createContext<FormConflictResolverContextValue | null>(null);

export const useFormConflictResolver = () => use(FormConflictResolverContext);

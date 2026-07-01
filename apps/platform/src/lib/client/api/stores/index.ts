'use client';

import { apiFetch } from '@ordero/api-client';
import type { CreateStoreInput, Store } from '@/lib/server/types';
import { CLIENT_BACKEND_PATHS } from '../path';

export const getStores = () =>
  apiFetch<Store[]>(CLIENT_BACKEND_PATHS.stores, {
    method: 'GET',
  });

export const createStore = (input: CreateStoreInput) =>
  apiFetch<Store>(CLIENT_BACKEND_PATHS.stores, {
    method: 'POST',
    body: input,
  });

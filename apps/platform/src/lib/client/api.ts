'use client';

import type {
  AuthSession,
  AuthSignInInput,
  AuthSignUpInput,
  CreateStoreInput,
  Store,
} from '@/lib/api/types';
import { CLIENT_AUTH_PATHS, CLIENT_BACKEND_PATHS } from './apiPaths';
import { apiFetch } from './fetch';

export const signIn = (input: AuthSignInInput) =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.signIn, {
    method: 'POST',
    body: input,
  });

export const signUp = (input: AuthSignUpInput) =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.signUp, {
    method: 'POST',
    body: input,
  });

export const logout = () =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.logout, {
    method: 'POST',
  });

export const getSession = () =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.session, {
    method: 'GET',
  });

export const getStores = () =>
  apiFetch<Store[]>(CLIENT_BACKEND_PATHS.stores, {
    method: 'GET',
  });

export const createStore = (input: CreateStoreInput) =>
  apiFetch<Store>(CLIENT_BACKEND_PATHS.stores, {
    method: 'POST',
    body: input,
  });

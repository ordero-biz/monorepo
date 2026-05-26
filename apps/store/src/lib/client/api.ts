'use client';

import { CLIENT_AUTH_PATHS } from '@/lib/api/constants';
import type { AuthSession, AuthSignInInput } from '@/lib/api/types';
import { apiFetch } from './fetch';

export const signIn = (input: AuthSignInInput) =>
  apiFetch<AuthSession>(CLIENT_AUTH_PATHS.signIn, {
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

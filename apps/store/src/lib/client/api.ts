'use client';

import type { AuthSession, AuthSignInInput } from '@/lib/api/types';
import { CLIENT_AUTH_PATHS } from './apiPaths';
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

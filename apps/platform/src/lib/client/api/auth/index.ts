'use client';

import { apiFetch } from '@ordero/api-client';
import type {
  AuthSession,
  AuthSignInInput,
  AuthSignUpInput,
} from '@/lib/server/types';
import { CLIENT_AUTH_PATHS } from '../path';

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

import type { Token } from '@ordero/api-types';
import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE_NAME } from './server';
import type { ServerSessionResult } from './session';

export type HasAuthenticatedServerSessionArgs<TUser = unknown> = {
  cookieName?: string;
  getServerSession: (token?: Token) => Promise<ServerSessionResult<TUser>>;
};

export const hasAuthenticatedServerSession = async <TUser = unknown>({
  cookieName = AUTH_TOKEN_COOKIE_NAME,
  getServerSession,
}: HasAuthenticatedServerSessionArgs<TUser>) => {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  const result = await getServerSession(token);

  return result.ok && result.session.authenticated;
};

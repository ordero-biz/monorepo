import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE_NAME } from '@/lib/api/constants';
import { getServerSession } from '@/lib/api/session';

export const hasAuthenticatedServerSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;
  const result = await getServerSession(token);

  return result.ok && result.session.authenticated;
};

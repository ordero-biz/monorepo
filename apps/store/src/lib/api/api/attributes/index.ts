import type { ApiResult } from '@ordero/api-types';
import {
  AUTH_TOKEN_COOKIE_NAME,
  parseBackendResponseData,
} from '@ordero/next-api/server';
import { cookies } from 'next/headers';
import { BACKEND_ATTRIBUTE_PATHS } from '@/lib/api/backendPaths';
import { fetchBackendResponse } from '@/lib/api/server';
import type { Attribute, AttributeValue } from '@/lib/domain/attributes';
import { tokenizePath } from '@/lib/utils/tokenizePath';

const getServerToken = async () =>
  (await cookies()).get(AUTH_TOKEN_COOKIE_NAME)?.value;

const fetchAttributeResource = async <T>(
  path: string
): Promise<ApiResult<T>> => {
  const token = await getServerToken();

  if (!token) {
    return {
      ok: false,
      error: {
        status: 401,
        message: 'Authentication required.',
      },
    };
  }

  const result = await fetchBackendResponse({
    path,
    token,
    init: {
      method: 'GET',
    },
  });

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    data: await parseBackendResponseData<T>(result.data),
  };
};

export const getServerAttribute = (attributeId: string | number) =>
  fetchAttributeResource<Attribute>(
    tokenizePath(BACKEND_ATTRIBUTE_PATHS.attribute, { id: attributeId })
  );

export const getServerAttributeValues = (attributeId: string | number) =>
  fetchAttributeResource<AttributeValue[]>(
    tokenizePath(BACKEND_ATTRIBUTE_PATHS.attributeValues, { id: attributeId })
  );

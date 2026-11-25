import type { BackendRequestArgs as SharedBackendRequestArgs } from '@ordero/next-api/server';
import {
  FORWARDED_HEADER_NAMES,
  fetchBackendResponse as fetchSharedBackendResponse,
} from '@ordero/next-api/server';

const STORE_FORWARDED_HEADERS_NAMES = FORWARDED_HEADER_NAMES;

type StoreBackendRequestArgs = Omit<
  SharedBackendRequestArgs,
  'forwardedHeadersNames'
>;

export const fetchBackendResponse = (args: StoreBackendRequestArgs) =>
  fetchSharedBackendResponse({
    ...args,
    forwardedHeadersNames: STORE_FORWARDED_HEADERS_NAMES,
  });

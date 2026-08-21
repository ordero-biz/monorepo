import type { ApiError } from '@ordero/api-types';
import {
  API_ERROR_MESSAGES,
  type ApiErrorCode,
} from '@/lib/constants/apiErrorCodes';

export const getApiErrorMessage = (error: Pick<ApiError, 'code' | 'message'>) =>
  (error.code ? API_ERROR_MESSAGES[error.code as ApiErrorCode] : undefined) ??
  error.message;

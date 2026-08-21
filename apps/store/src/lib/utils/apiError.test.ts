import { API_ERROR_CODES } from '@/lib/constants/apiErrorCodes';
import { getApiErrorMessage } from './apiError';

describe('getApiErrorMessage', () => {
  it('returns the shared message for a known backend error code', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.ACTIVE_ATTRIBUTE_VALUE_REQUIRES_ACTIVE_ATTRIBUTE,
        message: 'Conflict',
      })
    ).toBe('Publish the attribute first to publish its values');
  });

  it('maps the active attribute modification error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.ATTRIBUTE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      })
    ).toBe('Active attributes cannot be edited');
  });

  it('maps the active attribute value modification error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.ATTRIBUTE_VALUE_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      })
    ).toBe('Active attribute values cannot be edited');
  });

  it('maps the active category modification error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.CATEGORY_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      })
    ).toBe('Active categories cannot be edited');
  });

  it('returns the backend message when the error code has no mapping', () => {
    expect(
      getApiErrorMessage({
        code: 'UNMAPPED_ERROR',
        message: 'Unexpected error',
      })
    ).toBe('Unexpected error');
  });
});

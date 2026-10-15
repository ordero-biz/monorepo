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

  it('maps the duplicate attribute name error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.ATTRIBUTE_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      })
    ).toBe('Attribute name already exists.');
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

  it('maps the duplicate category name error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.CATEGORY_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      })
    ).toBe('Category name already exists.');
  });

  it('maps the active supplier modification error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.SUPPLIER_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      })
    ).toBe('Cannot edit name or status of an active supplier');
  });

  it('maps the duplicate supplier name error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.SUPPLIER_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      })
    ).toBe('Supplier name already exists.');
  });

  it('maps the active unit of measurement modification error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.UNIT_OF_MEASUREMENT_MODIFICATION_NOT_ALLOWED,
        message: 'Conflict',
      })
    ).toBe('Cannot edit name or status of an active unit of measurement');
  });

  it('maps the duplicate unit of measurement name error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.UNIT_OF_MEASUREMENT_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      })
    ).toBe('Unit name already exists.');
  });

  it('maps the duplicate warehouse name error', () => {
    expect(
      getApiErrorMessage({
        code: API_ERROR_CODES.WAREHOUSE_NAME_ALREADY_EXISTS,
        message: 'Conflict',
      })
    ).toBe('Warehouse name already exists.');
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

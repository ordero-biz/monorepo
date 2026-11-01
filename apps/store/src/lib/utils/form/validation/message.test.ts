import { z } from 'zod';
import { getValidationMessage } from './message';

describe('getValidationMessage', () => {
  const nameSchema = z.string().trim().min(1, 'Name is required');

  it('returns undefined when the value is valid', () => {
    expect(getValidationMessage(nameSchema, 'Warehouse')).toBeUndefined();
  });

  it('returns the first validation message when the value is invalid', () => {
    expect(getValidationMessage(nameSchema, '  ')).toBe('Name is required');
  });
});

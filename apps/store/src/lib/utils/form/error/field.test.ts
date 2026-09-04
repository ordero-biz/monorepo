import { getFieldSubmitChangeErrorText } from './field';

describe('getFieldSubmitChangeErrorText', () => {
  it('hides change errors until the field has been blurred', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onChange: 'Name is required',
        },
        isBlurred: false,
        isDirty: true,
      })
    ).toBeUndefined();
  });

  it('shows a change error after the field has been blurred', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onChange: 'Name is required',
        },
        isBlurred: true,
        isDirty: true,
      })
    ).toBe('Name is required');
  });

  it('shows submit errors before blur', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onSubmit: 'Name already exists',
        },
        isBlurred: false,
        isDirty: false,
      })
    ).toBe('Name already exists');
  });

  it('gives submit errors precedence over change errors', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onChange: 'Name is required',
          onSubmit: 'Name already exists',
        },
        isBlurred: true,
        isDirty: true,
      })
    ).toBe('Name already exists');
  });

  it('shows dynamic errors before a field has been blurred', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onDynamic: 'Name is required',
        },
        isBlurred: false,
        isDirty: false,
      })
    ).toBe('Name is required');
  });

  it('gives submit errors precedence over dynamic errors', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onDynamic: 'Name is required',
          onSubmit: 'Name already exists',
        },
        isBlurred: true,
        isDirty: true,
      })
    ).toBe('Name already exists');
  });

  it('shows a blur error before the field has changed', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onBlur: 'Name is required',
        },
        isBlurred: true,
        isDirty: false,
      })
    ).toBe('Name is required');
  });

  it('uses the current change result after a field is edited', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onBlur: 'Name is required',
          onChange: undefined,
        },
        isBlurred: true,
        isDirty: true,
      })
    ).toBeUndefined();
  });
});

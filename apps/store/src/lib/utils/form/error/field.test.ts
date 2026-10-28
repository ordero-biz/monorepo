import { getFieldSubmitChangeErrorText } from './field';

describe('getFieldSubmitChangeErrorText', () => {
  it('hides touched change errors before blur when no submit was attempted', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: { onChange: 'Name is required' },
          isBlurred: false,
          isDirty: true,
          isTouched: true,
        },
        0
      )
    ).toBeUndefined();
  });

  it('shows change errors after a submit attempt even without blur', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: { onChange: 'Name is required' },
          isBlurred: false,
          isDirty: true,
          isTouched: true,
        },
        1
      )
    ).toBe('Name is required');
  });

  it('hides change errors until the field has been blurred', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onChange: 'Name is required',
          },
          isBlurred: false,
          isDirty: true,
          isTouched: true,
        },
        0
      )
    ).toBeUndefined();
  });

  it('shows change errors after submission even when the field is untouched', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: { onChange: 'Name is required' },
          isBlurred: false,
          isDirty: false,
          isTouched: false,
        },
        1
      )
    ).toBe('Name is required');
  });

  it('shows errors after blur without a submission attempt', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: { onBlur: 'Name is required' },
          isBlurred: true,
          isDirty: false,
          isTouched: true,
        },
        0
      )
    ).toBe('Name is required');
  });

  it('shows a change error after the field has been blurred', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onChange: 'Name is required',
          },
          isBlurred: true,
          isDirty: true,
          isTouched: true,
        },
        0
      )
    ).toBe('Name is required');
  });

  it('shows submit errors before blur', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onSubmit: 'Name already exists',
          },
          isBlurred: false,
          isDirty: false,
          isTouched: true,
        },
        0
      )
    ).toBe('Name already exists');
  });

  it('gives submit errors precedence over change errors', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onChange: 'Name is required',
            onSubmit: 'Name already exists',
          },
          isBlurred: true,
          isDirty: true,
          isTouched: true,
        },
        0
      )
    ).toBe('Name already exists');
  });

  it('shows dynamic errors before a field has been blurred', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onDynamic: 'Name is required',
          },
          isBlurred: false,
          isDirty: false,
          isTouched: true,
        },
        0
      )
    ).toBe('Name is required');
  });

  it('gives submit errors precedence over dynamic errors', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onDynamic: 'Name is required',
            onSubmit: 'Name already exists',
          },
          isBlurred: true,
          isDirty: true,
          isTouched: true,
        },
        0
      )
    ).toBe('Name already exists');
  });

  it('shows a blur error before the field has changed', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onBlur: 'Name is required',
          },
          isBlurred: true,
          isDirty: false,
          isTouched: true,
        },
        0
      )
    ).toBe('Name is required');
  });

  it('uses the current change result after a field is edited', () => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onBlur: 'Name is required',
            onChange: undefined,
          },
          isBlurred: true,
          isDirty: true,
          isTouched: true,
        },
        0
      )
    ).toBeUndefined();
  });

  it.each([
    false,
    true,
  ])('shows change errors after submission when isDirty is %s', (isDirty) => {
    expect(
      getFieldSubmitChangeErrorText(
        {
          errorMap: {
            onChange: 'Name is required',
          },
          isBlurred: false,
          isDirty,
          isTouched: true,
        },
        1
      )
    ).toBe('Name is required');
  });
});

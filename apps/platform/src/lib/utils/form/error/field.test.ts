import { getFieldSubmitChangeErrorText } from './field';

describe('getFieldSubmitChangeErrorText', () => {
  it('hides change errors until the field has been blurred', () => {
    expect(
      getFieldSubmitChangeErrorText({
        errorMap: {
          onChange: 'Name is required',
        },
        isBlurred: false,
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
      })
    ).toBe('Name already exists');
  });
});

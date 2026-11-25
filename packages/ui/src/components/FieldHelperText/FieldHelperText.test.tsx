import { render, screen } from '@testing-library/react';
import { FieldHelperText } from './FieldHelperText';

const TestIcon = () => (
  <span aria-hidden="true" data-testid="helper-icon">
    helper
  </span>
);

describe('FieldHelperText', () => {
  it('renders helper text with an optional icon', () => {
    render(
      <FieldHelperText icon={<TestIcon />}>Use a clear name.</FieldHelperText>
    );

    expect(screen.getByText('Use a clear name.')).toBeInTheDocument();
    expect(screen.getByTestId('helper-icon')).toBeInTheDocument();
  });

  it('renders error text content', () => {
    render(<FieldHelperText invalid>Name is required.</FieldHelperText>);

    expect(screen.getByText('Name is required.')).toBeInTheDocument();
  });
});

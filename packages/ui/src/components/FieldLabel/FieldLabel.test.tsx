import { render, screen } from '@testing-library/react';
import { FieldLabel } from './FieldLabel';

describe('FieldLabel', () => {
  it('labels a form control when rendered as a native label', () => {
    render(
      <>
        <FieldLabel as="label" htmlFor="product-name">
          Product name
        </FieldLabel>
        <input id="product-name" type="text" />
      </>
    );

    expect(
      screen.getByRole('textbox', { name: 'Product name' })
    ).toBeInTheDocument();
  });

  it('shows a visual required marker without changing the accessible name', () => {
    render(
      <>
        <FieldLabel as="label" htmlFor="description" required>
          Description
        </FieldLabel>
        <textarea id="description" />
      </>
    );

    expect(
      screen.getByRole('textbox', { name: 'Description' })
    ).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });
});

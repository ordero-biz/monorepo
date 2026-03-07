import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
} from './Field';

describe('Field Components', () => {
  describe('Field', () => {
    it('renders with default orientation', () => {
      render(<Field data-testid="field">Field content</Field>);
      const field = screen.getByTestId('field');
      expect(field).toBeInTheDocument();
      expect(field).toHaveAttribute('data-orientation', 'vertical');
    });

    it('renders with horizontal orientation', () => {
      render(<Field orientation="horizontal" data-testid="field">Field content</Field>);
      const field = screen.getByTestId('field');
      expect(field).toHaveAttribute('data-orientation', 'horizontal');
    });
  });

  describe('FieldSet', () => {
    it('renders fieldset element', () => {
      render(<FieldSet>Fieldset content</FieldSet>);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  describe('FieldLegend', () => {
    it('renders with default variant', () => {
      render(<FieldLegend>Legend text</FieldLegend>);
      const legend = screen.getByText('Legend text');
      expect(legend).toBeInTheDocument();
      expect(legend).toHaveAttribute('data-variant', 'legend');
    });

    it('renders with label variant', () => {
      render(<FieldLegend variant="label">Legend text</FieldLegend>);
      const legend = screen.getByText('Legend text');
      expect(legend).toHaveAttribute('data-variant', 'label');
    });
  });

  describe('FieldGroup', () => {
    it('renders group container', () => {
      render(<FieldGroup data-testid="field-group">Group content</FieldGroup>);
      expect(screen.getByTestId('field-group')).toBeInTheDocument();
    });
  });

  describe('FieldContent', () => {
    it('renders content container', () => {
      render(<FieldContent data-testid="field-content">Content</FieldContent>);
      expect(screen.getByTestId('field-content')).toBeInTheDocument();
    });
  });

  describe('FieldLabel', () => {
    it('renders label', () => {
      render(<FieldLabel>Label text</FieldLabel>);
      expect(screen.getByText('Label text')).toBeInTheDocument();
    });
  });

  describe('FieldTitle', () => {
    it('renders title', () => {
      render(<FieldTitle>Title text</FieldTitle>);
      expect(screen.getByText('Title text')).toBeInTheDocument();
    });
  });

  describe('FieldDescription', () => {
    it('renders description', () => {
      render(<FieldDescription>Description text</FieldDescription>);
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });
  });

  describe('FieldSeparator', () => {
    it('renders separator without content', () => {
      render(<FieldSeparator data-testid="separator" />);
      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });

    it('renders separator with content', () => {
      render(<FieldSeparator>OR</FieldSeparator>);
      expect(screen.getByText('OR')).toBeInTheDocument();
    });
  });

  describe('FieldError', () => {
    it('renders nothing when no errors or children', () => {
      const { container } = render(<FieldError />);
      expect(container.firstChild).toBeNull();
    });

    it('renders children when provided', () => {
      render(<FieldError>Custom error message</FieldError>);
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('renders single error message', () => {
      const errors = [{ message: 'This field is required' }];
      render(<FieldError errors={errors} />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('renders multiple error messages as list', () => {
      const errors = [
        { message: 'This field is required' },
        { message: 'Must be at least 3 characters' }
      ];
      render(<FieldError errors={errors} />);
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
    });

    it('filters out duplicate error messages', () => {
      const errors = [
        { message: 'This field is required' },
        { message: 'This field is required' },
        { message: 'Must be at least 3 characters' }
      ];
      render(<FieldError errors={errors} />);
      const errorElements = screen.getAllByText('This field is required');
      expect(errorElements).toHaveLength(1);
    });
  });
});
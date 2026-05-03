import type { ReactNode } from 'react';

type RenderFieldLabelContentArgs = {
  label: ReactNode;
  required?: boolean;
};

export const renderFieldLabelContent = ({
  label,
  required = false,
}: RenderFieldLabelContentArgs) => (
  <>
    {label}
    {required ? (
      // Keep the asterisk visual-only so it doesn't change the field's accessible name.
      <span aria-hidden="true" className="text-destructive">
        {' *'}
      </span>
    ) : null}
  </>
);

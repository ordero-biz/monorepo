import type { ReactNode } from 'react';

export type AttributeValuesRowProps = {
  attributeName: string;
  inputId: string;
  hintId: string;
  empty: boolean;
  multiple: boolean;
  onRemove: () => void;
  children: ReactNode;
};

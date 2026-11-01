import type { FocusEventHandler, ReactNode } from 'react';
import type { AttributeDropdown } from '@/lib/domain/attributes/types';

export type AttributesAsyncComboboxProps = {
  'aria-describedby': string;
  id: string;
  invalid?: boolean;
  onAttributeSelected: (attribute: AttributeDropdown) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  selectedAttributes: AttributeDropdown[];
};

export type AttributeValuesRowProps = {
  attributeName: string;
  inputId: string;
  hintId: string;
  empty: boolean;
  multiple: boolean;
  onRemove: () => void;
  children: ReactNode;
};

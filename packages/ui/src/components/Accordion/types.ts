import type {
  AccordionItemChangeEventDetails,
  AccordionRootChangeEventDetails,
} from '@base-ui/react/accordion';
import type { ReactNode, Ref } from 'react';

export type AccordionRootProps = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children: ReactNode;
  defaultValue?: string[];
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  id?: string;
  keepMounted?: boolean;
  loopFocus?: boolean;
  multiple?: boolean;
  onValueChange?: (
    value: string[],
    details: AccordionRootChangeEventDetails
  ) => void;
  ref?: Ref<HTMLDivElement>;
  value?: string[];
};

export type AccordionItemProps = {
  children: ReactNode;
  disabled?: boolean;
  id?: string;
  onOpenChange?: (
    open: boolean,
    details: AccordionItemChangeEventDetails
  ) => void;
  ref?: Ref<HTMLDivElement>;
  value: string;
};

export type AccordionHeaderProps = {
  children: ReactNode;
  id?: string;
  ref?: Ref<HTMLHeadingElement>;
};

export type AccordionTriggerProps = {
  children: ReactNode;
  disabled?: boolean;
  id?: string;
  ref?: Ref<HTMLButtonElement>;
};

export type AccordionPanelProps = {
  'aria-label'?: string;
  children: ReactNode;
  id?: string;
  keepMounted?: boolean;
  ref?: Ref<HTMLDivElement>;
};

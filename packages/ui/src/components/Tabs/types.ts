import type { TabsRootChangeEventDetails } from '@base-ui/react/tabs';
import type { ReactNode, Ref } from 'react';

export type TabsValue = string | number;

export type TabsRootProps = {
  children: ReactNode;
  defaultValue?: TabsValue | null;
  id?: string;
  onValueChange?: (
    value: TabsValue | null,
    details: TabsRootChangeEventDetails
  ) => void;
  ref?: Ref<HTMLDivElement>;
  value?: TabsValue | null;
};

export type TabsListProps = {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  activateOnFocus?: boolean;
  children: ReactNode;
  id?: string;
  loopFocus?: boolean;
  nextScrollLabel?: string;
  previousScrollLabel?: string;
  ref?: Ref<HTMLDivElement>;
};

export type TabsTabProps = {
  'aria-label'?: string;
  'aria-describedby'?: string;
  children: ReactNode;
  disabled?: boolean;
  id?: string;
  ref?: Ref<HTMLButtonElement>;
  value: TabsValue;
};

export type TabsPanelProps = {
  children: ReactNode;
  keepMounted?: boolean;
  ref?: Ref<HTMLDivElement>;
  value: TabsValue;
};

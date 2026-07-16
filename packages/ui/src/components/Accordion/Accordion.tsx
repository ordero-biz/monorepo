'use client';

import './styles.css';
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';
import type {
  AccordionHeaderProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionRootProps,
  AccordionTriggerProps,
} from './types';

export const AccordionRoot = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  defaultValue,
  disabled = false,
  hiddenUntilFound = false,
  id,
  keepMounted = false,
  loopFocus = true,
  multiple = false,
  onValueChange,
  ref,
  value,
}: AccordionRootProps) => (
  <AccordionPrimitive.Root
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    className="flex w-full flex-col"
    data-slot="accordion"
    defaultValue={defaultValue}
    disabled={disabled}
    hiddenUntilFound={hiddenUntilFound}
    id={id}
    keepMounted={keepMounted}
    loopFocus={loopFocus}
    multiple={multiple}
    onValueChange={onValueChange}
    ref={ref}
    value={value}
  >
    {children}
  </AccordionPrimitive.Root>
);

export const AccordionItem = ({
  children,
  disabled = false,
  id,
  onOpenChange,
  ref,
  value,
}: AccordionItemProps) => (
  <AccordionPrimitive.Item
    className="accordion-item group/accordion-item border-t border-[var(--color-divider)] first:border-t-0 data-[open]:mb-[var(--space-2)] data-[open]:rounded-[var(--accordion-radius)] data-[open]:border-transparent data-[open]:bg-card data-[open]:shadow-[var(--z8-x)_var(--z8-y)_calc(var(--z8-blur)/2)_var(--z8-spread)_var(--color-shadow-16)] data-[disabled]:opacity-50"
    data-slot="accordion-item"
    disabled={disabled}
    id={id}
    onOpenChange={onOpenChange}
    ref={ref}
    value={value}
  >
    {children}
  </AccordionPrimitive.Item>
);

export const AccordionHeader = ({
  children,
  id,
  ref,
}: AccordionHeaderProps) => (
  <AccordionPrimitive.Header
    className="m-0"
    data-slot="accordion-header"
    id={id}
    ref={ref}
  >
    {children}
  </AccordionPrimitive.Header>
);

export const AccordionTrigger = ({
  children,
  disabled,
  id,
  ref,
}: AccordionTriggerProps) => (
  <AccordionPrimitive.Trigger
    className="accordion-trigger flex w-full cursor-pointer items-center justify-between gap-[var(--space-2)] py-[var(--space-1-5)] pr-[var(--accordion-summary-pr)] pl-[var(--accordion-summary-pl)] text-left text-[length:var(--subtitle1-size-desktop)] leading-[var(--subtitle1-line-height-desktop)] font-[var(--subtitle1-weight)] text-[var(--text-primary)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed group-data-[open]/accordion-item:py-[var(--accordion-summary-py)]"
    data-slot="accordion-trigger"
    disabled={disabled}
    id={id}
    ref={ref}
  >
    <span className="min-w-0 flex-1">{children}</span>
    <ChevronDown
      aria-hidden="true"
      className="size-[var(--space-2-5)] shrink-0 transition-transform group-data-[open]/accordion-item:rotate-180"
    />
  </AccordionPrimitive.Trigger>
);

export const AccordionPanel = ({
  'aria-label': ariaLabel,
  children,
  id,
  keepMounted,
  ref,
}: AccordionPanelProps) => (
  <AccordionPrimitive.Panel
    aria-label={ariaLabel}
    className="accordion-panel"
    data-slot="accordion-panel"
    id={id}
    keepMounted={keepMounted}
    ref={ref}
  >
    <div className="px-[var(--accordion-details-px)] pt-[var(--accordion-details-pt)] pb-[var(--accordion-details-pb)] text-[length:var(--body1-size-desktop)] leading-[var(--body1-line-height-desktop)] font-[var(--body1-weight)] text-[var(--text-primary)]">
      {children}
    </div>
  </AccordionPrimitive.Panel>
);

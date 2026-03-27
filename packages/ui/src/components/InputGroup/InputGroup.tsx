'use client';

import { Button } from '@ordero/ui/components/Button';
import { Input } from '@ordero/ui/components/Input';
import { Textarea } from '@ordero/ui/components/Textarea';
import { cn } from '@ordero/ui/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { inputGroupAddonVariants, inputGroupButtonVariants } from './constants';
import type {
  InputGroupInputProps,
  InputGroupProps,
  InputGroupTextareaProps,
} from './types';

function InputGroup({
  className,
  state = 'default',
  ...props
}: InputGroupProps) {
  return (
    <div
      data-slot="input-group"
      className={cn(
        'group/input-group relative flex min-h-[length:var(--textfield-height-outlined-sm)] w-full min-w-0 items-center rounded-[length:var(--textfield-radius)] border border-[var(--textfield-outline)] bg-background transition-all duration-200 ease-out outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 hover:border-[var(--textfield-outline-strong)] has-disabled:bg-[var(--action-disabled-bg)] has-disabled:opacity-50 has-[[data-slot=input-group-control]:focus-visible]:border-primary has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-primary/20 has-[[data-slot=input-group-control]:focus-visible]:shadow-md has-[[data-slot][aria-invalid=true]]:border-error has-[[data-slot][aria-invalid=true]]:ring-2 has-[[data-slot][aria-invalid=true]]:ring-error/20 has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5',
        state === 'error' &&
          'border-error hover:border-error has-[[data-slot=input-group-control]:focus-visible]:border-error has-[[data-slot=input-group-control]:focus-visible]:ring-error/20',
        state === 'warning' &&
          'border-warning hover:border-warning has-[[data-slot=input-group-control]:focus-visible]:border-warning has-[[data-slot=input-group-control]:focus-visible]:ring-warning/20',
        state === 'success' &&
          'border-success hover:border-success has-[[data-slot=input-group-control]:focus-visible]:border-success has-[[data-slot=input-group-control]:focus-visible]:ring-success/20',
        className
      )}
      {...props}
    />
  );
}

function InputGroupAddon({
  children,
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      role="none"
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.preventDefault();
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return;
        }
        e.preventDefault();
        e.currentTarget.parentElement?.querySelector('input')?.focus();
      }}
      {...props}
    >
      {children}
    </div>
  );
}

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size' | 'type'> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: 'button' | 'submit' | 'reset';
  }) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  size = 'sm',
  state = 'default',
  'aria-invalid': ariaInvalid,
  ...props
}: InputGroupInputProps) {
  const resolvedAriaInvalid = ariaInvalid ?? (state === 'error' || undefined);

  return (
    <Input
      data-slot="input-group-control"
      size={size}
      aria-invalid={resolvedAriaInvalid}
      className={cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:border-transparent focus-visible:ring-0 focus-visible:shadow-none disabled:bg-transparent aria-invalid:ring-0',
        className
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  state = 'default',
  'aria-invalid': ariaInvalid,
  ...props
}: InputGroupTextareaProps) {
  const resolvedAriaInvalid = ariaInvalid ?? (state === 'error' || undefined);

  return (
    <Textarea
      data-slot="input-group-control"
      aria-invalid={resolvedAriaInvalid}
      className={cn(
        'flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent',
        className
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
};

'use client';

import {Label} from '@ordero/ui/components/Label';
import {Separator} from '@ordero/ui/components/Separator';
import {cn} from '@ordero/ui/lib/utils';
import {useMemo} from 'react';
import type {
  FieldContentProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldLabelProps,
  FieldLegendProps,
  FieldProps,
  FieldSeparatorProps,
  FieldSetProps,
  FieldTitleProps,
} from './types';

export function FieldSet({className, ...props}: FieldSetProps) {
    return (
        <fieldset
            data-slot="field-set"
            className={cn('flex flex-col gap-5', className)}
            {...props}
        />
    );
}

export function FieldLegend({
                                className,
                                variant = 'legend',
                                ...props
                            }: FieldLegendProps) {
    return (
        <legend
            data-slot="field-legend"
            data-variant={variant}
            className={cn(
                'text-base font-semibold tracking-tight',
                'data-[variant=label]:text-sm data-[variant=label]:font-medium',
                className
            )}
            {...props}
        />
    );
}

export function FieldGroup({className, ...props}: FieldGroupProps) {
    return (
        <div
            data-slot="field-group"
            className={cn('flex flex-col gap-6', className)}
            {...props}
        />
    );
}

export function Field({
                          className,
                          orientation = 'vertical',
                          ...props
                      }: FieldProps) {
    return (
        <div
            role="group"
            data-slot="field"
            data-orientation={orientation}
            className={cn(
                'flex flex-col gap-2',
                orientation === 'horizontal' && 'flex-row items-center gap-3',
                className
            )}
            {...props}
        />
    );
}

export function FieldContent({className, ...props}: FieldContentProps) {
    return (
        <div
            data-slot="field-content"
            className={cn(
                'flex flex-col gap-[length:var(--field-helper-padding-top)]',
                className
            )}
            {...props}
        />
    );
}

export function FieldLabel({className, ...props}: FieldLabelProps) {
    return (
        <Label
            data-slot="field-label"
            className={cn(
                'text-[length:var(--field-label-size)] font-semibold leading-none text-foreground',
                'group-data-[disabled=true]/field:opacity-50',
                className
            )}
            {...props}
        />
    );
}

export function FieldTitle({className, ...props}: FieldTitleProps) {
    return (
        <div
            data-slot="field-title"
            className={cn(
                'text-[length:var(--field-label-size)] font-semibold leading-none text-foreground',
                'group-data-[disabled=true]/field:opacity-50',
                className
            )}
            {...props}
        />
    );
}

export function FieldDescription({
                                     className,
                                     ...props
                                 }: FieldDescriptionProps) {
    return (
        <p
            data-slot="field-description"
            className={cn('text-xs leading-[18px] text-muted-foreground', className)}
            {...props}
        />
    );
}

export function FieldSeparator({
                                   children,
                                   className,
                                   ...props
                               }: FieldSeparatorProps) {
    return (
        <div
            data-slot="field-separator"
            className={cn('relative my-2', className)}
            {...props}
        >
            <Separator/>
            {children && (
                <span
                    className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-xs text-muted-foreground">
          {children}
        </span>
            )}
        </div>
    );
}

export function FieldError({
                               className,
                               children,
                               errors,
                               ...props
                           }: FieldErrorProps) {
    const content = useMemo(() => {
        if (children) return children;
        if (!errors?.length) return null;

        const uniqueErrors = [
            ...new Map(errors.map((e) => [e?.message, e])).values(),
        ];

        if (uniqueErrors.length === 1) {
            return uniqueErrors[0]?.message;
        }

        return (
            <ul className="ml-4 list-disc space-y-1">
                {uniqueErrors.map(
                    (error, i) => error?.message && <li key={i}>{error.message}</li>
                )}
            </ul>
        );
    }, [children, errors]);

    if (!content) return null;

    return (
        <div
            role="alert"
            data-slot="field-error"
            className={cn(
                'text-xs leading-[18px] text-destructive',
                className
            )}
            {...props}
        >
            {content}
        </div>
    );
}

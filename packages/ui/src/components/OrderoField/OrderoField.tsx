import * as React from "react";
import {Field, FieldLabel} from "../Field";
import {Input} from "../Input";

type OrderoFieldProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    onBlur: () => void;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Array<undefined | false | null | string>;
    className?: string;
    "aria-invalid"?: boolean;
}

export function OrderoField(
    {
        id,
        name,
        label,
        value,
        onBlur,
        onChange,
        placeholder,
        type = "text",
        required = false,
        disabled = false,
        errors = [],
        className,
        "aria-invalid": ariaInvalid,
        ...props
    }: OrderoFieldProps) {
    return (
        <Field className={className}>
            <FieldLabel htmlFor={id}>
                {label}{required && '*'}
            </FieldLabel>
            <Input
                id={id}
                name={name}
                type={type}
                value={value}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={ariaInvalid ?? (errors && errors.length > 0)}
                {...props}
            />
            {errors && errors.length > 0 && errors[0] && (
                <span className="text-[0.75rem] text-destructive text-left">
                    {errors[0]}
                </span>
            )}
        </Field>
    );
}

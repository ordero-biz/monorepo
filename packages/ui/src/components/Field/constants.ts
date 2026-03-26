import { cva } from 'class-variance-authority';

export const fieldVariants = cva(
  'group/field flex w-full flex-col gap-2 data-[invalid=true]:text-destructive *:w-full [&>.sr-only]:w-auto'
);

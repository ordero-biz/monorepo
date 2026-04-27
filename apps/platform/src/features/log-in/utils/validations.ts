import { z } from 'zod';

export const logInEmailSchema = z.email('Enter a valid email address.');

export const logInPasswordSchema = z
    .string()
    .min(6, 'Password must contain at least 6 characters.');

export const logInSchema = z.object({
    email: logInEmailSchema,
    password: logInPasswordSchema,
});

export type LogInFormValues = z.infer<typeof logInSchema>;

export const validateLogInEmail = (value: string) => {
    const result = logInEmailSchema.safeParse(value);

    return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateLogInPassword = (value: string) => {
    const result = logInPasswordSchema.safeParse(value);

    return result.success ? undefined : result.error.issues[0]?.message;
};

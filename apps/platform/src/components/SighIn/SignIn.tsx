import {Button, Field, FieldLabel, Input} from "@ordero/ui";
import {useForm} from "@tanstack/react-form";
import {zodValidator} from "@tanstack/zod-form-adapter";
import {type SignInFormData, signInSchema} from "./validation";

export const SignIn = () => {
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        } as SignInFormData,
        onSubmit: async ({value}) => {
            // Handle form submission
            console.log('SignIn form submitted:', value);
            // TODO: Implement actual signin logic
            alert('Sign in form submitted! Check console for details.');
        },
        validatorAdapter: zodValidator(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    return (
        <div className="mx-auto mt-[15%] w-full text-center">
            <h2 className="mb-6 text-2xl md:text-3xl font-medium leading-10 tracking-[-0.03em] text-card-foreground">
                Sign in to your account
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto max-w-80">
                <form.Field
                    name="email"
                    validators={{
                        onChange: signInSchema.shape.email,
                    }}
                    children={(field) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>
                                Email*
                            </FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="name@service.com"
                                required
                            />
                            {field.state.meta.errors.length > 0 && (
                                <span className="text-sm text-red-500 mt-1">
                                    {field.state.meta.errors[0]}
                                </span>
                            )}
                        </Field>
                    )}
                />

                <form.Field
                    name="password"
                    validators={{
                        onChange: signInSchema.shape.password,
                    }}
                    children={(field) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>
                                Password*
                            </FieldLabel>
                            <Input
                                type="password"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="*******"
                                required
                            />
                            {field.state.meta.errors.length > 0 && (
                                <span className="text-sm text-red-500 mt-1">
                                    {field.state.meta.errors[0]}
                                </span>
                            )}
                        </Field>
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                            className="mt-2 h-10 w-full justify-center bg-card-foreground text-sm font-medium text-primary-foreground cursor-pointer hover:bg-card-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                    )}
                />
            </form>
        </div>
    );
};

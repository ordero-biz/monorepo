import {Button, Field, FieldLabel, Input} from "@ordero/ui";
import {useForm} from "@tanstack/react-form";
import {zodValidator} from "@tanstack/zod-form-adapter";
import {type SignUpFormData, signUpSchema} from "./validation";

export const SignUp = () => {
    const form = useForm({
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
        } as SignUpFormData,
        onSubmit: async ({value}) => {
            // Handle form submission
            console.log('SignUp form submitted:', value);
            // TODO: Implement actual signup logic
            alert('Sign up form submitted! Check console for details.');
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
                Create your business account
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto max-w-80">
                <form.Field
                    name="name"
                    validators={{
                        onChange: signUpSchema.shape.name,
                    }}
                    children={(field) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>
                                Name*
                            </FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Evil Rabbit"
                                required
                                aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <span className="text-[0.75rem] text-destructive text-left">
                                    {field.state.meta.errors[0]}
                                </span>
                            )}
                        </Field>
                    )}
                />

                <form.Field
                    name="phone"
                    validators={{
                        onChange: signUpSchema.shape.phone,
                    }}
                    children={(field) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>
                                Phone*
                            </FieldLabel>
                            <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Enter phone number"
                                required
                                aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <span className="text-[0.75rem] text-destructive text-left">
                                    {field.state.meta.errors[0]}
                                </span>
                            )}
                        </Field>
                    )}
                />

                <form.Field
                    name="email"
                    validators={{
                        onChange: signUpSchema.shape.email,
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
                                aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <span className="text-[0.75rem] text-destructive text-left">
                                    {field.state.meta.errors[0]}
                                </span>
                            )}
                        </Field>
                    )}
                />

                <form.Field
                    name="password"
                    validators={{
                        onChange: signUpSchema.shape.password,
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
                                placeholder="********"
                                required
                                aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <span className="text-[0.75rem] text-destructive text-left">
                                    {field.state.meta.errors[0]}
                                </span>
                            )}
                        </Field>
                    )}
                />

                <form.Field
                    name="confirmPassword"
                    validators={{
                        onChange: signUpSchema.shape.confirmPassword,
                        onChangeAsyncDebounceMs: 500,
                        onChangeAsync: async ({value}) => {
                            const password = form.getFieldValue('password');
                            if (value !== password) {
                                return 'Passwords do not match';
                            }
                            return undefined;
                        },
                    }}
                    children={(field) => (
                        <Field>
                            <FieldLabel htmlFor={field.name}>
                                Confirm password*
                            </FieldLabel>
                            <Input
                                type="password"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="********"
                                required
                                aria-invalid={field.state.meta.errors.length > 0}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <span className="text-[0.75rem] text-destructive text-left">
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
                            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                        </Button>
                    )}
                />
            </form>
            <p className="mt-4 text-center text-sm text-foreground">
                Read{' '}
                <a
                    href="#"
                    className="font-normal text-primary underline underline-offset-4"
                >
                    Terms and Conditions policy
                </a>
            </p>
        </div>
    );
};

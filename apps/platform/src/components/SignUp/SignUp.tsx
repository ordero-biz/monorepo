import {Button, InputField} from "@ordero/ui";
import {useForm, Validator} from "@tanstack/react-form";
import {zodValidator} from "@tanstack/zod-form-adapter";
import {type SignUpFormData, signUpSchema} from "./validation";

export const SignUp = () => {
    const form = useForm<SignUpFormData, Validator<SignUpFormData>>({
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async ({value}) => {
            // Handle form submission
            console.log('SignUp form submitted:', value);
            // TODO: Implement actual signup logic
            alert('Sign up form submitted! Check console for details.');
        },
        validatorAdapter: zodValidator()
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    return (
        <div className="mx-auto mt-[15%] mb-[5%] w-full text-center">
            <h2 className="mb-6 text-2xl md:text-3xl font-medium leading-10 tracking-[-0.03em] text-card-foreground">
                Create your business account
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto max-w-90 md:max-w-80">
                <form.Field
                    name="name"
                    validators={{
                        onChange: signUpSchema.shape.name,
                    }}
                    children={(field) => (
                        <InputField
                            id={field.name}
                            name={field.name}
                            label="Name"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                            placeholder="Evil Rabbit"
                            required
                            errors={field.state.meta.errors}
                        />
                    )}
                />

                <form.Field
                    name="phone"
                    validators={{
                        onChange: signUpSchema.shape.phone,
                    }}
                    children={(field) => (
                        <InputField
                            id={field.name}
                            name={field.name}
                            label="Phone"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                            placeholder="Enter phone number"
                            required
                            errors={field.state.meta.errors}
                        />
                    )}
                />

                <form.Field
                    name="email"
                    validators={{
                        onChange: signUpSchema.shape.email,
                    }}
                    children={(field) => (
                        <InputField
                            id={field.name}
                            name={field.name}
                            label="Email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                            placeholder="name@service.com"
                            required
                            errors={field.state.meta.errors}
                        />
                    )}
                />

                <form.Field
                    name="password"
                    validators={{
                        onChange: signUpSchema.shape.password,
                    }}
                    children={(field) => (
                        <InputField
                            id={field.name}
                            name={field.name}
                            label="Password"
                            type="password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                            placeholder="********"
                            required
                            errors={field.state.meta.errors}
                        />
                    )}
                />

                <form.Field
                    name="confirmPassword"
                    validators={{
                        onChange: signUpSchema.shape.confirmPassword,
                        onChangeAsyncDebounceMs: 500,
                        onChangeAsync: async ({value}: { value: string }) => {
                            const password = form.getFieldValue('password');
                            if (value !== password) {
                                return 'Passwords do not match';
                            }
                            return undefined;
                        },
                    }}
                    children={(field) => (
                        <InputField
                            id={field.name}
                            name={field.name}
                            label="Confirm password"
                            type="password"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={field.handleChange}
                            placeholder="********"
                            required
                            errors={field.state.meta.errors}
                        />
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            variant='dark'
                            disabled={!canSubmit || isSubmitting}
                            className="mt-2 h-10"
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

import {Button, InputField} from "@ordero/ui";
import {useForm, Validator} from "@tanstack/react-form";
import {zodValidator} from "@tanstack/zod-form-adapter";
import {type SignInFormData, signInSchema} from "./validation";

export const SignIn = () => {
    const form = useForm<SignInFormData, Validator<SignInFormData>>({
        defaultValues: {
            email: '',
            password: '',
        },
        onSubmit: async ({value}) => {
            // Handle form submission
            console.log('SignIn form submitted:', value);
            // TODO: Implement actual signin logic
            alert('Sign in form submitted! Check console for details.');
        },
        validatorAdapter: zodValidator(),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    return (
        <div className="mx-auto mt-[15%] w-full text-center">
            <h2 className="mb-6 text-2xl md:text-3xl font-medium leading-10 tracking-[-0.03em] text-card-foreground">
                Sign in to your account
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mx-auto max-w-90 md:max-w-80">
                <form.Field
                    name="email"
                    validators={{
                        onChange: signInSchema.shape.email,
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
                            errors={field.state.meta.errors}
                        />
                    )}
                />

                <form.Field
                    name="password"
                    validators={{
                        onChange: signInSchema.shape.password,
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
                            placeholder="*******"
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
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>
                    )}
                />
            </form>
        </div>
    );
};

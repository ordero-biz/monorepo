import {Button, Field, FieldLabel, Input} from "@ordero/ui";

export const SignIn = () => {
    return (
        <div
            className="mx-auto mt-[15%] w-full text-center">
            <h2 className="mb-6 text-2xl md:text-3xl font-medium leading-10 tracking-[-0.03em] text-card-foreground">
                Sign in to your account
            </h2>
            <form className="flex flex-col gap-4 mx-auto max-w-80">
                <Field>
                    <FieldLabel htmlFor="email">
                        Email*
                    </FieldLabel>
                    <Input
                        id="email"
                        placeholder="name@service.com"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">
                        Password*
                    </FieldLabel>
                    <Input
                        type='password'
                        id="password"
                        placeholder="*******"
                        required
                    />
                </Field>
                <Button
                    type="submit"
                    className="mt-2 h-10 w-full justify-center bg-card-foreground text-sm font-medium text-primary-foreground cursor-pointer hover:bg-card-foreground/90"
                >
                    Sign Up
                </Button>
            </form>
        </div>
    )
}
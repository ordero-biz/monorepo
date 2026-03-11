import {Button, Field, FieldLabel, Input} from "@ordero/ui";

export const SignUp = () => {
    return (
        <div
            className="mx-auto mt-[15%] w-full text-center">
            <h2 className="mb-6 text-3xl font-medium leading-10 tracking-[-0.03em] text-card-foreground">
                Create your business account
            </h2>
            <form className="flex flex-col gap-4 mx-auto w-[80%] max-w-80">
                <Field>
                    <FieldLabel htmlFor="name">
                        Name*
                    </FieldLabel>
                    <Input
                        id="name"
                        placeholder="Evil Rabbit"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="phone">
                        Phone*
                    </FieldLabel>
                    <Input
                        id="phone"
                        placeholder="Evil Rabbit"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="email">
                        Email*
                    </FieldLabel>
                    <Input
                        id="email"
                        placeholder="Evil Rabbit"
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
                        placeholder="Evil Rabbit"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirmPassword">
                        Confirm password*
                    </FieldLabel>
                    <Input
                        type='password'
                        id="confirmPassword"
                        placeholder="Evil Rabbit"
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
    )
}
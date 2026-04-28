import { SignInForm } from '@/features/sign-in/SignInForm';

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background-neutral)] px-[var(--space-3)] py-[var(--space-5)] text-foreground">
      <section className="w-full max-w-[420px]">
        <SignInForm />
      </section>
    </main>
  );
}

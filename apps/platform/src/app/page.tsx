import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background-neutral)] px-[var(--space-3)] py-[var(--space-5)] text-foreground">
      <section className="flex w-full max-w-[560px] flex-col items-start gap-[var(--space-3)] rounded-[var(--radius-2-token)] bg-[var(--background-paper)] p-[var(--space-5)] shadow-sm">
        <span className="rounded-full bg-[var(--accent)] px-[var(--space-1-5)] py-[var(--space-0-5)] text-sm font-semibold text-[var(--accent-foreground)]">
          Platform
        </span>
        <div className="flex flex-col gap-[var(--space-1)]">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Sign in to access your workspace
          </h1>
          <p className="max-w-[44ch] text-base text-muted-foreground">
            Continue to the sign-in page to open the newly added account form.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-[var(--radius)] bg-primary px-[var(--space-3)] py-[var(--space-1-5)] text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          href="/sign-in"
        >
          Go to sign in
        </Link>
      </section>
    </main>
  );
}

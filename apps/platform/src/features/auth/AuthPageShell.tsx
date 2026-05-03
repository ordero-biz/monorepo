import type { ReactNode } from 'react';

type AuthPageShellProps = {
  children: ReactNode;
};

const MarketingPanel = () => {
  return (
    <section className="relative hidden h-dvh overflow-hidden bg-[var(--grey-800)] lg:flex">
      <div className="absolute inset-0 bg-[url('/sign-in-side-panel.svg')] bg-cover bg-center bg-no-repeat" />
    </section>
  );
};

export const AuthPageShell = ({ children }: AuthPageShellProps) => {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="grid min-h-dvh lg:h-dvh lg:grid-cols-2">
        <MarketingPanel />
        <section className="flex min-h-dvh items-center justify-center bg-background px-[var(--space-3)] py-[var(--space-6)] sm:px-[var(--space-5)] lg:h-dvh lg:px-[var(--space-8)]">
          <div className="w-full max-w-[420px]">{children}</div>
        </section>
      </div>
    </main>
  );
};

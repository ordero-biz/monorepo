'use client';

import { Typography } from '@ordero/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { AuthBadge } from './AuthBadge';

type AuthFormLayoutProps = {
  children: ReactNode;
  footerHref: string;
  footerLabel: string;
  footerPrompt: string;
  subtitle: string;
  title: string;
};

export const AuthFormLayout = ({
  children,
  footerHref,
  footerLabel,
  footerPrompt,
  subtitle,
  title,
}: AuthFormLayoutProps) => {
  return (
    <div className="flex w-full flex-col">
      <div className="mb-[var(--space-4)] flex flex-col items-center gap-[var(--space-4)] text-center">
        <AuthBadge />
        <div className="space-y-[var(--space-1)]">
          <h1 className="font-[var(--font-family-primary)] text-[30px] leading-[38px] font-[var(--font-weight-600)] text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="text-[length:var(--body2-size-desktop)] leading-[20px] font-[var(--body2-weight)] text-[var(--text-secondary)]">
            {subtitle}
          </p>
        </div>
      </div>

      {children}

      <div className="mt-[var(--space-1)] flex flex-wrap gap-x-[var(--space-0-5)] gap-y-[var(--space-1)]">
        <Typography color="text-secondary" variant="body2">
          {footerPrompt}
        </Typography>
        <Link className="text-[var(--primary-main)]" href={footerHref}>
          <Typography color="primary" variant="subtitle2">
            {footerLabel}
          </Typography>
        </Link>
      </div>
    </div>
  );
};

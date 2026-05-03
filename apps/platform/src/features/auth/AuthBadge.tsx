'use client';

export const AuthBadge = () => {
  return (
    <div className="relative flex size-[var(--space-8)] items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary-light)_0%,var(--primary-main)_58%,var(--primary-dark)_100%)] shadow-[var(--icon-md-shadow-x)_var(--icon-md-shadow-y)_var(--icon-md-shadow-blur)_var(--icon-md-shadow-spread)_var(--icon-primary-shadow-color)]">
      <div className="absolute left-[18%] top-[18%] size-[38%] rounded-full bg-[color-mix(in_srgb,var(--white-main)_90%,transparent)]" />
      <div className="absolute bottom-[20%] right-[18%] size-[44%] rounded-full bg-[color-mix(in_srgb,var(--white-main)_75%,transparent)]" />
      <div className="absolute inset-[24%] rounded-full border border-[color-mix(in_srgb,var(--white-main)_24%,transparent)]" />
    </div>
  );
};

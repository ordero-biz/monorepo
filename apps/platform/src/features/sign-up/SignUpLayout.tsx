'use client';

import { AuthFormLayout } from '@/features/auth';
import { clientRoutes } from '@/lib/client/routes';
import { SignUpForm } from './SignUpForm';

export const SignUpLayout = () => {
  return (
    <AuthFormLayout
      footerHref={clientRoutes.signIn}
      footerLabel="Sign in"
      footerPrompt="Already have an account?"
      subtitle="Please enter your details to get started"
      title="Get started"
    >
      <SignUpForm />
    </AuthFormLayout>
  );
};

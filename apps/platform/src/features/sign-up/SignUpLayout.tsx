'use client';

import { AuthFormLayout } from '@/features/auth/AuthFormLayout';
import { SignUpForm } from './SignUpForm';

export const SignUpLayout = () => {
  return (
    <AuthFormLayout
      footerHref="/sign-in"
      footerLabel="Sign in"
      footerPrompt="Already have an account?"
      subtitle="Please enter your details to get started"
      title="Get started"
    >
      <SignUpForm />
    </AuthFormLayout>
  );
};

'use client';

import { AuthFormLayout } from '@/features/auth/AuthFormLayout';
import { SignInForm } from './SignInForm';

export const SignInFormLayout = () => {
  return (
    <AuthFormLayout
      footerHref="/sign-up"
      footerLabel="Create account"
      footerPrompt="Don't have an account?"
      subtitle="Please enter your details to get started"
      title="Welcome back!"
    >
      <SignInForm />
    </AuthFormLayout>
  );
};

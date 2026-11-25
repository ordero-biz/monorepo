'use client';

import { AuthFormLayout } from '@/features/auth';
import { SignInForm } from './SignInForm';

export const SignInFormLayout = () => {
  return (
    <AuthFormLayout
      subtitle="Please enter your details to get started"
      title="Welcome back!"
    >
      <SignInForm />
    </AuthFormLayout>
  );
};

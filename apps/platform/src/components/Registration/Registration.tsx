'use client';

import { Button } from '@ordero/ui';
import { useState } from 'react';
import { SignIn } from '@/components/SignIn/SignIn';
import { SignUp } from '@/components/SignUp/SignUp';

export const Registration = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <>
      <div className="flex justify-between md:justify-end items-center">
        <div className="block md:hidden">
          <h1 className="text-primary text-5xl font-extrabold">Ordero</h1>
        </div>
        <Button
          onClick={() => setIsSignUp((prev) => !prev)}
          variant="text"
          color="default"
          size="sm"
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Button>
      </div>
      {isSignUp && <SignUp />}
      {!isSignUp && <SignIn />}
    </>
  );
};

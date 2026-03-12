"use client";

import {useState} from "react";

import {Button} from "@ordero/ui";
import {SignUp} from "@/components/SignUp/SignUp";
import {SignIn} from "@/components/SignIn/SignIn";

export const Registration = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <>
            <div className="flex justify-between md:justify-end items-center">
                <div className='block md:hidden'>
                    <h1 className='text-primary text-5xl font-extrabold'>Ordero</h1>
                </div>
                <Button onClick={() => setIsSignUp(prev => !prev)} variant="ghost" size="lg"
                        className="h-9 px-4 cursor-pointer">
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
            </div>
            {isSignUp && <SignUp/>}
            {!isSignUp && <SignIn/>}
        </>
    )
}
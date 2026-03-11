"use client";

import {useState} from "react";

import {Button} from "@ordero/ui";
import {SignUp} from "@/components/SighUp/SignUp";
import {SignIn} from "@/components/SighIn/SignIn";

export const Registration = () => {
    const [isSignUp, setIsSignUp] = useState(true);

    return (
        <>
            <div className="flex justify-between md:justify-end">
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
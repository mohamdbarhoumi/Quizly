'use client'
import React from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";


type Props = {
    text: string;
    className: string;
};

const SignInButton = ({text, className}: Props) => {
    return(
        <Button className={className} onClick={()=>{ 
            signIn("google").catch(console.error);
            }}>
            {text}
        </Button>
    )
}

export default SignInButton;
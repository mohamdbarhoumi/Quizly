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
            document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
            signIn("google").catch(console.error);
            }}>
            {text}
        </Button>
    )
}

export default SignInButton;
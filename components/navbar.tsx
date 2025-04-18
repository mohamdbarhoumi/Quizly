import Link from "next/link";
import React, { ReactNode } from "react";
import SignInButton from "./SignInButton";
import { getAuthSession } from "@/lib/nextauth";
import UserAccountNav from "./userAccountNav";
import { ThemeToggle } from "./themeToggle";

type Props = {
    children?: ReactNode;
}

const Navbar = async({children}: Props) =>{
    const session = await getAuthSession()
    return(
        <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-10 h-fit border-b border-zinc-300 py-2">
            <div className="flex items-center justify-between h-full gap-1 px-8 mx-auto max-w-7xl">
                {/* L O G O */}
                <Link href='/' className="flex items-center float-left gap-2"> 
                <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-4 mr-10 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white">
                    Quizly
                </p>
                </Link>
                <div className="flex items-center">
                <ThemeToggle className="mr-3"/>
                
                    {session?.user? (
                        <UserAccountNav user={session.user} />  
                    ) : (
                        <SignInButton text={"Sign In"} className=""/>
                    )}
                </div>

            </div>
        </div>

    )

}

export default Navbar
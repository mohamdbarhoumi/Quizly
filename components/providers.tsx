'use client'
import { SessionProvider } from "next-auth/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
    children: React.ReactNode;
}

const queryClient = new QueryClient(); 

const Providers = ({children}: Props) =>{
    return(
        <QueryClientProvider client={queryClient}>
        <SessionProvider>
      {children} {/* Render the children passed to the component */}
    </SessionProvider>
    </QueryClientProvider>
    );

}
export default Providers;
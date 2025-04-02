import { SessionProvider } from "next-auth/react";
import React from "react";

type Props = {
    children: React.ReactNode;
}

const Providers = ({children}: Props) =>{
    return(
        <SessionProvider>
      {children} {/* Render the children passed to the component */}
    </SessionProvider>
    )

}
export default Providers;
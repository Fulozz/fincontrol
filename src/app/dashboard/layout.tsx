import type React from "react";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateToken } from "@/lib/auth";
// import

export default async function DashboardLayout(
    { children} : { children: React.ReactNode }
) {
    const cookiesStore = await cookies()
    const token = cookiesStore.get("auth-token")?.value
    if(!token){
        redirect("/login")
    } 


    const isValid = await validateToken(token)

    if(!isValid){
        redirect("/login")
    }


    return(
        <div className="flex min-h-screen flex-col md:flex-row">

            <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
    )
}
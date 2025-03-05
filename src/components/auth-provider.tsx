"use client"
import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { validateToken } from "@/lib/auth"
import toast from "react-hot-toast"


type TAuthContextType = {
    isAuthenticated: boolean
    isLoading: Boolean
    logout: ()=> void
}

const AuthContext = createContext<TAuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    logout: () => {},
  })

export function AuthProvider ({children }: {children: React.ReactNode}){
    const [ isAuthenticated, setIsAuthenticated ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const router = useRouter()

    useEffect(()=> {
        const checkAuth = async () => {
            const token = getCookie("auth-token")
            if(!token){
                setIsAuthenticated(false)
                setIsLoading(false)
                return
            }
            try {
                const isValid = await validateToken(token)
                setIsAuthenticated(isValid)

                if(!isValid){
                    toast.error("Sua sessão inspirou. Faça login novamente.")
                }
                
            } catch (error) {
                setIsAuthenticated(false)
                toast.error("Por favor faça o login novamente.")  
            } finally {
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [])

    const logout = () => {
        document.cookie = "auth-token=; path=/; max-age=0;samesite=lax";
        setIsAuthenticated(false)
        router.push("/login")
        router.refresh()
        toast.success("Saiu com sucesso")
    }
    return <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

// Helper function to get cookie
export function getCookie(name: string) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return null
}

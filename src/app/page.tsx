"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "react-hot-toast"
import "./globals.css"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isAuthenticated, isLoading, logout } = useAuth()

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex h-screen overflow-hidden">
            {isAuthenticated ? (
              <>
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6 ml-0 lg:ml-20 transition-all duration-300">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex justify-end mb-4">
                      <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Logout
                      </button>
                    </div>
                    {children}
                  </div>
                </main>
              </>
            ) : (
              <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-end mb-4 space-x-4">
                    <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      Login
                    </Link>
                    <Link href="/register" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                      Cadastro
                    </Link>
                  </div>
                  {children}
                </div>
              </main>
            )}
          </div>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}


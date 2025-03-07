"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CreditCard, PieChart, Receipt, CalendarClock, BarChart3, User, Menu, X, ChevronLeft, ChevronRight, Wallet } from 'lucide-react'
import clsx from "clsx"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Cartões", href: "/cartoes", icon: CreditCard },
  { name: "Orçamento", href: "/orcamento", icon: PieChart },
  { name: "Transações", href: "/transacoes", icon: Receipt },
  { name: "Contas a Pagar", href: "/contas", icon: CalendarClock },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3 },
  { name: "Perfil", href: "/perfil", icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop sidebar toggle */}
      <button
        className="fixed bottom-4 left-4 z-50 hidden lg:flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0",
          {
            "w-64": isOpen && !isMobile,
            "w-20": !isOpen && !isMobile,
            "w-64": mobileOpen && isMobile,
            "-translate-x-full": !mobileOpen && isMobile,
          },
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={clsx(
              "flex items-center h-16 border-b border-gray-200 dark:border-gray-700 transition-all duration-300",
              {
                "justify-center": !isOpen && !isMobile,
                "justify-between px-4": isOpen || isMobile,
              },
            )}
          >
            {isOpen || isMobile ? (
              <>
                <div className="flex items-center">
                  <Wallet size={24} className="text-blue-500" />
                  <h1 className="text-xl font-bold text-primary ml-2">FinControl</h1>
                </div>
                {isMobile && (
                  <button onClick={toggleMobileSidebar}>
                    <X size={20} />
                  </button>
                )}
              </>
            ) : (
              <Wallet size={24} className="text-blue-500" />
            )}
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "flex items-center py-3 transition-colors rounded-md",
                    {
                      "px-4": isOpen || isMobile,
                      "px-2 justify-center": !isOpen && !isMobile,
                      "bg-primary text-white": isActive,
                      "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700":
                        !isActive,
                    }
                  )}
                  onClick={() => isMobile && setMobileOpen(false)}
                >
                  <item.icon className={clsx("h-5 w-5", {
                    "mr-3": isOpen || isMobile,
                  })} />
                  {(isOpen || isMobile) && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div
            className={clsx("p-4 border-t border-gray-200 dark:border-gray-700", {
              hidden: !isOpen && !isMobile,
            })}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">U</div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Usuário</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">usuario@email.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && isMobile && (
        <div className="fixed inset-0 z-30 bg-gray-600 bg-opacity-50 lg:hidden" onClick={toggleMobileSidebar} />
      )}
    </>
  )
}


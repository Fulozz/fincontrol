"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

import { BarChart3, CreditCard, DollarSign, Home, LogOut, PieChart, Settings, User } from "lucide-react"

export function DashboardSidebar () {
    const pathname = usePathname()
    const logout = useAuth()
    const menuItemsPrincipal = [
        {
          title: "Dashboard",
          icon: Home,
          name: "dashboard"
        },
        {
          title: "Transações",
          icon: CreditCard,
          name: "transacoes"
        },
        {
            title: "Cartões",
            icon: PieChart,
            name: "cards"
          },
        {
          title: "Investimentos",
          icon: DollarSign,
          href: "/dashboard/income",
          name: "investimentos"
        },
        {
          title: "Analises",
          icon: PieChart,
          name: "analises"
        },
        {
          title: "Profile",
          icon: User,
          href: "/dashboard/profile",
        },
        {
          title: "Configuração",
          icon: Settings,
          href: "/dashboard/settings",
          name: 'configuracao'
        },
      ]

    return (
        <div>
        teste
        </div>
    )
}
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

import { BarChart3, CreditCard, DollarSignIcon, HomeIcon, LogOut, PieChart, Settings, User } from "lucide-react"

interface TDashboardSidebarProps {
  setActiveTab: any;
  activeTab: string
}

export function DashboardSidebar ({ setActiveTab, activeTab }: TDashboardSidebarProps ) {
    const pathname = usePathname()
    const logout = useAuth()
    const menuItemsPrincipal = [
        {
          title: "Dashboard",
          icon: HomeIcon,
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
          icon: DollarSignIcon,
          href: "/dashboard/income",
          name: "investimentos"
        },
        {
          title: "Analises",
          icon: PieChart,
          name: "analises"
        }
      ]
      const menuItemsConfiguracao = [
        {
          title: "Profile",
          icon: User,
          href: "/dashboard/profile",
          name: "Perfil"
        },
        {
          title: "Configuração",
          icon: Settings,
          href: "/dashboard/settings",
          name: 'configuracao'
        },
      ]

    return (
        <section className="hidden w-64 flex-col bg-background border-r md:flex"> 
          <div className="flex h-14 border-b px-4 items-center gap-2">
            <DollarSignIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FinControl</span>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="px-4 mb-4">
              <h2 className="mb-2 text-xs font-semibold text-muted-foreground">Menu</h2>
              <div className="space-y-1">
                {
                  menuItemsPrincipal.map((item, index)=>{
                    const Icon = item.icon
                    return(
                      <button onClick={()=> setActiveTab(`${item.name}`)} key={index} className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors bg-transparent hover:bg-secondary w-full px-4 py-2 justify-start ${ item.name === activeTab ? "bg-secondary" : ""}`}>
                          <Icon className="" />
                          { item.title}
                      </button>
                    )
                  })
                }
              </div>
            </div>
            <div className="px-4 mb-4">
              <h2 className="mb-2 text-xs font-semibold text-muted-foreground">Configuração</h2>
              <div className="space-y-1">
                {
                  menuItemsConfiguracao.map((item, index)=>{
                    const Icon = item.icon
                    return(
                      <button onClick={()=> setActiveTab(`${item.name}`)} key={index} className={`inline-flex  items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-secondary  w-full px-4 py-2 justify-start ${ item.name === activeTab ? "bg-secondary " : ""}`}>
                          <Icon className="" />
                          { item.title}
                      </button>
                    )
                  })
                }
              </div>
            </div>
            
          </nav>
        </section>
    )
}
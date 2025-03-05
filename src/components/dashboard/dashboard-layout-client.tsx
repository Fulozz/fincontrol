"use client";
import React, { JSX, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import DashboardPage from "@/app/dashboard/page";



function TransactionsScreen() {
  return <div className="bg-[#ff0000] h-full w-full">Transactions Screen</div>;
}

function CardsScreen() {
    return <div className="bg-[#00ff00] h-full w-full">Cards Screen</div>;
}

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("overview");
    const screenComponents: { [key: string]: () => JSX.Element } = {
      dashboard: DashboardPage,
      transacoes: TransactionsScreen,
      cards: CardsScreen
    }
    const ScreenComponent = screenComponents[activeTab] || DashboardPage; // Componente padrão
  return (
    <div className="flex min-h-full flex-col md:flex-row bg-muted/70">
      <DashboardSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="flex-1">
          <div className=""><ScreenComponent /></div>
      </main>
    </div>
  );
}
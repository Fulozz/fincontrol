"use client";
import React, { JSX, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

function DashboardScreen() {
  return <div className="bg-[#A020F0] h-screen w-full">Dashboard Screen</div>;
}

function TransactionsScreen() {
  return <div className="bg-[#ff0000] h-screen w-full">Transactions Screen</div>;
}

function CardsScreen() {
    return <div className="bg-[#00ff00] h-screen w-full">Cards Screen</div>;
}

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  console.log(activeTab)
    const screenComponents: { [key: string]: () => JSX.Element } = {
      dashboard: DashboardScreen,
      transacoes: TransactionsScreen,
      cards: CardsScreen
    }
    const ScreenComponent = screenComponents[activeTab] || DashboardScreen; // Componente padrão
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-muted/70">
      <DashboardSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="flex-1">
          <DashboardHeader />
          <div className={`h-screen ${ activeTab === "dashboard" ? "bg-[#A020F0]" : "bg-[#ff0000]"} w-full`}><ScreenComponent /></div>
      </main>
    </div>
  );
}
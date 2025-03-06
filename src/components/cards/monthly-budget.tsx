import React from 'react'
import {
    ArrowUpRight,
  } from "lucide-react"
import Link from 'next/link'
import { clsx } from "clsx";

export type BudgetCategory = {
  id: number
  name: string
  amount: number
  spent: number
  color: string
}


  export default function MonthlyBudget (){
    // TODO: INTEGRACAO COM API DE VALORES, PORCENTAGENS
    const dataMockup = {
        totalBudget: 5000,
        totalSpent: 3200,
    }
    let budgetCategories: BudgetCategory[] = [
      { id: 1, name: "Alimentação", amount: 1200, spent: 850, color: "bg-blue-500" },
      { id: 2, name: "Moradia", amount: 1800, spent: 1800, color: "bg-green-500" },
      { id: 3, name: "Transporte", amount: 600, spent: 350, color: "bg-orange-500" },
      { id: 4, name: "Lazer", amount: 400, spent: 200, color: "bg-pink-500" },
      { id: 5, name: "Reserva", amount: 1000, spent: 0, color: "bg-purple-500" },
    ]

    const totalBudget = dataMockup.totalBudget
    const totalSpent = dataMockup.totalSpent
    const percentSpent = Math.min(100, (totalSpent / totalBudget) * 100)

     // Função para formatar valores monetários
  const formatValue = (value: number) => {
    if (value === 0) {
      return 'R$ 0,00';
    }
    const formattedValue = value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    return `R$ ${formattedValue}`;
  };
    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Orçamento Mensal</h3>
                <span className="text-gray-500">{new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</span>
            </div>
            <div className="mt-4">
                <p className="text-xs texty-gray-500 mb-1">Gasto: {percentSpent}%</p>
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={clsx(
                      "h-full rounded-full",
                    percentSpent > 90 ? "bg-red-500" : percentSpent > 75 ? "bg-orange-500" : "bg-blue-500",
                  )} style={{ width: `${percentSpent}%`}}></div>
                </div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
                <span>{formatValue(totalSpent)} de {formatValue(totalBudget)}</span>
                <span className={clsx(totalBudget - totalSpent < 0 ? "text-red-600" : "text-green-600")}>Restante: {formatValue(totalBudget - totalSpent)}</span>
            </div>
            <div className="mt-4">
                <Link href="/budget" className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'>
                    Ver detalhes do orçamento
                    <ArrowUpRight className="w-4 h-4 ml-1" /> 
                </Link>

            </div>
        </div>
    )
  }
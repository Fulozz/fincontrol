import React from 'react'
import {
    BarChart,
    PieChart,
    Wallet,
    Plus,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    CreditCardIcon,
  } from "lucide-react"


  export default function MonthlyBudget (){
    // TODO: INTEGRACAO COM API DE VALORES, PORCENTAGENS
    return (
        <div className='bg-white rounded-lg shadow p-6'>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500">Orçamento Mensal</h3>
                <span className="text-gray-500">Maio 2025</span>
            </div>
            <div>
                <p>Gasto:</p>
            </div>
        </div>
    )
  }
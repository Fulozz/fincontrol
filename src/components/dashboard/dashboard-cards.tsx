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
import CurrentBalance from '../cards/current-balance'
import MonthlyBudget from '../cards/monthly-budget'


export default function DashboardCards
 (){
    const mockupData = {
        gastos: 64,
        limiteOrcamento: 5000,
        gastoAtual: 3200
    }
    return(
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <CurrentBalance />
            <MonthlyBudget />
        </div>
    )
}
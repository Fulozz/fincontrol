import React from 'react'
import { ArrowUpRight, Gauge } from "lucide-react"


export default function FinancialHealth (){
    const stats = {
        financialHealth: 60,
        emergencyFund: 75,
        debtLevel: 80,
        diversification: 60,
        expenseControl: 85,
      }
    return(
    <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Saúde Financeira</h3>
          <span className="p-2 bg-blue-100 rounded-full">
            <Gauge className="w-5 h-5 text-blue-600" />
          </span>
        </div>
        <div className="flex justify-center mt-4">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-32 h-32">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={`${stats.financialHealth <= 30 ? "#ff0000" :  stats.financialHealth <= 60 ? "#ca8a04" : "#10B981" } `}
                        strokeWidth="3"
                        strokeDasharray={`${stats.financialHealth}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">{stats.financialHealth}</span>

                      <span className={`text-sm ${stats.financialHealth <= 30 ? "text-red-600" :  stats.financialHealth <= 60 ? "text-yellow-600" : "text-green-600" } `}>Boa</span>
                    </div>
                  </div>
                </div>
  
        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500 text-sm">Reserva de emergência</span>
              <span className="font-medium">{stats.emergencyFund}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.emergencyFund}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500 text-sm">Controle de Gastos</span>
              <span className="font-medium">{stats.expenseControl}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.expenseControl}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500 text-sm">Nível de endividamento</span>
              <span className="font-medium">{stats.expenseControl}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.expenseControl}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    )
}
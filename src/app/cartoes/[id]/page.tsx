"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Calendar, Tag, ArrowUp, ArrowDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useCardDetails, useTransactionsData } from "@/hooks/api"

const spendingByCategory = [
  { name: "Alimentação", value: 242.25 },
  { name: "Lazer", value: 39.90 },
  { name: "Saúde", value: 45.60 },
  { name: "Transporte", value: 25.50 },
]

export default function CardDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { card, loading: cardLoading } = useCardDetails(params.id)
  const { transactions, loading: transactionsLoading } = useTransactionsData()

  if (cardLoading || transactionsLoading) {
    return <div>Carregando...</div>
  }

  if (!card) {
    return <div>Cartão não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Detalhes do Cartão</h1>
      </div>

      {/* Card Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6" style={{ backgroundColor: card.color }}>
          <div className="flex justify-between items-start text-white">
            <div>
              <h2 className="text-2xl font-bold">{card.name}</h2>
              <p className="text-lg opacity-80">**** **** **** {card.lastDigits}</p>
            </div>
            <CreditCard size={32} />
          </div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Limite Total</p>
            <p className="text-lg font-semibold">
              R$ {card.limit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Limite Disponível</p>
            <p className="text-lg font-semibold">
              R$ {card.availableLimit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Vencimento</p>
            <p className="text-lg font-semibold">Dia {card.dueDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Fechamento</p>
            <p className="text-lg font-semibold">Dia {card.closingDate}</p>
          </div>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Gastos por Categoria</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value}`} />
              <Legend />
              <Bar dataKey="value" fill={card.color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transações Recentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Descrição</th>
                  <th className="pb-3 font-medium">Categoria</th>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction: any) => (
                  <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3">{transaction.description}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <Tag size={14} className="text-gray-400 mr-2" />
                        {transaction.category}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-2" />
                        {new Date(transaction.date).toLocaleDateString("pt-BR")}
                      </div>
                    </td>
                    <td
                      className={`py-3 text-right font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}
                    >
                      <div className="flex items-center justify-end">
                        {transaction.type === "income" ? (
                          <ArrowUp size={14} className="mr-1" />
                        ) : (
                          <ArrowDown size={14} className="mr-1" />
                        )}
                        R$ {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

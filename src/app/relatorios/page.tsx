"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useTransactionsData, useCardsData, useBudgetData, useBillsData, useFinancialInsights } from "@/hooks/api"

export default function ReportsPage() {
  const { transactions } = useTransactionsData()
  const { cards } = useCardsData()
  const { budget } = useBudgetData()
  const { bills } = useBillsData()
  const { insights } = useFinancialInsights()

  const [monthlyExpenses, setMonthlyExpenses] = useState<{ month: string; expenses: number; income: number }[]>([])
  const [categoryExpenses, setCategoryExpenses] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    if (transactions.length > 0) {
      // Calculate monthly expenses and income
      const monthlyData = transactions.reduce(
        (acc, transaction) => {
          const date = new Date(transaction.date)
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
          if (!acc[monthYear]) {
            acc[monthYear] = { expenses: 0, income: 0 }
          }
          if (transaction.type === "expense") {
            acc[monthYear].expenses += transaction.amount
          } else {
            acc[monthYear].income += transaction.amount
          }
          return acc
        },
        {} as Record<string, { expenses: number; income: number }>,
      )

      setMonthlyExpenses(
        Object.entries(monthlyData).map(([month, data]) => ({
          month,
          expenses: data.expenses,
          income: data.income,
        })),
      )

      // Calculate expenses by category
      const categoryData = transactions
        .filter((t) => t.type === "expense")
        .reduce(
          (acc, transaction) => {
            if (!acc[transaction.category]) {
              acc[transaction.category] = 0
            }
            acc[transaction.category] += transaction.amount
            return acc
          },
          {} as Record<string, number>,
        )

      setCategoryExpenses(Object.entries(categoryData).map(([name, value]) => ({ name, value })))
    }
  }, [transactions])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Despesas e Receitas Mensais</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" name="Despesas" fill="#FF8042" />
                <Bar dataKey="income" name="Receitas" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Despesas por Categoria</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Insights Financeiros</h2>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <h3 className="font-medium text-lg mb-2">
                {insight.type === "alert" ? "⚠️" : insight.type === "opportunity" ? "💡" : "🎉"} {insight.message}
              </h3>
              {insight.data && (
                <pre className="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded">
                  {JSON.stringify(insight.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Resumo do Orçamento</h2>
          {budget && (
            <div>
              <p className="mb-2">
                Total do Orçamento: R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
              <ul className="list-disc list-inside">
                {budget.categories.map((category) => (
                  <li key={category.id}>
                    {category.name}: R$ {category.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Resumo de Contas a Pagar</h2>
          <p className="mb-2">Total de Contas: {bills.length}</p>
          <p className="mb-2">
            Valor Total: R${" "}
            {bills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p>Próximo Vencimento: {bills.length > 0 ? new Date(bills[0].dueDate).toLocaleDateString("pt-BR") : "N/A"}</p>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, AlertTriangle, Lightbulb, Target, Calendar, Tag } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useTransactionsData, useCardsData, useBudgetData, useBillsData, useFinancialInsights } from "@/hooks/api"

const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"]

// Tipos para os dados
type BalanceData = {
  current: number
  previous: number
  percentChange: number
  isPositive: boolean
}

type BudgetData = {
  total: number
  spent: number
  remaining: number
  percentSpent: number
}

type BillsData = {
  total: number
  upcoming: Array<{
    name: string
    amount: number
    dueDate: string
  }>
}

type ExpenseDistribution = Array<{
  name: string
  value: number
  color: string
}>

type Transaction = {
  id: string
  description: string
  amount: number
  date: string
  category: string
  type: "income" | "expense"
}

export default function Dashboard() {
  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    refreshTransactions,
  } = useTransactionsData()
  const { cards, loading: cardsLoading, error: cardsError, refreshCards } = useCardsData()
  const { budget, loading: budgetLoading, error: budgetError, refreshBudget } = useBudgetData()
  const { bills, loading: billsLoading, error: billsError, refreshBills } = useBillsData()
  const { insights, loading: insightsLoading, error: insightsError, refreshInsights } = useFinancialInsights()

  const [balanceData, setBalanceData] = useState<BalanceData>({
    current: 0,
    previous: 0,
    percentChange: 0,
    isPositive: true,
  })
  const [budgetData, setBudgetData] = useState<BudgetData>({ total: 0, spent: 0, remaining: 0, percentSpent: 0 })
  const [billsData, setBillsData] = useState<BillsData>({ total: 0, upcoming: [] })
  const [expenseDistribution, setExpenseDistribution] = useState<ExpenseDistribution>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchData = () => {
      refreshTransactions()
      refreshCards()
      refreshBudget()
      refreshBills()
      refreshInsights()
    }

    fetchData()
    const intervalId = setInterval(fetchData, 60000) // Atualiza a cada minuto

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (transactions.length > 0 && cards.length > 0) {
      // Calcular saldo atual
      const totalBalance = cards.reduce((sum, card) => sum + card.availableLimit, 0)
      const previousBalance =
        totalBalance -
        transactions
          .filter((t) => new Date(t.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
          .reduce((sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount), 0)

      const percentChange = ((totalBalance - previousBalance) / previousBalance) * 100
      setBalanceData({
        current: totalBalance,
        previous: previousBalance,
        percentChange: Math.abs(percentChange),
        isPositive: percentChange >= 0,
      })

      // Calcular distribuição de despesas
      const expensesByCategory = transactions
        .filter((t) => t.type === "expense")
        .reduce(
          (acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
          },
          {} as Record<string, number>,
        )

      setExpenseDistribution(
        Object.entries(expensesByCategory).map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length],
        })),
      )

      // Definir transações recentes
      setRecentTransactions(transactions.slice(0, 10))
    } else {
      // Dados vazios ou simulados
      setBalanceData({ current: 0, previous: 0, percentChange: 0, isPositive: true })
      setExpenseDistribution([{ name: "Sem dados", value: 1, color: COLORS[0] }])
      setRecentTransactions([])
    }
  }, [transactions, cards])

  useEffect(() => {
    if (budget) {
      const spent = transactions
        .filter((t) => t.type === "expense" && new Date(t.date).getMonth() === new Date().getMonth())
        .reduce((sum, t) => sum + t.amount, 0)

      setBudgetData({
        total: budget.total,
        spent,
        remaining: budget.total - spent,
        percentSpent: (spent / budget.total) * 100,
      })
    } else {
      setBudgetData({ total: 0, spent: 0, remaining: 0, percentSpent: 0 })
    }
  }, [budget, transactions])

  useEffect(() => {
    if (bills.length > 0) {
      const total = bills.reduce((sum, bill) => sum + bill.amount, 0)
      const upcoming = bills
        .filter((bill) => new Date(bill.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 3)

      setBillsData({ total, upcoming })
    } else {
      setBillsData({ total: 0, upcoming: [] })
    }
  }, [bills])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Balance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Atual</h2>
              <p className="text-2xl font-bold mt-1">
                R$ {balanceData.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`flex items-center ${balanceData.isPositive ? "text-green-500" : "text-red-500"}`}>
              {balanceData.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              <span className="text-sm font-medium ml-1">{balanceData.percentChange.toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {balanceData.isPositive ? "Aumento" : "Redução"} em relação ao mês anterior
          </p>
        </div>

        {/* Monthly Budget */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Orçamento Mensal</h2>
          <p className="text-2xl font-bold mt-1">
            R$ {budgetData.spent.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}{" "}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              / R$ {budgetData.total.toLocaleString("pt-BR")}
            </span>
          </p>

          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${budgetData.percentSpent}%` }}></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{budgetData.percentSpent.toFixed(2)}% gasto</span>
              <span>R$ {budgetData.remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} restante</span>
            </div>
          </div>
        </div>

        {/* Bills to Pay */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contas a Pagar</h2>
          <p className="text-2xl font-bold mt-1">
            R$ {billsData.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>

          <div className="mt-4 space-y-3">
            {billsData.upcoming.length > 0 ? (
              billsData.upcoming.map((bill, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar size={14} className="text-gray-400 mr-2" />
                    <span className="text-sm">{bill.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      R$ {bill.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(bill.dueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma conta próxima</p>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Insights</h2>

          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`flex p-3 rounded-lg ${
                    insight.type === "alert"
                      ? "bg-yellow-50 dark:bg-yellow-900/20"
                      : insight.type === "opportunity"
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "bg-green-50 dark:bg-green-900/20"
                  }`}
                >
                  {insight.type === "alert" ? (
                    <AlertTriangle size={20} className="text-yellow-500 mr-3 flex-shrink-0" />
                  ) : insight.type === "opportunity" ? (
                    <Lightbulb size={20} className="text-blue-500 mr-3 flex-shrink-0" />
                  ) : (
                    <Target size={20} className="text-green-500 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-medium text-sm">{insight.message}</h3>
                    {insight.data && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">{JSON.stringify(insight.data)}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum insight disponível no momento</p>
            )}
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Distribuição de Gastos</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Transações Recentes</h2>
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 font-medium">Descrição</th>
                  <th className="pb-3 font-medium">Categoria</th>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3">{transaction.description}</td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <Tag size={14} className="text-gray-400 mr-2" />
                        {transaction.category}
                      </div>
                    </td>
                    <td className="py-3">{new Date(transaction.date).toLocaleDateString("pt-BR")}</td>
                    <td
                      className={`py-3 text-right font-medium ${
                        transaction.type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"} R${" "}
                      {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma transação recente</p>
        )}
      </div>
    </div>
  )
}


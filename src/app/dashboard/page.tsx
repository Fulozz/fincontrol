"use client"

import type React from "react"

import { useState } from "react"
import { ArrowDown, ArrowUp, Plus, AlertTriangle, Lightbulb, Target, Calendar, Tag } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data
const balanceData = {
  current: 5280.42,
  previous: 4850.75,
  percentChange: 8.86,
  isPositive: true,
}

const budgetData = {
  total: 3000,
  spent: 1850.32,
  remaining: 1149.68,
  percentSpent: 61.68,
}

const billsData = {
  total: 1245.78,
  upcoming: [
    { name: "Aluguel", amount: 850, dueDate: "15/06/2023" },
    { name: "Internet", amount: 120, dueDate: "20/06/2023" },
    { name: "Energia", amount: 275.78, dueDate: "22/06/2023" },
    { name: "Energia", amount: 275.78, dueDate: "22/06/2023" },
  ],
}

const goalsData = [
  { name: "Fundo de Emergência", target: 10000, current: 6500, percentComplete: 65 },
  { name: "Férias", target: 5000, current: 2000, percentComplete: 40 },
]

const expenseDistribution = [
  { name: "Moradia", value: 850, color: "#FF6384" },
  { name: "Alimentação", value: 450, color: "#36A2EB" },
  { name: "Transporte", value: 250, color: "#FFCE56" },
  { name: "Lazer", value: 200, color: "#4BC0C0" },
  { name: "Outros", value: 100, color: "#9966FF" },
]

const categoryBudget = [
  { name: "Moradia", budget: 900, spent: 850 },
  { name: "Alimentação", budget: 500, spent: 450 },
  { name: "Transporte", budget: 300, spent: 250 },
  { name: "Lazer", budget: 300, spent: 200 },
  { name: "Outros", budget: 200, spent: 100 },
]

const recentTransactions = [
  { id: 1, description: "Supermercado", amount: 152.35, date: "01/06/2023", category: "Alimentação", type: "expense" },
  { id: 2, description: "Salário", amount: 3500, date: "05/06/2023", category: "Receita", type: "income" },
  { id: 3, description: "Netflix", amount: 39.9, date: "07/06/2023", category: "Lazer", type: "expense" },
  { id: 4, description: "Uber", amount: 25.5, date: "10/06/2023", category: "Transporte", type: "expense" },
  { id: 5, description: "Restaurante", amount: 89.9, date: "12/06/2023", category: "Alimentação", type: "expense" },
  { id: 6, description: "Farmácia", amount: 45.6, date: "15/06/2023", category: "Saúde", type: "expense" },
  { id: 7, description: "Freelance", amount: 500, date: "18/06/2023", category: "Receita", type: "income" },
  { id: 8, description: "Shopping", amount: 199.9, date: "20/06/2023", category: "Vestuário", type: "expense" },
  { id: 9, description: "Conta de Luz", amount: 275.78, date: "22/06/2023", category: "Moradia", type: "expense" },
  { id: 10, description: "Internet", amount: 120, date: "25/06/2023", category: "Moradia", type: "expense" },
]

export default function Dashboard() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({ name: "", target: "", endDate: "" })

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the new goal to your state or database
    setShowAddGoal(false)
    setNewGoal({ name: "", target: "", endDate: "" })
  }

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
              <span className="text-sm font-medium ml-1">{balanceData.percentChange}%</span>
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
              <span>{budgetData.percentSpent}% gasto</span>
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
            {billsData.upcoming.map((bill, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar size={14} className="text-gray-400 mr-2" />
                  <span className="text-sm">{bill.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    R$ {bill.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{bill.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Insights */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Insights</h2>

          <div className="space-y-4">
            <div className="flex p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle size={20} className="text-yellow-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">Alerta de orçamento</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Você já gastou 80% do orçamento de Alimentação este mês.
                </p>
              </div>
            </div>

            <div className="flex p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Lightbulb size={20} className="text-blue-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm">Oportunidade de economia</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seus gastos com assinaturas aumentaram 15% nos últimos 3 meses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Goals */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Metas Financeiras</h2>
            {goalsData.length < 3 && (
              <button
                onClick={() => setShowAddGoal(!showAddGoal)}
                className="text-primary hover:text-primary/80 flex items-center text-sm"
              >
                <Plus size={16} className="mr-1" />
                Adicionar Meta
              </button>
            )}
          </div>

          {showAddGoal && (
            <form onSubmit={handleAddGoal} className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label htmlFor="goalName" className="block text-xs font-medium mb-1">
                    Nome da Meta
                  </label>
                  <input
                    type="text"
                    id="goalName"
                    value={newGoal.name}
                    onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="goalTarget" className="block text-xs font-medium mb-1">
                    Valor Alvo (R$)
                  </label>
                  <input
                    type="number"
                    id="goalTarget"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="goalDate" className="block text-xs font-medium mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    id="goalDate"
                    value={newGoal.endDate}
                    onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {goalsData.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Target size={16} className="text-primary mr-2" />
                    <span className="font-medium text-sm">{goal.name}</span>
                  </div>
                  <span className="text-sm font-medium">{goal.percentComplete}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${goal.percentComplete}%` }}></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    R$ {goal.current.toLocaleString("pt-BR")} / R$ {goal.target.toLocaleString("pt-BR")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Monthly Budget by Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Orçamento por Categoria</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBudget} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="budget" name="Orçado" fill="#8884d8" />
                <Bar dataKey="spent" name="Gasto" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Transações Recentes</h2>
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
                  <td className="py-3">{transaction.date}</td>
                  <td
                    className={`py-3 text-right font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}
                  >
                    {transaction.type === "income" ? "+" : "-"} R${" "}
                    {transaction.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Download } from "lucide-react"

// Mock data
const monthlyExpenses = [
  { month: "Jan", expenses: 2100, income: 3500 },
  { month: "Fev", expenses: 2300, income: 3500 },
  { month: "Mar", expenses: 1900, income: 3500 },
  { month: "Abr", expenses: 2800, income: 3800 },
  { month: "Mai", expenses: 2400, income: 3800 },
  { month: "Jun", expenses: 2200, income: 3800 },
]

const categoryExpenses = [
  { name: "Moradia", value: 1200, color: "#FF6384" },
  { name: "Alimentação", value: 450, color: "#36A2EB" },
  { name: "Transporte", value: 250, color: "#FFCE56" },
  { name: "Lazer", value: 200, color: "#4BC0C0" },
  { name: "Saúde", value: 180, color: "#9966FF" },
  { name: "Outros", value: 120, color: "#FF9F40" },
]

const savingsData = [
  { month: "Jan", amount: 500 },
  { month: "Fev", amount: 700 },
  { month: "Mar", amount: 600 },
  { month: "Abr", amount: 1000 },
  { month: "Mai", amount: 800 },
  { month: "Jun", amount: 1200 },
]

const cardExpenses = [
  { name: "Nubank", value: 1200, color: "#8A05BE" },
  { name: "Itaú", value: 850, color: "#EC7000" },
  { name: "Santander", value: 650, color: "#EC0000" },
  { name: "Conta Corrente", value: 700, color: "#333333" },
]

const dateFilters = [
  { id: "last3months", name: "Últimos 3 meses" },
  { id: "last6months", name: "Últimos 6 meses" },
  { id: "thisYear", name: "Este ano" },
  { id: "lastYear", name: "Ano passado" },
  { id: "custom", name: "Personalizado" },
]

export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState("last6months")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value)
  }

  const exportReport = () => {
    // Here you would implement the export functionality
    alert("Exportando relatório...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <select
              value={dateFilter}
              onChange={handleDateFilterChange}
              className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            >
              {dateFilters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
          {dateFilter === "custom" && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-8 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              </div>
              <span className="text-gray-500">até</span>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-8 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          )}
          <button
            onClick={exportReport}
            className="flex items-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <Download size={16} className="mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total de Despesas</div>
          <div className="text-2xl font-bold mt-1">R$ 13.700,00</div>
          <div className="text-xs text-red-500 mt-1">+8% em relação ao período anterior</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total de Receitas</div>
          <div className="text-2xl font-bold mt-1">R$ 21.900,00</div>
          <div className="text-xs text-green-500 mt-1">+5% em relação ao período anterior</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Saldo</div>
          <div className="text-2xl font-bold mt-1">R$ 8.200,00</div>
          <div className="text-xs text-green-500 mt-1">+2% em relação ao período anterior</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500 dark:text-gray-400">Economia</div>
          <div className="text-2xl font-bold mt-1">R$ 4.800,00</div>
          <div className="text-xs text-green-500 mt-1">+15% em relação ao período anterior</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Receitas vs Despesas</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="income" name="Receitas" fill="#4ade80" />
                <Bar dataKey="expenses" name="Despesas" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Despesas por Categoria</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Tendência de Economia</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Area type="monotone" dataKey="amount" name="Economia" fill="#8884d8" stroke="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses by Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Despesas por Cartão</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cardExpenses}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {cardExpenses.map((entry, index) => (
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

      {/* Financial Insights */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Insights Financeiros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-700 dark:text-blue-400">Análise de Gastos</h3>
              <p className="text-sm mt-2">
                Seus maiores gastos estão na categoria <strong>Moradia</strong>, representando <strong>49%</strong> do
                seu orçamento. Considere renegociar aluguéis ou financiamentos para reduzir este impacto.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-medium text-green-700 dark:text-green-400">Oportunidades de Economia</h3>
              <p className="text-sm mt-2">
                Você economizou <strong>R$ 1.200</strong> no último mês, um aumento de <strong>15%</strong> em relação
                ao mês anterior. Continue neste ritmo para atingir suas metas financeiras mais rapidamente.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h3 className="font-medium text-yellow-700 dark:text-yellow-400">Alertas</h3>
              <p className="text-sm mt-2">
                Seus gastos com <strong>Lazer</strong> aumentaram <strong>25%</strong> nos últimos 3 meses. Considere
                estabelecer um limite mensal para esta categoria.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-medium text-purple-700 dark:text-purple-400">Previsões</h3>
              <p className="text-sm mt-2">
                Mantendo o padrão atual de gastos e receitas, você poderá atingir sua meta de{" "}
                <strong>Fundo de Emergência</strong> em aproximadamente <strong>4 meses</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


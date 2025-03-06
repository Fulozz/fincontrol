"use client"

import type React from "react"


import { redirect } from "next/navigation"
import { useAuth } from "@/components/auth-provider";
import { useState } from "react"
import { Download, Filter, Plus, Search, ArrowUp, ArrowDown, CreditCard, Tag, Calendar } from "lucide-react"

// Mock data
const transactionsData = [
  {
    id: 1,
    description: "Supermercado",
    amount: 152.35,
    date: "2023-06-01",
    category: "Alimentação",
    cardName: "Nubank",
    type: "expense",
  },
  {
    id: 2,
    description: "Salário",
    amount: 3500,
    date: "2023-06-05",
    category: "Receita",
    cardName: "Conta Corrente",
    type: "income",
  },
  {
    id: 3,
    description: "Netflix",
    amount: 39.9,
    date: "2023-06-07",
    category: "Lazer",
    cardName: "Itaú",
    type: "expense",
  },
  {
    id: 4,
    description: "Uber",
    amount: 25.5,
    date: "2023-06-10",
    category: "Transporte",
    cardName: "Nubank",
    type: "expense",
  },
  {
    id: 5,
    description: "Restaurante",
    amount: 89.9,
    date: "2023-06-12",
    category: "Alimentação",
    cardName: "Santander",
    type: "expense",
  },
  {
    id: 6,
    description: "Farmácia",
    amount: 45.6,
    date: "2023-06-15",
    category: "Saúde",
    cardName: "Nubank",
    type: "expense",
  },
  {
    id: 7,
    description: "Freelance",
    amount: 500,
    date: "2023-06-18",
    category: "Receita",
    cardName: "Conta Corrente",
    type: "income",
  },
  {
    id: 8,
    description: "Shopping",
    amount: 199.9,
    date: "2023-06-20",
    category: "Vestuário",
    cardName: "Itaú",
    type: "expense",
  },
  {
    id: 9,
    description: "Conta de Luz",
    amount: 275.78,
    date: "2023-06-22",
    category: "Moradia",
    cardName: "Conta Corrente",
    type: "expense",
  },
  {
    id: 10,
    description: "Internet",
    amount: 120,
    date: "2023-06-25",
    category: "Moradia",
    cardName: "Conta Corrente",
    type: "expense",
  },
  {
    id: 11,
    description: "Academia",
    amount: 99.9,
    date: "2023-06-28",
    category: "Saúde",
    cardName: "Nubank",
    type: "expense",
  },
  {
    id: 12,
    description: "Presente",
    amount: 150,
    date: "2023-06-30",
    category: "Outros",
    cardName: "Santander",
    type: "expense",
  },
]

const categories = ["Todas", "Alimentação", "Moradia", "Transporte", "Lazer", "Saúde", "Vestuário", "Receita", "Outros"]

const cards = ["Todos", "Nubank", "Itaú", "Santander", "Conta Corrente"]

const dateFilters = [
  { id: "all", name: "Todos" },
  { id: "last30", name: "Últimos 30 dias" },
  { id: "thisMonth", name: "Este mês" },
  { id: "lastMonth", name: "Mês passado" },
  { id: "thisYear", name: "Este ano" },
  { id: "custom", name: "Personalizado" },
]

export default function TransactionsPage() {
    const { isAuthenticated } = useAuth();
    if(!isAuthenticated){
        redirect('/login')
    }
  const [transactions, setTransactions] = useState(transactionsData)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    category: "Todas",
    card: "Todos",
    dateFilter: "all",
    startDate: "",
    endDate: "",
  })
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Alimentação",
    cardName: "Nubank",
    type: "expense",
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the new transaction to your database
    const transactionToAdd = {
      ...newTransaction,
      id: transactions.length + 1,
      amount: Number.parseFloat(newTransaction.amount as string),
    }
    setTransactions([transactionToAdd, ...transactions])
    setShowAddTransaction(false)
    setNewTransaction({
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "Alimentação",
      cardName: "Nubank",
      type: "expense",
    })
  }

  const applyFilters = () => {
    let filtered = transactionsData

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (t) => t.description.toLowerCase().includes(searchLower) || t.category.toLowerCase().includes(searchLower),
      )
    }

    // Apply category filter
    if (filters.category !== "Todas") {
      filtered = filtered.filter((t) => t.category === filters.category)
    }

    // Apply card filter
    if (filters.card !== "Todos") {
      filtered = filtered.filter((t) => t.cardName === filters.card)
    }

    // Apply date filter
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

    const firstDayOfYear = new Date(today.getFullYear(), 0, 1)

    switch (filters.dateFilter) {
      case "last30":
        filtered = filtered.filter((t) => new Date(t.date) >= thirtyDaysAgo)
        break
      case "thisMonth":
        filtered = filtered.filter((t) => new Date(t.date) >= firstDayOfMonth)
        break
      case "lastMonth":
        filtered = filtered.filter(
          (t) => new Date(t.date) >= firstDayOfLastMonth && new Date(t.date) <= lastDayOfLastMonth,
        )
        break
      case "thisYear":
        filtered = filtered.filter((t) => new Date(t.date) >= firstDayOfYear)
        break
      case "custom":
        if (filters.startDate) {
          filtered = filtered.filter((t) => new Date(t.date) >= new Date(filters.startDate))
        }
        if (filters.endDate) {
          filtered = filtered.filter((t) => new Date(t.date) <= new Date(filters.endDate))
        }
        break
    }

    return filtered
  }

  const filteredTransactions = applyFilters()

  const exportToExcel = () => {
    // Here you would implement the Excel export functionality
    alert("Exportando para Excel...")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Transações</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter size={16} className="mr-2" />
            Filtros
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Download size={16} className="mr-2" />
            Exportar
          </button>
          <button
            onClick={() => setShowAddTransaction(!showAddTransaction)}
            className="flex items-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Buscar transações..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Categoria
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="card" className="block text-sm font-medium mb-1">
                Cartão
              </label>
              <select
                id="card"
                name="card"
                value={filters.card}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {cards.map((card, index) => (
                  <option key={index} value={card}>
                    {card}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="dateFilter" className="block text-sm font-medium mb-1">
                Período
              </label>
              <select
                id="dateFilter"
                name="dateFilter"
                value={filters.dateFilter}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {dateFilters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            </div>
            {filters.dateFilter === "custom" && (
              <>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Transaction Form */}
      {showAddTransaction && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Nova Transação</h2>
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-1">
                Valor
              </label>
              <input
                type="number"
                id="amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Data
              </label>
              <input
                type="date"
                id="date"
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">
                Tipo
              </label>
              <select
                id="type"
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Categoria
              </label>
              <select
                id="category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              >
                {categories
                  .filter((c) => c !== "Todas")
                  .map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                Cartão/Conta
              </label>
              <select
                id="cardName"
                value={newTransaction.cardName}
                onChange={(e) => setNewTransaction({ ...newTransaction, cardName: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              >
                {cards
                  .filter((c) => c !== "Todos")
                  .map((card, index) => (
                    <option key={index} value={card}>
                      {card}
                    </option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddTransaction(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cartão/Conta
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag size={14} className="text-gray-400 mr-2" />
                      {transaction.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard size={14} className="text-gray-400 mr-2" />
                      {transaction.cardName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </div>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-right font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}
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
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


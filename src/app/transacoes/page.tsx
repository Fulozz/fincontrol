"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Download, Filter, Plus, Search, ArrowUp, ArrowDown, CreditCard, Tag, Calendar } from "lucide-react"
import { useTransactionsData, useCardsData } from "@/hooks/api"
import toast from "react-hot-toast"

const categories = ["Todas", "Alimentação", "Moradia", "Transporte", "Lazer", "Saúde", "Vestuário", "Receita", "Outros"]

const dateFilters = [
  { id: "all", name: "Todos" },
  { id: "last30", name: "Últimos 30 dias" },
  { id: "thisMonth", name: "Este mês" },
  { id: "lastMonth", name: "Mês passado" },
  { id: "thisYear", name: "Este ano" },
  { id: "custom", name: "Personalizado" },
]

export default function TransactionsPage() {
  const { transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, refreshTransactions } =
    useTransactionsData()
  const { cards } = useCardsData()
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
    cardId: "",
    type: "expense",
  })

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const transactionToAdd = {
        ...newTransaction,
        amount: Number.parseFloat(newTransaction.amount as string),
      }
      await addTransaction(transactionToAdd)
      setShowAddTransaction(false)
      setNewTransaction({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "Alimentação",
        cardId: "",
        type: "expense",
      })
      toast.success("Transação adicionada com sucesso!")
      refreshTransactions()
    } catch (error) {
      toast.error("Erro ao adicionar transação")
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id)
      toast.success("Transação excluída com sucesso!")
      refreshTransactions()
    } catch (error) {
      toast.error("Erro ao excluir transação")
    }
  }

  const applyFilters = () => {
    const filterParams: any = {}
    if (filters.category !== "Todas") filterParams.category = filters.category
    if (filters.card !== "Todos") filterParams.cardId = filters.card
    if (filters.dateFilter === "custom") {
      filterParams.startDate = filters.startDate
      filterParams.endDate = filters.endDate
    } else if (filters.dateFilter !== "all") {
      // Implement date range logic for other filter options
      // For example:
      const today = new Date()
      if (filters.dateFilter === "last30") {
        filterParams.startDate = new Date(today.setDate(today.getDate() - 30)).toISOString().split("T")[0]
      }
      // Implement other date filter options...
    }
    refreshTransactions(filterParams)
  }

  useEffect(() => {
    applyFilters()
  }, [filters])

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

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
            onClick={() => {}}
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
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name}
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
                value={newTransaction.cardId}
                onChange={(e) => setNewTransaction({ ...newTransaction, cardId: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              >
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.name}
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
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
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
                      {cards.find((card) => card.id === transaction.cardId)?.name || "N/A"}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
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


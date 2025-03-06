"use client"

import type React from "react"


import { redirect } from "next/navigation"
import { useAuth } from "@/components/auth-provider";
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Mock data
const initialBudget = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  total: 3000,
  categories: [
    { id: 1, name: "Moradia", value: 900, color: "#FF6384" },
    { id: 2, name: "Alimentação", value: 500, color: "#36A2EB" },
    { id: 3, name: "Transporte", value: 300, color: "#FFCE56" },
    { id: 4, name: "Lazer", value: 300, color: "#4BC0C0" },
    { id: 5, name: "Outros", value: 200, color: "#9966FF" },
  ],
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export default function BudgetPage() {
    const { isAuthenticated } = useAuth();
    if(!isAuthenticated){
        redirect('/login')
    }
  const [budget, setBudget] = useState(initialBudget)
  const [newCategory, setNewCategory] = useState({ name: "", value: "", color: "#000000" })
  const [showAddCategory, setShowAddCategory] = useState(false)

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the new category to your database
    const categoryToAdd = {
      id: budget.categories.length + 1,
      name: newCategory.name,
      value: Number.parseFloat(newCategory.value),
      color: newCategory.color,
    }

    const updatedCategories = [...budget.categories, categoryToAdd]
    const newTotal = updatedCategories.reduce((sum, cat) => sum + cat.value, 0)

    setBudget({
      ...budget,
      total: newTotal,
      categories: updatedCategories,
    })

    setNewCategory({ name: "", value: "", color: "#000000" })
    setShowAddCategory(false)
  }

  const handleDeleteCategory = (id: number) => {
    // Here you would delete the category from your database
    const updatedCategories = budget.categories.filter((cat) => cat.id !== id)
    const newTotal = updatedCategories.reduce((sum, cat) => sum + cat.value, 0)

    setBudget({
      ...budget,
      total: newTotal,
      categories: updatedCategories,
    })
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBudget({
      ...budget,
      month: Number.parseInt(e.target.value),
    })
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBudget({
      ...budget,
      year: Number.parseInt(e.target.value),
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orçamento</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Definir Orçamento</h2>
            <div className="flex space-x-2">
              <select
                value={budget.month}
                onChange={handleMonthChange}
                className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={budget.year}
                onChange={handleYearChange}
                className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              >
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - 2 + i
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-medium">Categorias</h3>
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="flex items-center text-primary hover:text-primary/80 text-sm"
              >
                <Plus size={16} className="mr-1" />
                Adicionar Categoria
              </button>
            </div>

            {showAddCategory && (
              <form onSubmit={handleAddCategory} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="categoryName" className="block text-xs font-medium mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryValue" className="block text-xs font-medium mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      id="categoryValue"
                      value={newCategory.value}
                      onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryColor" className="block text-xs font-medium mb-1">
                      Cor
                    </label>
                    <input
                      type="color"
                      id="categoryColor"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="w-full p-1 h-9 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Adicionar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {budget.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: category.color }}></div>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4 font-medium">
                      R$ {category.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total do Orçamento:</span>
              <span className="text-lg font-bold">
                R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Visualization */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-6">Visualização do Orçamento</h2>

          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budget.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {budget.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h3 className="text-md font-medium">Distribuição do Orçamento</h3>
            <div className="space-y-3">
              {budget.categories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">
                        R$ {category.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        ({((category.value / budget.total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${(category.value / budget.total) * 100}%`,
                        backgroundColor: category.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


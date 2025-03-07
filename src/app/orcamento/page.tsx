"use client"

import type React from "react"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useBudgetData } from "@/hooks/api"
import toast from "react-hot-toast"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C", "#D0ED57"]

export default function BudgetPage() {
  const { budget, loading, error, updateBudget, refreshBudget } = useBudgetData()
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", value: "", color: "#000000" })
  const [editingCategory, setEditingCategory] = useState<string | null>(null)

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!budget) return

    try {
      const updatedCategories = [
        ...budget.categories,
        { ...newCategory, id: Date.now().toString(), value: Number(newCategory.value) },
      ]
      await updateBudget({
        ...budget,
        categories: updatedCategories,
        total: updatedCategories.reduce((sum, cat) => sum + cat.value, 0),
      })
      setShowAddCategory(false)
      setNewCategory({ name: "", value: "", color: "#000000" })
      toast.success("Categoria adicionada com sucesso!")
      refreshBudget()
    } catch (error) {
      toast.error("Erro ao adicionar categoria")
    }
  }

  const handleUpdateCategory = async (id: string, updatedCategory: { name: string; value: string; color: string }) => {
    if (!budget) return

    try {
      const updatedCategories = budget.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updatedCategory, value: Number(updatedCategory.value) } : cat,
      )
      await updateBudget({
        ...budget,
        categories: updatedCategories,
        total: updatedCategories.reduce((sum, cat) => sum + cat.value, 0),
      })
      setEditingCategory(null)
      toast.success("Categoria atualizada com sucesso!")
      refreshBudget()
    } catch (error) {
      toast.error("Erro ao atualizar categoria")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!budget) return

    try {
      const updatedCategories = budget.categories.filter((cat) => cat.id !== id)
      await updateBudget({
        ...budget,
        categories: updatedCategories,
        total: updatedCategories.reduce((sum, cat) => sum + cat.value, 0),
      })
      toast.success("Categoria excluída com sucesso!")
      refreshBudget()
    } catch (error) {
      toast.error("Erro ao excluir categoria")
    }
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>
  if (!budget) return <div>Nenhum orçamento encontrado</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orçamento</h1>
        <button
          onClick={() => setShowAddCategory(!showAddCategory)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Categoria
        </button>
      </div>

      {showAddCategory && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Nova Categoria</h2>
          <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium mb-1">
                Nome da Categoria
              </label>
              <input
                type="text"
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="categoryValue" className="block text-sm font-medium mb-1">
                Valor
              </label>
              <input
                type="number"
                id="categoryValue"
                value={newCategory.value}
                onChange={(e) => setNewCategory({ ...newCategory, value: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="categoryColor" className="block text-sm font-medium mb-1">
                Cor
              </label>
              <input
                type="color"
                id="categoryColor"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-full p-1 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div className="md:col-span-3 flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddCategory(false)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Distribuição do Orçamento</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budget.categories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {budget.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Categorias do Orçamento</h2>
          <div className="space-y-4">
            {budget.categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between">
                {editingCategory === category.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleUpdateCategory(category.id, {
                        name: e.currentTarget.categoryName.value,
                        value: e.currentTarget.categoryValue.value,
                        color: e.currentTarget.categoryColor.value,
                      })
                    }}
                    className="flex-1 flex items-center space-x-2"
                  >
                    <input
                      name="categoryName"
                      defaultValue={category.name}
                      className="flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                    <input
                      name="categoryValue"
                      type="number"
                      defaultValue={category.value}
                      className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                    <input
                      name="categoryColor"
                      type="color"
                      defaultValue={category.color}
                      className="w-10 h-8 p-0 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    />
                    <button type="submit" className="text-green-500 hover:text-green-700">
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>R$ {category.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      <button
                        onClick={() => setEditingCategory(category.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">
                R$ {budget.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


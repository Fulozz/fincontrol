"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Calendar, DollarSign, Tag } from "lucide-react"
import { useBillsData } from "@/hooks/api"
import toast from "react-hot-toast"

export default function BillsPage() {
  const { bills, loading, error, addBill, updateBill, deleteBill, refreshBills } = useBillsData()
  const [showAddBill, setShowAddBill] = useState(false)
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDate: "",
    type: "recurring",
    category: "",
    installments: "",
    currentInstallment: "",
  })

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const billToAdd = {
        ...newBill,
        amount: Number(newBill.amount),
        installments: newBill.type === "installment" ? Number(newBill.installments) : undefined,
        currentInstallment: newBill.type === "installment" ? Number(newBill.currentInstallment) : undefined,
      }
      await addBill(billToAdd)
      setShowAddBill(false)
      setNewBill({
        name: "",
        amount: "",
        dueDate: "",
        type: "recurring",
        category: "",
        installments: "",
        currentInstallment: "",
      })
      toast.success("Conta adicionada com sucesso!")
      refreshBills()
    } catch (error) {
      toast.error("Erro ao adicionar conta")
    }
  }

  const handleDeleteBill = async (id: string) => {
    try {
      await deleteBill(id)
      toast.success("Conta excluída com sucesso!")
      refreshBills()
    } catch (error) {
      toast.error("Erro ao excluir conta")
    }
  }

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contas a Pagar</h1>
        <button
          onClick={() => setShowAddBill(!showAddBill)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Conta
        </button>
      </div>

      {showAddBill && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Nova Conta</h2>
          <form onSubmit={handleAddBill} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="billName" className="block text-sm font-medium mb-1">
                Nome da Conta
              </label>
              <input
                type="text"
                id="billName"
                value={newBill.name}
                onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="billAmount" className="block text-sm font-medium mb-1">
                Valor
              </label>
              <input
                type="number"
                id="billAmount"
                value={newBill.amount}
                onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="billDueDate" className="block text-sm font-medium mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                id="billDueDate"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="billType" className="block text-sm font-medium mb-1">
                Tipo
              </label>
              <select
                id="billType"
                value={newBill.type}
                onChange={(e) => setNewBill({ ...newBill, type: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              >
                <option value="recurring">Recorrente</option>
                <option value="installment">Parcelado</option>
              </select>
            </div>
            <div>
              <label htmlFor="billCategory" className="block text-sm font-medium mb-1">
                Categoria
              </label>
              <input
                type="text"
                id="billCategory"
                value={newBill.category}
                onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            {newBill.type === "installment" && (
              <>
                <div>
                  <label htmlFor="billInstallments" className="block text-sm font-medium mb-1">
                    Número de Parcelas
                  </label>
                  <input
                    type="number"
                    id="billInstallments"
                    value={newBill.installments}
                    onChange={(e) => setNewBill({ ...newBill, installments: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billCurrentInstallment" className="block text-sm font-medium mb-1">
                    Parcela Atual
                  </label>
                  <input
                    type="number"
                    id="billCurrentInstallment"
                    value={newBill.currentInstallment}
                    onChange={(e) => setNewBill({ ...newBill, currentInstallment: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    min="1"
                    required
                  />
                </div>
              </>
            )}
            <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddBill(false)}
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">{bill.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag size={14} className="text-gray-400 mr-2" />
                      {bill.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-gray-400 mr-2" />
                      {new Date(bill.dueDate).toLocaleDateString("pt-BR")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign size={14} className="text-gray-400 mr-2" />
                      R$ {bill.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {bill.type === "recurring"
                      ? "Recorrente"
                      : `Parcelado (${bill.currentInstallment}/${bill.installments})`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteBill(bill.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
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


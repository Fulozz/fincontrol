"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, Calendar, DollarSign, ArrowRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data
const initialBills = [
  { id: 1, name: "Aluguel", amount: 850, dueDay: 15, type: "recurring", category: "Moradia" },
  { id: 2, name: "Internet", amount: 120, dueDay: 20, type: "recurring", category: "Moradia" },
  { id: 3, name: "Energia", amount: 275.78, dueDay: 22, type: "recurring", category: "Moradia" },
  { id: 4, name: "Celular", amount: 89.9, dueDay: 10, type: "recurring", category: "Comunicação" },
  {
    id: 5,
    name: "TV",
    amount: 150,
    installments: 12,
    currentInstallment: 3,
    dueDay: 5,
    type: "installment",
    category: "Eletrônicos",
  },
]

const categories = [
  "Moradia",
  "Transporte",
  "Alimentação",
  "Saúde",
  "Educação",
  "Lazer",
  "Comunicação",
  "Eletrônicos",
  "Outros",
]

// Generate forecast data
const generateForecastData = (bills: any[], monthlyIncome: number) => {
  const months = ["Atual", "Mês 2", "Mês 3", "Mês 4", "Mês 5", "Mês 6"]
  const data = []

  const balance = monthlyIncome
  const monthlyExpenses = bills.reduce((sum, bill) => {
    if (bill.type === "recurring") {
      return sum + bill.amount
    } else {
      // For installment bills, only count remaining installments
      const remainingInstallments = bill.installments - bill.currentInstallment
      return sum + (remainingInstallments > 0 ? bill.amount : 0)
    }
  }, 0)

  for (let i = 0; i < months.length; i++) {
    // For the first month, we just have the initial balance
    if (i === 0) {
      data.push({
        name: months[i],
        balance: balance,
        expenses: monthlyExpenses,
        accumulated: balance - monthlyExpenses,
      })
    } else {
      // For subsequent months, add income and subtract expenses
      const previousAccumulated:any = data[i - 1].accumulated
      const newBalance:any = previousAccumulated + monthlyIncome

      // Adjust expenses for installment bills that will be paid off
      let adjustedExpenses = monthlyExpenses
      bills.forEach((bill) => {
        if (bill.type === "installment") {
          const installmentsLeftAfterThisMonth = bill.installments - bill.currentInstallment - i
          if (installmentsLeftAfterThisMonth === 0) {
            adjustedExpenses -= bill.amount
          }
        }
      })

      data.push({
        name: months[i],
        balance: newBalance,
        expenses: adjustedExpenses,
        accumulated: newBalance - adjustedExpenses,
      })
    }
  }

  return data
}

export default function BillsPage() {
  const [bills, setBills] = useState(initialBills)
  const [showAddBill, setShowAddBill] = useState(false)
  const [billType, setBillType] = useState("recurring")
  const [newBill, setNewBill] = useState({
    name: "",
    amount: "",
    dueDay: "",
    type: "recurring",
    category: "Moradia",
    installments: "",
    currentInstallment: "",
  })
  const [monthlyIncome, setMonthlyIncome] = useState(3500)

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the new bill to your database
    const billToAdd: any = {
      ...newBill,
      id: bills.length + 1,
      amount: Number.parseFloat(newBill.amount as string),
      dueDay: Number.parseInt(newBill.dueDay as string),
      type: billType,
    }
    if (billType === "installment") {
      billToAdd.installments = Number.parseInt(newBill.installments as string)
      billToAdd.currentInstallment = Number.parseInt(newBill.currentInstallment as string)
    }
    setBills([...bills, billToAdd])
    setShowAddBill(false)
    setNewBill({
      name: "",
      amount: "",
      dueDay: "",
      type: "recurring",
      category: "Moradia",
      installments: "",
      currentInstallment: "",
    })
  }

  const handleDeleteBill = (id: number) => {
    // Here you would delete the bill from your database
    setBills(bills.filter((bill) => bill.id !== id))
  }

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyIncome(Number.parseFloat(e.target.value) || 0)
  }

  const forecastData = generateForecastData(bills, monthlyIncome)
  const totalMonthlyBills = bills.reduce((sum, bill) => sum + bill.amount, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contas a Pagar</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bills Management */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Minhas Contas</h2>
            <button
              onClick={() => setShowAddBill(!showAddBill)}
              className="flex items-center px-3 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus size={16} className="mr-2" />
              Adicionar Conta
            </button>
          </div>

          {showAddBill && (
            <form onSubmit={handleAddBill} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="mb-4">
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setBillType("recurring")}
                    className={`flex-1 py-2 rounded-md ${billType === "recurring" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"}`}
                  >
                    Recorrente
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillType("installment")}
                    className={`flex-1 py-2 rounded-md ${billType === "installment" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200"}`}
                  >
                    Parcelada
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="billName" className="block text-sm font-medium mb-1">
                      Nome da Conta
                    </label>
                    <input
                      type="text"
                      id="billName"
                      value={newBill.name}
                      onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billAmount" className="block text-sm font-medium mb-1">
                      Valor (R$)
                    </label>
                    <input
                      type="number"
                      id="billAmount"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billDueDay" className="block text-sm font-medium mb-1">
                      Dia de Vencimento
                    </label>
                    <input
                      type="number"
                      id="billDueDay"
                      value={newBill.dueDay}
                      onChange={(e) => setNewBill({ ...newBill, dueDay: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      min="1"
                      max="31"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="billCategory" className="block text-sm font-medium mb-1">
                      Categoria
                    </label>
                    <select
                      id="billCategory"
                      value={newBill.category}
                      onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                      required
                    >
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {billType === "installment" && (
                    <>
                      <div>
                        <label htmlFor="billInstallments" className="block text-sm font-medium mb-1">
                          Total de Parcelas
                        </label>
                        <input
                          type="number"
                          id="billInstallments"
                          value={newBill.installments}
                          onChange={(e) => setNewBill({ ...newBill, installments: e.target.value })}
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                          min="2"
                          required={billType === "installment"}
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
                          className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                          min="1"
                          max={newBill.installments}
                          required={billType === "installment"}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddBill(false)}
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

          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <h3 className="font-medium text-gray-500 dark:text-gray-400">Contas Recorrentes</h3>
            {bills
              .filter((bill) => bill.type === "recurring")
              .map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{bill.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{bill.category}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end mr-4">
                      <div className="font-medium">
                        R$ {bill.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        Dia {bill.dueDay}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteBill(bill.id)} className="text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

            <h3 className="font-medium text-gray-500 dark:text-gray-400 mt-6">Contas Parceladas</h3>
            {bills
              .filter((bill) => bill.type === "installment")
              .map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{bill.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{bill.category}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex flex-col items-end mr-4">
                      <div className="font-medium">
                        R$ {bill.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        Dia {bill.dueDay} ({bill.currentInstallment}/{bill.installments})
                      </div>
                    </div>
                    <button onClick={() => handleDeleteBill(bill.id)} className="text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

            {bills.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">Nenhuma conta cadastrada</div>
            )}
          </div>
        </div>

        {/* Financial Forecast */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-6">Previsão Financeira</h2>

          <div className="mb-6">
            <label htmlFor="monthlyIncome" className="block text-sm font-medium mb-2">
              Rendimento Mensal (R$)
            </label>
            <div className="flex items-center">
              <DollarSign size={18} className="text-gray-400 mr-2" />
              <input
                type="number"
                id="monthlyIncome"
                value={monthlyIncome}
                onChange={handleIncomeChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Resumo Mensal</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Valores em R$</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Rendimento</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400">Contas</div>
                <div className="text-lg font-bold text-red-600 dark:text-red-400">
                  {totalMonthlyBills.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Saldo</div>
                <div
                  className={`text-lg font-bold ${(monthlyIncome - totalMonthlyBills) >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {(monthlyIncome - totalMonthlyBills).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Projeção para 6 meses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Legend />
                  <Bar dataKey="balance" name="Saldo" fill="#8884d8" />
                  <Bar dataKey="expenses" name="Despesas" fill="#ff7c7c" />
                  <Bar dataKey="accumulated" name="Acumulado" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-3">Dicas para Economizar</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Revise suas contas recorrentes e cancele serviços não utilizados.</span>
              </li>
              <li className="flex items-start">
                <ArrowRight size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">Negocie descontos para pagamentos antecipados de contas parceladas.</span>
              </li>
              <li className="flex items-start">
                <ArrowRight size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span className="text-sm">
                  Estabeleça um limite máximo para despesas mensais com base no seu rendimento.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}


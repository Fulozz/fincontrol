"use client"

import { useState, useEffect } from "react"
import { DollarSign } from "lucide-react"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"

export function DashboardHeader() {
  const [date, setDate] = useState<Date>(new Date())
  const [showAddTransaction, setShowAddTransaction] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">{formattedDate}</p>
          </div>
          <button
            onClick={() => setShowAddTransaction(true)}
            className="inline-flex items-center px-4 py-2 transition ease-in-out duration-200 border text-sm font-medium rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-black dark:hover:bg-black/85 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <DollarSign className="mr-2 h-5 w-5" />
            Nova Transação
          </button>
        </div>
      </div>
      {showAddTransaction && (
        <AddTransactionDialog open={showAddTransaction} onClose={() => setShowAddTransaction(false)} />
      )}
    </div>
  )
}
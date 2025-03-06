import { useState, useEffect } from 'react'

// Tipos
export type Card = {
  id: string
  name: string
  lastDigits: string
  limit: number
  availableLimit: number
  dueDate: number
  closingDate: number
  type: string
  color: string
}

export type Transaction = {
  id: number
  description: string
  amount: number
  date: string
  category: string
  type: 'income' | 'expense'
}

export type Budget = {
  month: number
  year: number
  total: number
  categories: {
    id: number
    name: string
    value: number
    color: string
  }[]
}

// Mock data
const cardsData: Card[] = [
  {
    id: "1",
    name: "Nubank",
    lastDigits: "4567",
    limit: 5000,
    availableLimit: 3200,
    dueDate: 10,
    closingDate: 3,
    type: "Crédito",
    color: "#8A05BE"
  },
  {
    id: "2",
    name: "Itaú",
    lastDigits: "1234",
    limit: 3500,
    availableLimit: 1500,
    dueDate: 15,
    closingDate: 8,
    type: "Crédito",
    color: "#EC7000"
  },
]

const transactionsData: Transaction[] = [
  { id: 1, description: "Supermercado", amount: 152.35, date: "2023-06-01", category: "Alimentação", type: "expense" },
  { id: 2, description: "Netflix", amount: 39.90, date: "2023-06-07", category: "Lazer", type: "expense" },
  { id: 3, description: "Farmácia", amount: 45.60, date: "2023-06-15", category: "Saúde", type: "expense" },
  { id: 4, description: "Restaurante", amount: 89.90, date: "2023-06-18", category: "Alimentação", type: "expense" },
  { id: 5, description: "Uber", amount: 25.50, date: "2023-06-20", category: "Transporte", type: "expense" },
]

const budgetData: Budget = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  total: 3000,
  categories: [
    { id: 1, name: "Moradia", value: 900, color: "#FF6384" },
    { id: 2, name: "Alimentação", value: 500, color: "#36A2EB" },
    { id: 3, name: "Transporte", value: 300, color: "#FFCE56" },
    { id: 4, name: "Lazer", value: 300, color: "#4BC0C0" },
    { id: 5, name: "Outros", value: 200, color: "#9966FF" }
  ]
}

// Hooks
export function useCardsData() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      setCards(cardsData)
      setLoading(false)
    }, 500)
  }, [])

  return { cards, loading }
}

export function useCardDetails(id: string) {
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      const foundCard = cardsData.find(c => c.id === id)
      setCard(foundCard || null)
      setLoading(false)
    }, 500)
  }, [id])

  return { card, loading }
}

export function useTransactionsData() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      setTransactions(transactionsData)
      setLoading(false)
    }, 500)
  }, [])

  return { transactions, loading }
}

export function useBudgetData() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simula uma chamada de API
    setTimeout(() => {
      setBudget(budgetData)
      setLoading(false)
    }, 500)
  }, [])

  return { budget, loading }
}

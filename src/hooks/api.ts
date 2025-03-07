"use client"

import { useState, useEffect } from "react"

// Tipos
export type User = {
  id: string
  name: string
  email: string
}

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
  id: string
  description: string
  amount: number
  date: string
  category: string
  type: "income" | "expense"
  cardId?: string
}

export type Budget = {
  id: string
  month: number
  year: number
  total: number
  categories: {
    id: string
    name: string
    value: number
    color: string
  }[]
}

export type Bill = {
  id: string
  name: string
  amount: number
  dueDate: string
  type: "recurring" | "installment"
  category: string
  installments?: number
  currentInstallment?: number
}

export type FinancialInsight = {
  id: string
  type: "alert" | "opportunity" | "achievement"
  message: string
  data?: any
}

const API_BASE_URL = "https://portfolio-backend-zpig.onrender.com/api/v1"

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers })
  if (!response.ok) {
    throw new Error("API request failed")
  }
  return response.json()
}

export function useAuth() {
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error("Login failed")
    }
    const data = await response.json()
    localStorage.setItem("token", data.token)
    return data.user
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (!response.ok) {
      throw new Error("Registration failed")
    }
    return response.json()
  }

  const logout = () => {
    localStorage.removeItem("token")
  }

  return { login, register, logout }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithAuth("/user")
      .then((data) => {
        setUser(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { user, loading, error }
}

export function useCardsData() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = () => {
    setLoading(true)
    fetchWithAuth("/cards")
      .then((data) => {
        setCards(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const addCard = async (card: Omit<Card, "id">) => {
    const newCard = await fetchWithAuth("/cards", {
      method: "POST",
      body: JSON.stringify(card),
    })
    setCards([...cards, newCard])
    return newCard
  }

  const updateCard = async (id: string, card: Partial<Card>) => {
    const updatedCard = await fetchWithAuth(`/cards/${id}`, {
      method: "PUT",
      body: JSON.stringify(card),
    })
    setCards(cards.map((c) => (c.id === id ? updatedCard : c)))
    return updatedCard
  }

  const deleteCard = async (id: string) => {
    await fetchWithAuth(`/cards/${id}`, { method: "DELETE" })
    setCards(cards.filter((c) => c.id !== id))
  }

  return { cards, loading, error, addCard, updateCard, deleteCard, refreshCards: fetchCards }
}

export function useCardDetails(id: string) {
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWithAuth(`/cards/${id}`)
      .then((data) => {
        setCard(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  return { card, loading, error }
}

export function useTransactionsData() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = (filters?: {
    startDate?: string
    endDate?: string
    category?: string
    cardId?: string
  }) => {
    setLoading(true)
    const queryParams = new URLSearchParams(filters as Record<string, string>).toString()
    fetchWithAuth(`/transactions?${queryParams}`)
      .then((data) => {
        setTransactions(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const newTransaction = await fetchWithAuth("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    })
    setTransactions([...transactions, newTransaction])
    return newTransaction
  }

  const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    const updatedTransaction = await fetchWithAuth(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transaction),
    })
    setTransactions(transactions.map((t) => (t.id === id ? updatedTransaction : t)))
    return updatedTransaction
  }

  const deleteTransaction = async (id: string) => {
    await fetchWithAuth(`/transactions/${id}`, { method: "DELETE" })
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
  }
}

export function useBudgetData() {
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudget = (month?: number, year?: number) => {
    setLoading(true)
    const queryParams = new URLSearchParams({ month: month?.toString() || "", year: year?.toString() || "" }).toString()
    fetchWithAuth(`/budget?${queryParams}`)
      .then((data) => {
        setBudget(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBudget()
  }, [])

  const updateBudget = async (budgetData: Omit<Budget, "id">) => {
    const updatedBudget = await fetchWithAuth("/budget", {
      method: "POST",
      body: JSON.stringify(budgetData),
    })
    setBudget(updatedBudget)
    return updatedBudget
  }

  return { budget, loading, error, updateBudget, refreshBudget: fetchBudget }
}

export function useBillsData() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBills = () => {
    setLoading(true)
    fetchWithAuth("/bills")
      .then((data) => {
        setBills(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchBills()
  }, [])

  const addBill = async (bill: Omit<Bill, "id">) => {
    const newBill = await fetchWithAuth("/bills", {
      method: "POST",
      body: JSON.stringify(bill),
    })
    setBills([...bills, newBill])
    return newBill
  }

  const updateBill = async (id: string, bill: Partial<Bill>) => {
    const updatedBill = await fetchWithAuth(`/bills/${id}`, {
      method: "PUT",
      body: JSON.stringify(bill),
    })
    setBills(bills.map((b) => (b.id === id ? updatedBill : b)))
    return updatedBill
  }

  const deleteBill = async (id: string) => {
    await fetchWithAuth(`/bills/${id}`, { method: "DELETE" })
    setBills(bills.filter((b) => b.id !== id))
  }

  return { bills, loading, error, addBill, updateBill, deleteBill, refreshBills: fetchBills }
}

export function useFinancialInsights() {
  const [insights, setInsights] = useState<FinancialInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = () => {
    setLoading(true)
    fetchWithAuth("/insights")
      .then((data) => {
        setInsights(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return { insights, loading, error, refreshInsights: fetchInsights }
}

// Descrição dos endpoints necessários para a API

/*
Base URL: https://portfolio-backend-zpig.onrender.com/api/v1

Todos os endpoints, exceto login e registro, requerem autenticação. 
O token deve ser enviado no header `Authorization` como `Bearer <token>`.

1. Autenticação
   POST /auth/login
   - Body: { email: string, password: string }
   - Response: { token: string, user: User }

   POST /auth/register
   - Body: { name: string, email: string, password: string }
   - Response: User

2. Usuário
   GET /user
   - Response: User

3. Cartões
   GET /cards
   - Response: Card[]

   GET /cards/:id
   - Response: Card

   POST /cards
   - Body: Omit<Card, 'id'>
   - Response: Card

   PUT /cards/:id
   - Body: Partial<Card>
   - Response: Card

   DELETE /cards/:id
   - Response: void

4. Transações
   GET /transactions
   - Query params: startDate?: string, endDate?: string, category?: string, cardId?: string
   - Response: Transaction[]

   POST /transactions
   - Body: Omit<Transaction, 'id'>
   - Response: Transaction

   PUT /transactions/:id
   - Body: Partial<Transaction>
   - Response: Transaction

   DELETE /transactions/:id
   - Response: void

5. Orçamento
   GET /budget
   - Query params: month?: number, year?: number
   - Response: Budget

   POST /budget
   - Body: Omit<Budget, 'id'>
   - Response: Budget

6. Contas a Pagar
   GET /bills
   - Response: Bill[]

   POST /bills
   - Body: Omit<Bill, 'id'>
   - Response: Bill

   PUT /bills/:id
   - Body: Partial<Bill>
   - Response: Bill

   DELETE /bills/:id
   - Response: void

7. Insights Financeiros
   GET /insights
   - Response: FinancialInsight[]

Observações:
- Todos os endpoints devem retornar um status 401 se o token de autenticação for inválido ou estiver ausente.
- Os endpoints de listagem (GET) devem suportar paginação e ordenação quando apropriado.
- Implemente validação adequada para todos os dados de entrada.
- Considere implementar rate limiting para prevenir abuso da API.
- Implemente logs adequados para monitoramento e depuração.
- Considere adicionar endpoints para operações em lote, se necessário (por exemplo, criar múltiplas transações de uma vez).
*/


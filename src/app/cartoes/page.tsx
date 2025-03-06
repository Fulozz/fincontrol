"use client"

import type React from "react"


import { redirect } from "next/navigation"
import { useAuth } from "@/components/auth-provider";
import { useState } from "react"
import { CreditCard, Plus, Edit, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"

// Mock data
const cardsData = [
  {
    id: 1,
    name: "Nubank",
    lastDigits: "4567",
    limit: 5000,
    dueDate: 10,
    closingDate: 3,
    type: "Crédito",
    color: "#8A05BE",
  },
  {
    id: 2,
    name: "Itaú",
    lastDigits: "1234",
    limit: 3500,
    dueDate: 15,
    closingDate: 8,
    type: "Crédito",
    color: "#EC7000",
  },
  {
    id: 3,
    name: "Santander",
    lastDigits: "9876",
    limit: 7000,
    dueDate: 20,
    closingDate: 13,
    type: "Crédito",
    color: "#EC0000",
  },
]

export default function CardsPage() {
    const { isAuthenticated } = useAuth();
    if(!isAuthenticated){
        redirect('/login')
    }
  const [showAddCard, setShowAddCard] = useState(false)
  const [cards, setCards] = useState(cardsData)
  const [newCard, setNewCard] = useState({
    name: "",
    lastDigits: "",
    limit: "",
    dueDate: "",
    closingDate: "",
    type: "Crédito",
    color: "#000000",
  })

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would add the new card to your database
    const cardToAdd = {
      ...newCard,
      id: cards.length + 1,
      limit: Number.parseFloat(newCard.limit as string),
      dueDate: Number.parseInt(newCard.dueDate as string),
      closingDate: Number.parseInt(newCard.closingDate as string),
    }
    setCards([...cards, cardToAdd])
    setShowAddCard(false)
    setNewCard({
      name: "",
      lastDigits: "",
      limit: "",
      dueDate: "",
      closingDate: "",
      type: "Crédito",
      color: "#000000",
    })
  }

  const handleDeleteCard = (id: number) => {
    // Here you would delete the card from your database
    setCards(cards.filter((card) => card.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Cartões</h1>
        <button
          onClick={() => setShowAddCard(!showAddCard)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          <Plus size={16} className="mr-2" />
          Adicionar Cartão
        </button>
      </div>

      {showAddCard && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Novo Cartão</h2>
          <form onSubmit={handleAddCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium mb-1">
                Nome do Cartão
              </label>
              <input
                type="text"
                id="cardName"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="cardLastDigits" className="block text-sm font-medium mb-1">
                Últimos 4 dígitos
              </label>
              <input
                type="text"
                id="cardLastDigits"
                value={newCard.lastDigits}
                onChange={(e) => setNewCard({ ...newCard, lastDigits: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                maxLength={4}
                pattern="[0-9]{4}"
                required
              />
            </div>
            <div>
              <label htmlFor="cardLimit" className="block text-sm font-medium mb-1">
                Limite do Cartão
              </label>
              <input
                type="number"
                id="cardLimit"
                value={newCard.limit}
                onChange={(e) => setNewCard({ ...newCard, limit: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label htmlFor="cardType" className="block text-sm font-medium mb-1">
                Tipo do Cartão
              </label>
              <select
                id="cardType"
                value={newCard.type}
                onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              >
                <option value="Crédito">Crédito</option>
                <option value="Débito">Débito</option>
                <option value="Múltiplo">Múltiplo</option>
              </select>
            </div>
            <div>
              <label htmlFor="cardDueDate" className="block text-sm font-medium mb-1">
                Dia de Vencimento
              </label>
              <input
                type="number"
                id="cardDueDate"
                value={newCard.dueDate}
                onChange={(e) => setNewCard({ ...newCard, dueDate: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="1"
                max="31"
                required
              />
            </div>
            <div>
              <label htmlFor="cardClosingDate" className="block text-sm font-medium mb-1">
                Dia de Fechamento
              </label>
              <input
                type="number"
                id="cardClosingDate"
                value={newCard.closingDate}
                onChange={(e) => setNewCard({ ...newCard, closingDate: e.target.value })}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                min="1"
                max="31"
                required
              />
            </div>
            <div>
              <label htmlFor="cardColor" className="block text-sm font-medium mb-1">
                Cor
              </label>
              <input
                type="color"
                id="cardColor"
                value={newCard.color}
                onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                className="w-full p-1 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowAddCard(false)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6 text-white" style={{ backgroundColor: card.color }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{card.name}</h3>
                  <p className="text-sm opacity-80">{card.type}</p>
                </div>
                <CreditCard size={24} />
              </div>
              <div className="mt-6">
                <p className="text-sm opacity-80">**** **** **** {card.lastDigits}</p>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Limite:</span>
                <span className="text-sm font-medium">
                  R$ {card.limit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Vencimento:</span>
                <span className="text-sm font-medium">Dia {card.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Fechamento:</span>
                <span className="text-sm font-medium">Dia {card.closingDate}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-500 hover:text-primary">
                    <Edit size={18} />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-500" onClick={() => handleDeleteCard(card.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
                <Link href={`/cartoes/${card.id}`} className="flex items-center text-primary text-sm hover:underline">
                  Detalhes
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


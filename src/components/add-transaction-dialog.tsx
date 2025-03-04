"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

type AddTransactionDialogProps = {
  open: boolean
  onClose: () => void
}

type TransactionFormData = {
  descricao: string
  valor: string
  categoria: string
  tipo: string
}

export function AddTransactionDialog({ open, onClose }: AddTransactionDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    defaultValues: {
      descricao: "",
      valor: "",
      categoria: "",
      tipo: "despesa",
    },
  })

  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true)

    try {
      // In a real app, you would send this data to your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Transaction added successfully")

      reset()
      onClose()
    } catch (error) {
      toast.error("Failed to add transaction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div onClick={onClose} className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Nova Transação
                </h3>
                <div className="mt-2">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                        Tipo
                      </label>
                      <select
                        id="tipo"
                        className="mt-1 block w-full pl-4 pr-10 py-2 px-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        {...register("tipo", { required: "Tipo é necessario" })}
                      >
                        <option value="recebido">Recebido</option>
                        <option value="despesa">Despesa</option>
                      </select>
                      {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="valor" className="block text-sm font-medium text-gray-700">
                        Valor
                      </label>
                      <input
                        type="number"
                        id="valor"
                        step="0.01"
                        className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md"
                        {...register("valor", {
                          required: "Valor é necessario",
                          min: { value: 0.01, message: "valor must be greater than 0" },
                        })}
                      />
                      {errors.valor && <p className="mt-1 text-sm text-red-600">{errors.valor.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                        Categoria
                      </label>
                      <select
                        id="categoria"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        {...register("categoria", { required: "Categoria é necessario" })}
                      >
                        <option value="">Seleciona a categoria</option>
                        <option value="casa">Casa</option>
                        <option value="comida">Comida & almoço</option>
                        <option value="transporte">Transporte</option>
                        <option value="entreterimento">Entreterimento</option>
                        <option value="utilidades">Utilidades</option>
                        <option value="saude">Saúde</option>
                        <option value="compras">Compras</option>
                        <option value="pessoal">Pessoal</option>
                        <option value="recebido">Recebido</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                        Descrição
                      </label>
                      <textarea
                        id="descricao"
                        cols={50}
                        rows={4}
                        className="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border rounded-md"
                        {...register("descricao", { required: "Descrição é necessario" })}
                      /> 
                      {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao.message}</p>}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Transaction"}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


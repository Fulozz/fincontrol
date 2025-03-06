"use client"

import type React from "react"


import { redirect } from "next/navigation"
import { useAuth } from "@/components/auth-provider";
import { useState } from "react"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, User, Mail, Lock, LogOut, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    if(!isAuthenticated){
        redirect('/login')
    }
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const [user, setUser] = useState({
    name: "Usuário Exemplo",
    email: "usuario@exemplo.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser({
      ...user,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (user.newPassword && user.newPassword !== user.confirmPassword) {
      toast.error("As senhas não coincidem")
      return
    }

    // Here you would update the user profile in your database
    toast.success("Perfil atualizado com sucesso")
    setIsEditing(false)

    // Clear password fields
    setUser({
      ...user,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleLogout = () => {
    // Here you would implement the logout functionality
    toast.success("Logout realizado com sucesso")
    router.push("/")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Perfil</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="ml-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            {isEditing ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                Senha Atual
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={user.currentPassword}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={user.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                <Save size={16} className="mr-2" />
                Salvar Alterações
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Configurações</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex items-center">
                    {theme === "dark" ? (
                      <Moon size={18} className="text-gray-400 mr-3" />
                    ) : (
                      <Sun size={18} className="text-gray-400 mr-3" />
                    )}
                    <span>Tema</span>
                  </div>
                  <div>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                      className="p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-400 mr-3" />
                    <span>Notificações por Email</span>
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600">
                <LogOut size={18} className="mr-2" />
                Sair da Conta
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Preferências</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-1">
              Moeda
            </label>
            <select
              id="currency"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              defaultValue="BRL"
            >
              <option value="BRL">Real Brasileiro (R$)</option>
              <option value="USD">Dólar Americano ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
          <div>
            <label htmlFor="dateFormat" className="block text-sm font-medium mb-1">
              Formato de Data
            </label>
            <select
              id="dateFormat"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              defaultValue="DD/MM/YYYY"
            >
              <option value="DD/MM/YYYY">DD/MM/AAAA</option>
              <option value="MM/DD/YYYY">MM/DD/AAAA</option>
              <option value="YYYY-MM-DD">AAAA-MM-DD</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-1">
              Idioma
            </label>
            <select
              id="language"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              defaultValue="pt-BR"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Sobre o Sistema</h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>FinControl - Sistema de Controle Financeiro</p>
          <p>Versão 1.0.0</p>
          <p>© 2023 FinControl. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}


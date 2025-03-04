"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

type TRegisterFormData = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

export function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
  
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<TRegisterFormData>()
  
    const password = watch("password")
    const api = process.env.NEXT_PUBLIC_API_URL
    const onSubmit = async (data: TRegisterFormData) => {
      setIsLoading(true)
  
      try {
        const response = await fetch(`${api}/api/v1/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
          }),
        })
  
        const responseData = await response.json()
  
        if (!response.ok) {
          throw new Error(responseData.message || "Registration failed")
        }
  
        // Save token to cookies
        document.cookie = `auth-token=${responseData.token}; path=/; max-age=86400; samesite=lax`
  
        toast.success("Registration successful")
        router.push("/login")
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              placeholder="Exemplo da silva"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              {...register("name", {
                required: "Nome é necessario",
                minLength: {
                  value: 2,
                  message: "Nome precisa ter pelo menos 2 caracteres",
                },
              })}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="your@email.com"
            {...register("email", {
              required: "Email é necessario",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="••••••••"
              {...register("password", {
                required: "Password é necessario",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Por favor confirme a senha",
                validate: (value) => value === password || "As senhas estão diferentes",
              })}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registre-se"}
        </button>
      </form>
    </div>
  )
}


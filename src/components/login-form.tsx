"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

type TLoginFormData = {
    email: string,
    password: string
}

export function LoginForm (){
    const [ isLoading, setIsLoading ] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors } } = useForm<TLoginFormData>()
    const api = process.env.NEXT_PUBLIC_API_URL
    const onSubmit = async (data: TLoginFormData) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${api}/api/v1/login`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify(data)
            })
            const responseData = await response.json()
            if(!response.ok) {
                toast.error(responseData.message || "Falha ao entrar, tente novamente")
            }
            document.cookie = `auth-token=${responseData.token}; path=/; max-age=86400; samesite=lax`
            toast.success("Seja bem-vindo(a) de volta!")
            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            toast.error( error instanceof Error ? error.message : "Por favor verifique as credenciais")
        } finally {
            setIsLoading(false)
        }
    }
    return(
        <div className="bg-white p-8 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
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
                        message: "E-mail invalido",
                    },
                    })}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                </label>
                <div className="relative">
                    <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    placeholder="••••••••"
                    {...register("password", {
                        required: "Senha é necessario",
                        minLength: {
                        value: 6,
                        message: "Senha precisa ter no minimo 6 caracteres",
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
                <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
                >
                {isLoading ? "Entrando ..." : "Entre"}
                </button>
            </form>
            </div>
    )
}
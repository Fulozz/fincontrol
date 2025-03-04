import { LoginForm } from "@/components/login-form"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")

  if (token) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Bem vindo de volta!</h1>
          <p className="mt-2 text-sm text-muted-foreground">Entre na sua conta para continuar</p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          Você não tem uma conta?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Crie aqui!
          </Link>
        </div>
      </div>
    </div>
  )
}


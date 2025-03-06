import { redirect } from "next/navigation"
import { cookies } from "next/headers"


// TODO: verificar a autenticação
export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")
  
  if (token) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }
}


export async function validateToken(token: string): Promise<boolean> {
    const api = process.env.NEXT_PUBLIC_API_URL

    try {
      const response = await fetch(`${api}/api/v1/validate-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return false
      }
  
      const data = await response.json()
      return data.isValid === true
    } catch (error) {
      console.error("Token validation error:", error)
      return false
    }
  }

  
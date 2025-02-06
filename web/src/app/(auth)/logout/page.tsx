"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function page() {
    const r = useRouter()
    useEffect(() => {
        localStorage.removeItem('accessToken')
        r.push('/login')
    }, [])
  return (
    <div>procces logout</div>
  )
}

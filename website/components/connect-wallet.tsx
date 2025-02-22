"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function ConnectWallet() {
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      // Check if MetaMask is installed

      const address = "0x123123123"

      if (true) {
        router.push(`/signup?address=${address}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button onClick={connectWallet} disabled={isConnecting} className="w-full max-w-sm">
      {isConnecting ? "Signing in..." : "Sign In"}
    </Button>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth, mockUsers } from "@/contexts/auth-context"

export function SignupForm({ address }: { address: string }) {
  const [userType, setUserType] = useState<"lawyer" | "client">()
  const router = useRouter()
  const { login } = useAuth()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = {
      address,
      type: userType,
      name: formData.get("name"),
      email: formData.get("email"),
      specialty: formData.get("specialty"),
    }

    try {
      // const response = await fetch("/api/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(data),
      // })

      if (true) {//response.ok
        // Determine which mock user to login based on userType
        const userToLogin = userType === "lawyer" ? mockUsers.lawyer : mockUsers.client
        login(userToLogin)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Signup failed:", error)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Select User Type</CardTitle>
          <CardDescription>Choose whether you want to sign up as a lawyer or a client</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            onValueChange={(value: any) => setUserType(value as "lawyer" | "client")}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="lawyer" id="lawyer" className="peer sr-only" />
              <Label
                htmlFor="lawyer"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Lawyer</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="client" id="client" className="peer sr-only" />
              <Label
                htmlFor="client"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>Client</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {userType && (
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Please fill in your details below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Enter your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="Enter your email" required />
            </div>
            {userType === "lawyer" && (
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input id="specialty" name="specialty" placeholder="Enter your legal specialty" required />
              </div>
            )}
            <Button type="submit" className="w-full">
              Complete Signup
            </Button>
          </CardContent>
        </Card>
      )}
    </form>
  )
}


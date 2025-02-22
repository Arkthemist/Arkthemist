'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

type UserType = 'lawyer' | 'client'

interface User {
  id: string
  name: string
  userType: UserType
  email: string
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  setIsLoggedIn: (value: boolean) => void
  login: (userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const login = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  // For testing purposes, you might want to auto-login with mock data
  // useEffect(() => {
  //   login({
  //     id: '1',
  //     name: 'John Doe',
  //     userType: 'lawyer',
  //     email: 'john@example.com'
  //   })
  // }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Mock user data for testing
export const mockUsers = {
  lawyer: {
    id: '1',
    name: 'John Doe',
    userType: 'lawyer' as UserType,
    email: 'john@example.com'
  },
  client: {
    id: '2',
    name: 'Jane Smith',
    userType: 'client' as UserType,
    email: 'jane@example.com'
  }
} 
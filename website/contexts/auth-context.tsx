'use client'

import { User, UserType } from '@/types/user'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { connect, disconnect } from "starknetkit";
import { provider } from '@/utils/constants';
// import { provider } from "../../utils/constants";

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  setIsLoggedIn: (value: boolean) => void
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  loginWithWallet: (walletAddress: string) => void
  setAccount: (account: any | null) => void
  setWallet: (wallet: any | null) => void
  account: any | null
  wallet: any | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [account, setAccount] = useState<any | null>(null)
  const [wallet, setWallet] = useState<any | null>(null)

  // Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsLoggedIn(true)

      connectWalletTrigger()
    }
  }, [])


  const connectWalletTrigger = async () => {
    if (!account) {

      const result = await connect({
        modalMode: "alwaysAsk",
        modalTheme: "light",
        dappName: "StarknetKit",
        resultType: "wallet",
      });
      if (result.wallet && result.connectorData) {
        const address = result.connectorData.account;
        // setWalletConnection({
        //   wallet: result.wallet,
        //   address: address,
        // });
        // localStorage.setItem("walletAddress", address || '');
        console.log("Wallet connected:", result, "Address:", address);

        // login({
        //   walletAddress: address
        // })

        if (address) {
          loginWithWallet(address)
        }

        let account = await result.connector?.account(provider);
        setAccount(account);
        setWallet(result.wallet);


        // if (true) {
        //   router.push(`/signup?address=${address}`)
        // } else {
        //   router.push("/dashboard")
        // }

      } else {
        console.error("No wallet found in connection result.");
      }
    }
  }

  const fetchUserByWallet = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/users/wallet/${walletAddress}`);

      if (response.status === 404) {
        // User not found - redirect to signup
        router.push(`/signup?address=${walletAddress}`);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      console.log('userData', userData);

      if (!userData.userType) {
        // User exists but userType not set - redirect to signup
        router.push(`/signup?address=${walletAddress}`);
        return;
      }

      // User exists and has userType - proceed with login
      login(userData);
      //router.push('/dashboard');
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const loginWithWallet = async (walletAddress: string) => {
    try {
      // First create a minimal user in the database
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to create initial user');
      }

      // Set minimal user data in state
      setUser({ walletAddress } as User);
      setIsLoggedIn(true);

      // Then fetch complete user data and handle routing
      await fetchUserByWallet(walletAddress);
    } catch (error) {
      console.error('Error in loginWithWallet:', error);
    }
  };

  const login = (userData: User) => {
    setUser(userData)
    setIsLoggedIn(true)
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setAccount(null)
    setWallet(null)
    // Remove user data from localStorage
    localStorage.removeItem('user')
  }

  const updateUser = (userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData } as User;
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
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
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        setIsLoggedIn,
        login,
        logout,
        updateUser,
        loginWithWallet,
        setAccount,
        setWallet,
        account,
        wallet
      }}
    >
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
    email: 'john@example.com',
    walletAddress: '0x12312312321'
  },
  client: {
    id: '2',
    name: 'Jane Smith',
    userType: 'client' as UserType,
    email: 'jane@example.com'
  }
} 
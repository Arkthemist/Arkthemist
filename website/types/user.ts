export type UserType = 'lawyer' | 'client'

export interface User {
  id?: string
  name?: string
  userType?: UserType
  email?: string
  walletAddress?: string
  specialty?: string
}
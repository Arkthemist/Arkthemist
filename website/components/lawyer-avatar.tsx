import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

interface LawyerAvatarProps{
  lawyerId?: string
}

export const LawyerAvatar = ({lawyerId}: LawyerAvatarProps) => {
  const [userData, setUserData] = useState<{ name: string; avatar: string } | null>(null)

  useEffect(() => {
    if (lawyerId) {
      const fetchUserData = async () => {
        const data = {
          name: "Robert",
          avatar: "/robert-avatar.jpg",
        }
        setUserData(data)
      }
      fetchUserData()
    }
  }, [lawyerId])

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={userData?.avatar || "/placeholder.svg"} alt={userData?.name || "Robert"} />
      <AvatarFallback>{userData?.name?.[0] || "R"}</AvatarFallback>
    </Avatar>
  )
}
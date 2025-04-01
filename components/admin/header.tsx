"use client"
import { Menu, Bell, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminHeaderProps {
  toggleSidebar: () => void
  user: {
    username: string
    role: string
  }
}

export default function AdminHeader({ toggleSidebar, user }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-64 z-10 flex items-center px-6">
      <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
        <Menu className="h-6 w-6" />
      </button>

      <div className="ml-auto flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Aucune notification</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none">
              <div className="bg-gray-200 rounded-full p-2 mr-2">
                <User className="h-5 w-5" />
              </div>
              <span>{user.username}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuItem>Rôle: {user.role}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <form action="/api/auth/logout" method="POST" className="w-full">
                <button type="submit" className="w-full text-left">
                  Déconnexion
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}


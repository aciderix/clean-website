"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Calendar, Users, Settings, LogOut } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin",
    },
    {
      title: "Sections",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/sections",
    },
    {
      title: "Événements",
      icon: <Calendar className="h-5 w-5" />,
      href: "/admin/events",
    },
    {
      title: "Partenaires",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/partners",
    },
    {
      title: "Paramètres",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
    },
  ]

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin C.L.E.A.N.</h1>

        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                isActive(item.href) ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md transition-colors duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Déconnexion</span>
          </button>
        </form>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/placeholder.svg?height=50&width=150"
            alt="C.L.E.A.N. Logo"
            width={150}
            height={50}
            className="h-12 w-auto"
          />
        </Link>

        <div className="hidden md:flex space-x-6">
          <NavLinks />
        </div>

        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white w-full py-4 px-4 shadow-md">
          <div className="flex flex-col space-y-4">
            <NavLinks mobile setIsOpen={setIsOpen} />
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLinks({
  mobile = false,
  setIsOpen = () => {},
}: { mobile?: boolean; setIsOpen?: (value: boolean) => void }) {
  const handleClick = () => {
    if (mobile) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <Link
        href="#about"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        À propos
      </Link>
      <Link
        href="#approach"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Notre Approche
      </Link>
      <Link
        href="#events"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Événements
      </Link>
      <Link
        href="#mission"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Missions
      </Link>
      <Link
        href="#activities"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Activités
      </Link>
      <Link
        href="#areas"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Zones d'intervention
      </Link>
      <Link
        href="#partners"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Partenaires
      </Link>
      <Link
        href="#contact"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Contact
      </Link>
      <Link
        href="#support"
        className="text-gray-800 hover:text-primary transition-colors duration-300"
        onClick={handleClick}
      >
        Soutenir
      </Link>
    </>
  )
}


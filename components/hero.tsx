"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return
      const scrollPosition = window.scrollY
      heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`
    }

    window.addEventListener("scroll", handleParallax)
    return () => window.removeEventListener("scroll", handleParallax)
  }, [])

  return (
    <div
      ref={heroRef}
      className="relative h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/placeholder.svg?height=1080&width=1920)",
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Zéro Déchet pour les Rivières de Nantes
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Agissons ensemble pour des rivières plus propres
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="#support" className="btn-primary">
            Nous soutenir
          </Link>
          <Link href="#activities" className="btn-secondary">
            Découvrir nos actions
          </Link>
        </motion.div>
      </div>
    </div>
  )
}


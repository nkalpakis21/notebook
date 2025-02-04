import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { SidebarProvider } from "@/contexts/SidebarContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "A simple Notion-like note-taking app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-notion-default text-notion-text-primary`}>
        <SidebarProvider>{children}</SidebarProvider>
      </body>
    </html>
  )
}


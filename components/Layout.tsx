"use client"

import { ReactNode } from "react"
import Sidebar from "./Sidebar"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex h-screen bg-notion-default">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  )
} 
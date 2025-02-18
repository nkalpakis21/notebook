"use client"

import { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex h-screen bg-notion-default">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </>
  )
} 
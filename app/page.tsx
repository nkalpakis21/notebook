"use client"

import Sidebar from "@/components/Sidebar"

export default function Home() {
  return (
    <div className="flex h-screen bg-notion-default">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 my-16">
          {/* Empty state - can add a welcome message or instructions later */}
        </div>
      </main>
    </div>
  )
}


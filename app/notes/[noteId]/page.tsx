"use client"

import Sidebar from "@/components/Sidebar"
import NoteEditor from "@/components/NoteEditor"

export default function NotePage({ params }: { params: { noteId: string } }) {
  return (
    <div className="flex h-screen bg-notion-default">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-4 my-16">
          <NoteEditor noteId={params.noteId} />
        </div>
      </main>
    </div>
  )
} 
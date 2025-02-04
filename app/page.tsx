import Sidebar from "@/components/Sidebar"
import NoteEditor from "@/components/NoteEditor"

export default function Home() {
  return (
    <div className="flex h-screen bg-notion-default">
      <Sidebar />
      <main className="flex-1 p-6">
        <NoteEditor />
      </main>
    </div>
  )
}


import { getNoteById, updateNote, deleteNote } from "@/lib/firestoreClient"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { noteId: string } }) {
  try {
    const note = await getNoteById(params.noteId)
    return NextResponse.json(note)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { noteId: string } }) {
  try {
    const { title, content } = await request.json()
    const updatedNoteId = await updateNote(params.noteId, title, content)
    return NextResponse.json({ id: updatedNoteId, message: "Note updated successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { noteId: string } }
) {
  try {
    await deleteNote(params.noteId)
    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}


import { addNoteToFolder } from "@/lib/firestoreClient"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { title, content, folderId } = await request.json()

    // Validate input
    if (!title || !content || !folderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const response = await addNoteToFolder(title, content, folderId);

  
    return NextResponse.json({ response }, { status: 201 })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
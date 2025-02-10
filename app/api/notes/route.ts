import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import { addNote } from "@/lib/firestoreClient"

export async function POST(request: Request) {
  try {
    const { title, content, referenceId, referenceType } = await request.json()
    
    if (!title || !referenceId || !referenceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newNote = {
      id: uuidv4(),
      title,
      content,
      referenceId,
      referenceType, // 'folder' or 'teamspace'
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    console.log('created note', newNote)
    await addNote(newNote)
    return NextResponse.json(newNote)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}
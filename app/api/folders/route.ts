import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import { addFolder } from "@/lib/firestoreClient"

export async function POST(request: Request) {
  try {
    const { title, teamSpaceId } = await request.json()
    
    if (!title || !teamSpaceId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const newFolder = {
      id: uuidv4(),
      title,
      teamSpaceId,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await addFolder(newFolder)
    return NextResponse.json(newFolder)
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      { error: 'Failed to create folder' },
      { status: 500 }
    )
  }
} 
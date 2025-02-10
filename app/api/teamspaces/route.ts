import { NextResponse } from "next/server"
import { v4 as uuidv4 } from 'uuid'
import { addTeamSpace, getAllTeamSpacesEntities } from "@/lib/firestoreClient"

export async function GET() {
  try {
    const teamSpaces = await getAllTeamSpacesEntities()
    return NextResponse.json(teamSpaces)
  } catch (error) {
    console.error('Error getting TeamSpaces:', error)
    return NextResponse.json({ error: 'Failed to get TeamSpaces' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid team space name' },
        { status: 400 }
      )
    }

    const newTeamSpace = {
      id: uuidv4(),
      title: name,
      folders: [], // Initialize as empty array
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await addTeamSpace(newTeamSpace)
    return NextResponse.json(newTeamSpace)
  } catch (error) {
    console.error('Error creating teamspace:', error)
    return NextResponse.json(
      { error: 'Failed to create team space' },
      { status: 500 }
    )
  }
}


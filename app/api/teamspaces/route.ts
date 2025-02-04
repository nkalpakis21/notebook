import { getAllTeamSpaces, getAllTeamSpacesEntities } from "@/lib/firestoreClient"
import { NextResponse } from "next/server"

export async function GET() {
  // Fetch team spaces from database
  try{
    const teamSpaces = await getAllTeamSpacesEntities()
    console.log(teamSpaces);
    return NextResponse.json(teamSpaces)
  } catch (e) {
    console.error('Error getting TeamSpaces:', e);
        return NextResponse.json({ error: 'Failed to get Properties' }, { status: 500 });
  }
  
}

export async function POST(request: Request) {
  const { name } = await request.json()
  // Create team space in database
  const newTeamSpace = { id: Date.now().toString(), name, folders: [] }
  return NextResponse.json(newTeamSpace, { status: 201 })
}


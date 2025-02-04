import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { title, content } = await request.json()
  // Save note to database
  const newNote = { id: Date.now().toString(), title, content }
  return NextResponse.json(newNote, { status: 201 })
}


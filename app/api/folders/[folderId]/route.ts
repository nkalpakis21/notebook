import { NextResponse } from "next/server"
import { deleteFolder } from "@/lib/firestoreClient"
import { initializeFirebase } from "@/lib/firebaseClient"

export async function DELETE(
  request: Request,
  { params }: { params: { folderId: string } }
) {
  try {
    // Initialize Firebase first
    initializeFirebase()
    
    await deleteFolder(params.folderId)
    return NextResponse.json({ message: "Folder deleted successfully" })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Failed to delete folder" }, { status: 500 })
  }
} 
import { NextResponse } from "next/server"
import { deleteTeamSpace } from "@/lib/firestoreClient"

export async function DELETE(
  req: Request,
  { params }: { params: { teamspaceId: string } }
) {
  try {
    const { teamspaceId } = params;

    if (!teamspaceId) {
      return NextResponse.json(
        { error: "Teamspace ID is required" },
        { status: 400 }
      );
    }

    await deleteTeamSpace(teamspaceId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting teamspace:", error);
    return NextResponse.json(
      { error: "Failed to delete teamspace" },
      { status: 500 }
    );
  }
} 
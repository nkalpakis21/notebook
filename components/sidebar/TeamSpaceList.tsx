import { ITeamspace } from "@/types/types"
import { TeamSpaceItem } from "./TeamSpaceItem"

interface TeamSpaceListProps {
  teamSpaces: ITeamspace[]
}

export function TeamSpaceList({ teamSpaces }: TeamSpaceListProps) {
  return (
    <div>
      {teamSpaces.map((teamSpace) => (
        <TeamSpaceItem key={teamSpace.id} teamSpace={teamSpace} />
      ))}
    </div>
  )
} 
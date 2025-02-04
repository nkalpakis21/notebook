export type ITeamspace = {
    id: string
    title: string
    folders: IFolder[]
  }
  
export type IFolder = {
    id: string
    title: string
    notes: INote[]
  }
  
export type INote = {
    id: string
    title: string
  }
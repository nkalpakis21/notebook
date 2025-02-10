export interface ITeamspace {
    id: string
    title: string
    folders: IFolder[]
    notes?: INote[]
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
export interface INote {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt?: string
}

export interface IFolder {
  id: string
  title: string
  notes: INote[]
  createdAt: string
  updatedAt?: string
}

export interface ITeamspace {
  id: string
  title: string
  folders: IFolder[]
  createdAt: string
  updatedAt?: string
}
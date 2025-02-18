'use client'

import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { db } from "@/lib/firebase"
import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore"
import { useSidebar } from "@/contexts/SidebarContext"

interface DialogState {
  type: 'teamspace' | 'folder' | 'note' | null
  isOpen: boolean
  teamSpaceId?: string
  folderId?: string
  isLoading: boolean
}

export function useTeamSpaceActions() {
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    isOpen: false,
    isLoading: false
  })
  const { fetchTeamSpaces } = useSidebar()

  const createTeamSpace = async (title: string) => {
    try {
      setDialogState(prev => ({ ...prev, isLoading: true }))
      const teamSpaceRef = collection(db, 'teamspaces')
      await addDoc(teamSpaceRef, {
        id: uuidv4(),
        title,
        folders: [],
        createdAt: new Date().toISOString()
      })
      await fetchTeamSpaces()
    } catch (error) {
      console.error('Error creating team space:', error)
      throw error
    } finally {
      setDialogState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const createFolder = async (teamSpaceId: string, title: string) => {
    try {
      setDialogState(prev => ({ ...prev, isLoading: true }))
      const teamSpaceRef = doc(db, 'teamspaces', teamSpaceId)
      const newFolder = {
        id: uuidv4(),
        title,
        notes: [],
        createdAt: new Date().toISOString()
      }
      await updateDoc(teamSpaceRef, {
        folders: arrayUnion(newFolder)
      })
      await fetchTeamSpaces()
    } catch (error) {
      console.error('Error creating folder:', error)
      throw error
    } finally {
      setDialogState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const createNote = async (folderId: string, title: string) => {
    try {
      setDialogState(prev => ({ ...prev, isLoading: true }))
      const teamSpaceRef = doc(db, 'teamspaces', dialogState.teamSpaceId!)
      const newNote = {
        id: uuidv4(),
        title,
        content: '',
        createdAt: new Date().toISOString()
      }
      
      // Update the specific folder's notes array
      // This is a simplified version - you might need to update the folder structure differently
      await updateDoc(teamSpaceRef, {
        [`folders.${folderId}.notes`]: arrayUnion(newNote)
      })
      await fetchTeamSpaces()
    } catch (error) {
      console.error('Error creating note:', error)
      throw error
    } finally {
      setDialogState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return {
    dialogState,
    setDialogState,
    createTeamSpace,
    createFolder,
    createNote
  }
} 
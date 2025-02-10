import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, arrayUnion, orderBy, setDoc } from 'firebase/firestore';
import { initializeFirebase } from './firebaseClient';
import { serverTimestamp } from 'firebase/firestore'
import { IFolder, INote, ITeamspace } from '@/types/types';

const SESSIONS_COLLECTION = 'sessions';
const PROPERTIES_COLLECTION = 'properties';

export const addDocumentToFirestore = async (collectionName: string, data: Record<string, unknown>): Promise<void> => {
    const { db } = initializeFirebase(); // Reuse the Firestore instance
    try {
        const dbData = {
            ...data, 
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
        const docRef = await addDoc(collection(db, collectionName), dbData);
        console.log('Document written with ID:', docRef.id);
    } catch (e) {
        console.error('Error adding document:', e);
    }
};

export const updateNote = async (noteId: string, title: string, content: string) => {
  const { db } = initializeFirebase()

  try {
    const noteRef = doc(db, "notes", noteId)
    await updateDoc(noteRef, {
      title,
      content,
      updatedAt: new Date().toISOString(),
    })

    return noteId
  } catch (error) {
    console.error("Error updating note:", error)
    throw new Error("Failed to update note")
  }
}

export const getNoteById = async (noteId: string) => {
  const { db } = initializeFirebase()
  try {
    const noteRef = doc(db, "notes", noteId)
    const noteSnap = await getDoc(noteRef)

    if (!noteSnap.exists()) {
      throw new Error("Note not found")
    }

    return {
      id: noteSnap.id,
      ...noteSnap.data(),
    }
  } catch (error) {
    console.error("Error fetching note:", error)
    throw new Error("Failed to fetch note")
  }
}

export const addNoteToFolder = async (title: string, content: string, folderId: string) => {
  const { db } = initializeFirebase()
  try {
    // Create a new note document
    const noteRef = await addDoc(collection(db, "notes"), {
      title,
      content,
      folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Update the folder's notes array with the new note ID
    const folderRef = doc(db, "folders", folderId)
    await updateDoc(folderRef, {
      notes: arrayUnion(noteRef.id),
    })

    return noteRef.id
  } catch (error) {
    console.error("Error adding note to folder:", error)
    throw new Error("Failed to add note to folder")
  }
}

export const getAllTeamSpacesEntities = async (): Promise<Array<ITeamspace>> => {
  const { db } = initializeFirebase();

  try {
    const teamSpacesRef = collection(db, "teamspaces");
    const teamSpacesSnapshot = await getDocs(teamSpacesRef);

    const teamspacePromises = teamSpacesSnapshot.docs.map(async (teamspaceDoc) => {
      const teamspaceData = teamspaceDoc.data();
      console.log('Fetching notes for teamspace:', teamspaceDoc.id);
      
      // Get all notes that belong to this teamspace
      const notesQuery = query(
        collection(db, "notes"),
        where("referenceId", "==", teamspaceDoc.id),
        where("referenceType", "==", "teamspace")
      );
      const notesSnapshot = await getDocs(notesQuery);
      console.log('Found teamspace notes:', notesSnapshot.docs.length);
      
      const teamspaceNotes = notesSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Note data:', data);
        return {
          id: doc.id,
          title: data.title
        };
      });

      // Get folders and their notes
      const folderIds: string[] = teamspaceData.folders || [];
      const folders: IFolder[] = await Promise.all(
        folderIds.map(async (folderId) => {
          const folderDocRef = doc(db, "folders", folderId);
          const folderDoc = await getDoc(folderDocRef);

          if (folderDoc.exists()) {
            // Get notes that belong to this folder
            const folderNotesQuery = query(
              collection(db, "notes"),
              where("referenceId", "==", folderId),
              where("referenceType", "==", "folder")
            );
            const folderNotesSnapshot = await getDocs(folderNotesQuery);
            const notes = folderNotesSnapshot.docs.map(doc => ({
              id: doc.id,
              title: doc.data().title
            }));

            return {
              id: folderDoc.id,
              title: folderDoc.data().title,
              notes
            } as IFolder;
          }

          throw new Error(`Folder not found for ID: ${folderId}`);
        })
      );

      return {
        id: teamspaceDoc.id,
        title: teamspaceData.title,
        folders,
        notes: teamspaceNotes
      } as ITeamspace;
    });

    return await Promise.all(teamspacePromises);
  } catch (error) {
    console.error("Error fetching all teamspaces:", error);
    throw new Error("Failed to retrieve teamspaces");
  }
};


  /**
 * Fetches all feedback from the feedback collection.
 * @returns {Promise<IFeedbackFormRequest[]>} - A list of all feedback.
 */
export const getAllTeamSpaces = async (): Promise<Array<ITeamspace>> => {
    const { db } = initializeFirebase();
    
    try {
        const teamSpacesRef = collection(db, 'teamspaces');
        const teamSpacesSnapshot = await getDocs(teamSpacesRef);
        
        // If no documents exist
        if (teamSpacesSnapshot.empty) {
            return [];
        }

        // Map documents to feedback objects
        const feedbackList: ITeamspace[] = teamSpacesSnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            } as unknown as ITeamspace;
        });

        return feedbackList;
    } catch (error) {
        console.error('Error fetching all feedback:', error);
        throw new Error('Failed to retrieve feedback');
    }
};

export async function addTeamSpace(teamSpace: any) {
  const { db } = initializeFirebase()
  
  try {
    const docRef = doc(db, "teamspaces", teamSpace.id)
    await setDoc(docRef, {
      ...teamSpace,
      folders: [], // Ensure folders is initialized as an empty array
      notes: [],  // Initialize notes array
    })
    return teamSpace.id
  } catch (error) {
    console.error("Error adding teamspace:", error)
    throw error
  }
}

export async function getTeamSpaces() {
  try {
    const teamSpacesRef = collection(db, "teamspaces")
    const q = query(teamSpacesRef, orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    
    const teamSpaces = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    return teamSpaces
  } catch (error) {
    console.error("Error getting teamspaces:", error)
    throw error
  }
}

export async function addNote(note: any) {
  const { db } = initializeFirebase()
  try {
    const docRef = doc(db, "notes", note.id)
    await setDoc(docRef, note)

    // Update the reference (folder or teamspace) with the new note
    const referenceRef = doc(db, note.referenceType === 'folder' ? "folders" : "teamspaces", note.referenceId)
    await updateDoc(referenceRef, {
      notes: arrayUnion(note.id)
    })

    return note.id
  } catch (error) {
    console.error("Error adding note:", error)
    throw error
  }
}

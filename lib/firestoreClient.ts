import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
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

    // If no documents exist
    if (teamSpacesSnapshot.empty) {
      return [];
    }

    const teamspacePromises = teamSpacesSnapshot.docs.map(async (teamspaceDoc) => {
      const teamspaceData = teamspaceDoc.data();
      const folderIds: string[] = teamspaceData.folders;
      // Fetch folders for this teamspace
      const folders: IFolder[] = await Promise.all(
        folderIds.map(async (folderId) => {
          const folderDocRef = doc(db, "folders", folderId);
          const folderDoc = await getDoc(folderDocRef);


          if (folderDoc.exists()) {
            const folderData = folderDoc.data();
            const noteIds: string[] = folderData.notes;

            // Fetch notes for this folder
            const notes: INote[] = await Promise.all(
              noteIds.map(async (noteId) => {
                const noteDocRef = doc(db, "notes", noteId);
                const noteDoc = await getDoc(noteDocRef);

                if (noteDoc.exists()) {
                  return { id: noteDoc.id, title: noteDoc.data().title } as INote;
                }

                throw new Error(`Note not found for ID: ${noteId}`);
              })
            );

            return {
              id: folderDoc.id,
              title: folderData.title,
              notes,
            } as IFolder;
          }

          throw new Error(`Folder not found for ID: ${folderId}`);
        })
      );

      return {
        id: teamspaceDoc.id,
        title: teamspaceData.title,
        folders,
      } as ITeamspace;
    });

    // Wait for all teamspaces and nested folder/note data to be fetched
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

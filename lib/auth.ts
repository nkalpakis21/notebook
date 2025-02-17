import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

export const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const logOut = async () => {
  return signOut(auth)
}

export { googleProvider } 
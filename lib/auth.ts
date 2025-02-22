import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signOut, 
  getAuth 
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

// Helper function to set session cookie
const setSessionCookie = async (token: string) => {
  await fetch('/api/verifySession', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  })
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const token = await result.user.getIdToken()
    await setSessionCookie(token)
    return result
  } catch (error) {
    console.error('Error signing in with Google:', error)
    throw error
  }
}

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const token = await result.user.getIdToken()
    await setSessionCookie(token)
    return result
  } catch (error) {
    console.error('Error signing in:', error)
    throw error
  }
}

// Sign up with email and password
export const signUp = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const token = await result.user.getIdToken()
    await setSessionCookie(token)
    return result
  } catch (error) {
    console.error('Error signing up:', error)
    throw error
  }
}

// Log out
export const logOut = async () => {
  try {
    await signOut(auth)
    console.log('Signed out')

    // Call the API to clear the session cookie
    await fetch('/api/logout', {
      method: 'POST',
    })
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}
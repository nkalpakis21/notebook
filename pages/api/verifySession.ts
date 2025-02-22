import { adminAuth } from '@/lib/firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    // Set a secure cookie for session management
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`)
    res.status(200).json({ uid: decodedToken.uid })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
} 
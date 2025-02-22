import * as firebaseAdmin from 'firebase-admin'

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId: "notbook-dev",
      clientEmail: "firebase-adminsdk-fbsvc@notbook-dev.iam.gserviceaccount.com",
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  })
}

export const adminAuth = firebaseAdmin.auth()
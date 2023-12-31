/* eslint-disable*/
import fs from 'fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const firestoreCollection = process.env.FIRESTORE_COLLECTION
const firestoreDocument = process.env.FIERSTORE_DOCUMENT
const firebaseToken = process.env.CREDENTIALS

const json = fs.readFileSync(firebaseToken!, 'utf8')
const serviceAccount = JSON.parse(json)

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID
})

const firestoreDb = getFirestore()
type DocumentReference = FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>

const incrementCounter = (
  docRef: DocumentReference,
  numShards: number
) => {
  const shardId = Math.floor(Math.random() * numShards)
  const shardRef = docRef.doc(shardId.toString())
  return shardRef.set({ count: FieldValue.increment(1) }, { merge: true })
}

const getCount = async (docRef: DocumentReference) => {
  const querySnapshot = await docRef.get()
  const documents = querySnapshot.docs;
  
console.log(documents)

  let count = 0
  for (const doc of documents) {
    count += doc.get('count')
  }
  return count
}

const docRef = firestoreDb.collection(firestoreCollection!)

;(async () => {
  console.log(
    await getCount(docRef)
  )
})()
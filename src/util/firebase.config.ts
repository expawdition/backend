import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: 'AIzaSyDGvOqf8n1H0jYSHl9zwzGuOy6Uor0f05s',
    authDomain: 'smart-travel-buddy.firebaseapp.com',
    projectId: 'smart-travel-buddy',
    storageBucket: 'smart-travel-buddy.appspot.com',
    messagingSenderId: '716525948847',
    appId: '1:716525948847:web:c6d4b89df1113309ece95a',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth()

export { db, auth }

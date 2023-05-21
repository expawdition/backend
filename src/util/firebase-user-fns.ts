import { db } from './firebase.config'
import {
    addDoc,
    getDoc,
    deleteDoc,
    getDocs,
    updateDoc,
    doc,
    collection,
} from '@firebase/firestore'
import { DocumentData, DocumentReference } from 'firebase/firestore'
import { UserType } from '../routes/types/types'

const usersRef = collection(db, 'users')

const getUserById = async (id: string): Promise<DocumentData | undefined> => {
    try {
        const userDoc = await getDoc(doc(usersRef, id))
        if (userDoc.exists()) {
            const userData = userDoc.data()
            // Do something with the user data
            return userData
        } else {
            console.log('User does not exist.')
            return undefined
        }
    } catch (e) {
        console.log('Error retrieving user.', e)
        return undefined
    }
}

const addUser = async (
    firstName: string,
    lastName: string
): Promise<string | undefined> => {
    let data = {
        firstName: firstName,
        lastName: lastName,
    }

    try {
        const docRef = await addDoc(usersRef, data)
        return docRef.id
    } catch (e) {
        console.log('Unable to add user.', e)
        return undefined
    }
}

const removeUserById = async (id: string): Promise<Object | undefined> => {
    try {
        console.log(id)

        await deleteDoc(doc(db, 'users', id))
        return { message: 'success' }
    } catch (e) {
        console.log('Unable to delete entry.', e)
        return undefined
    }
}

const updateUserById = async (
    id: string,
    updateData: Partial<UserType>
): Promise<Object | undefined> => {
    try {
        await updateDoc(doc(db, 'users', id), updateData)
        return { message: 'success' }
    } catch (e) {
        console.log('Unable to update user.', e)
        return undefined
    }
}

export { addUser, getUserById, removeUserById, updateUserById }

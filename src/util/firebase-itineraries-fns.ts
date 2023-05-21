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
import { ItineraryType } from '../routes/types/types'
import ItineraryEvent from '@src/models/ItineraryEvent'

const itinerariesRef = collection(db, 'itineraries')

const getItineraryById = async (
    id: string
): Promise<DocumentData | undefined> => {
    try {
        const itineraryDoc = await getDoc(doc(itinerariesRef, id))
        if (itineraryDoc.exists()) {
            const itineraryData = itineraryDoc.data()
            // Do something with the user data
            return itineraryData
        } else {
            console.log('Itinerary does not exist.')
            return undefined
        }
    } catch (e) {
        console.log('Error retrieving itinerary.', e)
        return undefined
    }
}

const addItinerary = async (
    itineraryEvents: ItineraryEvent[]
): Promise<string | undefined> => {
    try {
        const itineraryEventsPlain = itineraryEvents.map((event) =>
            event.toObject()
        )
        const docRef = await addDoc(itinerariesRef, {
            itineraryEvents: itineraryEventsPlain,
        })
        console.log(docRef.id)
        return docRef.id
    } catch (e) {
        console.log('Unable to add itinerary.', e)
        return undefined
    }
}

const removeItineraryById = async (id: string): Promise<Object | undefined> => {
    try {
        console.log(id)

        await deleteDoc(doc(db, 'itineraries', id))
        return { message: 'success' }
    } catch (e) {
        console.log('Unable to delete entry.', e)
        return undefined
    }
}

const updateItineraryById = async (
    id: string,
    updateData: Partial<ItineraryType>
): Promise<Object | undefined> => {
    try {
        await updateDoc(doc(db, 'itineraries', id), updateData)
        return { message: 'success' }
    } catch (e) {
        console.log('Unable to update itinerary.', e)
        return undefined
    }
}

export {
    addItinerary,
    getItineraryById,
    removeItineraryById,
    updateItineraryById,
}

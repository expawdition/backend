import { Request, Response, RequestHandler, NextFunction } from 'express'
import fetch from 'node-fetch'
import gpt from '@src/services/GPTService'
import TripData from '@src/models/TripData'

const googleKey = process.env.GOOGLE_API_KEY
const openAiKey = process.env.OPEN_AI_KEY

import { Client } from '@googlemaps/google-maps-services-js'
import ItineraryEvent from '@src/models/ItineraryEvent'
import {
    addItinerary,
    getItineraryById,
} from '@src/util/firebase-itineraries-fns'

interface LatLng {
    latitude: number
    longitude: number
}

interface DistanceDuration {
    distance: string
    duration: string
}

const geocodeAddress = async (address: string): Promise<LatLng | undefined> => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
    )}&key=${googleKey}`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location
            return {
                latitude: location.lat,
                longitude: location.lng,
            }
        } else {
            console.error(`Geocoding failed for address: ${address}`)
        }
    } catch (error) {
        console.error('Error:', error.message)
    }

    return undefined
}

const calculateDistanceAndDuration = async (
    origin: string,
    destination: string,
    mode: string
): Promise<DistanceDuration | undefined> => {
    const originLatLng = await geocodeAddress(origin)
    const destinationLatLng = await geocodeAddress(destination)

    if (!originLatLng || !destinationLatLng) {
        return undefined
    }

    if (!mode) {
        mode = 'driving'
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLatLng.latitude},${originLatLng.longitude}&destinations=${destinationLatLng.latitude},${destinationLatLng.longitude}&key=${googleKey}&mode=${mode}`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (
            data.status === 'OK' &&
            data.rows.length > 0 &&
            data.rows[0].elements.length > 0
        ) {
            const distance = data.rows[0].elements[0].distance.text
            const duration = data.rows[0].elements[0].duration.text

            return {
                distance,
                duration,
            }
        } else {
            console.error('Invalid response from the Google Routes API')
        }
    } catch (error) {
        console.error('Error:', error.message)
    }

    return undefined
}

const calculateDistancesAndDurations = async (
    origins: string[],
    destinations: string[],
    mode: string
): Promise<any> => {
    // let origins = req.body.origins
    // let destinations = req.body.destinations
    // let mode = req.body.mode

    const results = []

    for (let i = 0; i < origins.length; i++) {
        const origin = origins[i]
        const destination = destinations[i]

        const result = await calculateDistanceAndDuration(
            origin,
            destination,
            mode
        )
        if (result) {
            console.log(
                `Distance from ${origin} to ${destination}: ${result.distance}`
            )
            console.log(
                `Duration from ${origin} to ${destination}: ${result.duration}`
            )

            results.push({
                origin,
                destination,
                distance: result.distance,
                duration: result.duration,
            })
        }
    }

    return results
}

function calculateTimeDifferenceInMinutes(
    time1: string,
    time2: string
): number {
    const date1 = new Date(`2000/01/01 ${time1}`)
    const date2 = new Date(`2000/01/01 ${time2}`)

    const diffInMilliseconds = date2.getTime() - date1.getTime()
    const diffInMinutes = diffInMilliseconds / (1000 * 60)

    return Math.abs(diffInMinutes)
}

export const createTrip: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let destination = req.body.destination
    let date = req.body.date
    let startTime = req.body.startTime
    let endTime = req.body.endTime
    let numberOfPeople = req.body.numberOfPeople
    let groupType = req.body.groupType
    let budget = req.body.budget
    let transportationMethod = req.body.transportationMethod
    let mustDo = req.body.mustDo
    let wheelChairFriendly = req.body.wheelChairFriendly

    const trip = new TripData({
        destination: destination,
        date: date,
        startTime: startTime,
        endTime: endTime,
        numberOfPeople: numberOfPeople,
        groupType: groupType,
        budget: budget,
        transportationMethod: transportationMethod,
        mustDo: mustDo,
        wheelChairFriendly: wheelChairFriendly,
    })

    try {
        const dataStr = await gpt(trip, openAiKey)

        if (dataStr) {
            const data = JSON.parse(dataStr)
            const activities = data.itinerary;

            const origins = []
            const destinations = []

            for (let i = 0; i < activities.length - 1; i++) {
                origins.push(activities[i].location)
                destinations.push(activities[i + 1].location)
            }

            let calculations = await calculateDistancesAndDurations(
                origins,
                destinations,
                transportationMethod
            )

            const timeDifference = calculateTimeDifferenceInMinutes(
                startTime,
                endTime
            )
            let totalTime = 0
            let itineraryEvents: ItineraryEvent[] = [] // Array to hold the selected activities

            for (let i = 0; i < activities.length; i++) {
                const activity = activities[i]
                const transitTime =
                    i < activities.length - 1 ? calculations[i].duration : 0 // Take into account that the last activity won't have a transit time

                if (
                    totalTime +
                        parseInt(activity.estimatedDuration[0]) +
                        transitTime >
                    timeDifference
                ) {
                    break
                } else {
                    activity.transitTime = transitTime
                    totalTime +=
                        parseInt(activity.estimatedDuration[0]) + transitTime
                    itineraryEvents.push(new ItineraryEvent(activity)) // Only add the activity if it doesn't exceed the available time
                }
            }
            await getPlacePhotos(itineraryEvents)
            const id = await addItinerary(itineraryEvents, req.body.date)
            res.json(id)
        } else {
            console.log('data is undefined')
        }
    } catch (e) {
        console.log(e)
        next(e)
    }
}

export const test: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const client = new Client({})

    client
        .elevation({
            params: {
                locations: [{ lat: 45, lng: -110 }],
                key: 'asdf',
            },
            timeout: 1000, // milliseconds
        })
        .then((r) => {
            console.log(r.data.results[0].elevation)
        })
        .catch((e) => {
            console.log(e.response.data.error_message)
        })

    res.json({ message: 'Hello World from trips!' })
}

const getPlacePhoto = async (location: string): Promise<string | undefined> => {
    const fields = [
        'formatted_address',
        'name',
        'rating',
        'opening_hours',
        'geometry',
        'photos',
    ]

    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=${fields}&input=${location}&inputtype=textquery&key=${googleKey}`

    try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.status === 'OK') {
            let photoRef = data.candidates[0].photos[0].photo_reference

            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${googleKey}`

            const photoResponse = await fetch(photoUrl)

            return photoResponse.url
        } else {
            console.error(`Could not find place`)
        }
    } catch (error) {
        console.error('Error:', error.message)
    }

    return undefined
}

export const getPlacePhotos = async (
    itineraryEvents: ItineraryEvent[]
): Promise<void> => {
    try {
        await Promise.all(
            itineraryEvents.map(async (activity: ItineraryEvent) => {
                const url = await getPlacePhoto(activity.name)
                activity.photo = url
            })
        )
    } catch (error) {
        console.error('Error:', error.message)
    }
}

export const getTrip: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let itineraryId = req.params.id
    try {
        let itinerary = await getItineraryById(itineraryId)
        res.json(itinerary)
    } catch (error) {
        console.error('Error:', error.message)
    }
}

import { Request, Response, RequestHandler, NextFunction } from 'express'
import fetch from 'node-fetch'
import gpt from '@src/services/GPTService'
import TripData from '@src/models/TripData'

const googleKey = process.env.GOOGLE_API_KEY
const openAiKey = process.env.OPEN_AI_KEY

import { Client } from '@googlemaps/google-maps-services-js'

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

            const origins = []
            const destinations = []

            for (let i = 0; i < data.length - 1; i++) {
                origins.push(data[i].location)
                destinations.push(data[i + 1].location)
            }

            let calculations = await calculateDistancesAndDurations(
                origins,
                destinations,
                transportationMethod
            )

            console.log('Origins:', origins)
            console.log('Destinations:', destinations)

            res.json({ calculations: calculations })
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

import { Request, Response, RequestHandler, NextFunction } from 'express'

const googleKey = process.env.GOOGLE_API_KEY
console.log(googleKey)

import { Client } from '@googlemaps/google-maps-services-js'

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

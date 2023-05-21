import * as e from 'express'
import { Query } from 'express-serve-static-core'

import { ISessionUser } from '@src/models/User'

// **** Express **** //

export interface IReq<T = void> extends e.Request {
    body: T
}

export interface IReqQuery<T extends Query, U = void> extends e.Request {
    query: T
    body: U
}

export interface IRes extends e.Response {
    locals: {
        sessionUser: ISessionUser
    }
}

export interface UserType {
    firstName: string
    lastName: string
}

export interface ItineraryType {
    name: string
    address: string
    estimatedDuration: string
    estimatedStartTime: string
    description: string
}

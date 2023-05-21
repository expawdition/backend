import { Request, Response, RequestHandler, NextFunction } from 'express'
import {
    addUser,
    getUserById,
    removeUserById,
    updateUserById,
} from '../util/firebase-user-fns'
import { UserType } from '../routes/types/types'

export const test: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    res.json({ message: 'Hello World!' })
}

export const getUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let id = req.params.userId

    let userData = await getUserById(id)

    res.json(userData)
}

export const createUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let firstName = req.body.firstName
    let lastName = req.body.lastName

    try {
        let userId = await addUser(firstName, lastName)

        res.json({ user: userId })
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

export const deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let id = req.params.userId
        let status = await removeUserById(id)
        res.json(status)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

export const updateUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let id = req.params.userId
        let firstName = req.body.firstName
        let lastName = req.body.lastName

        const user: UserType = {
            firstName: firstName,
            lastName: lastName,
        }

        let status = await updateUserById(id, user)
        res.json(status)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

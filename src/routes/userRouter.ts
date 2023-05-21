import express from 'express'
const router = express.Router()

import {
    test,
    createUser,
    getUser,
    deleteUser,
    updateUser,
} from '../controllers/userController'

router.get('/', test)

router.post('/create-user', createUser)

router.get('/:userId', getUser)

router.delete('/:userId', deleteUser)

router.post('/:userId', updateUser)

export default router

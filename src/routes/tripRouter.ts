import express from 'express'
const router = express.Router()

import { test, createTrip, getTrip } from '../controllers/tripController'

router.get('/', test)

// router.post('/distances', calculateDistancesAndDurations)

router.post('/create-trip', createTrip)

router.get('/:id', getTrip)
export default router

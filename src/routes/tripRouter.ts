import express from 'express'
const router = express.Router()

import { createTrip, getTrip, getAllTrips } from '../controllers/tripController'

router.get('/all', getAllTrips)

// router.post('/distances', calculateDistancesAndDurations)

router.post('/create-trip', createTrip)

router.get('/:id', getTrip)
export default router

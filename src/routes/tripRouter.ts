import express from 'express'
const router = express.Router()

import { test, createTrip } from '../controllers/tripController'

router.get('/', test)

// router.post('/distances', calculateDistancesAndDurations)

router.post('/create-trip', createTrip)

export default router

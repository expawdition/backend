import express from 'express'
const router = express.Router()

import { test } from '../controllers/tripController'

router.get('/', test)

export default router

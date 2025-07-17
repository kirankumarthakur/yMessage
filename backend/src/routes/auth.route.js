import express from 'express'
import {signup, login, logout, updateProfile, checkAuth} from '../controllers/auth.controller.js'
import { authorised } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', authorised, logout)

router.put('/profile/update', authorised, updateProfile)
router.get('/check', authorised, checkAuth)

export default router

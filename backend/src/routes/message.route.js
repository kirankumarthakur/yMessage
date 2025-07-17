import express from 'express'
import { authorised } from '../middleware/auth.middleware.js'
import { getUsersSidebar, getMessages, sendMessage } from '../controllers/message.controller.js'

const router = express.Router()

router.get('/users', authorised, getUsersSidebar)
router.get('/:id', authorised, getMessages)

router.post('/send/:id', authorised, sendMessage)

export default router
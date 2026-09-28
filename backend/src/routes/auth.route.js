import { registerController,loginController } from '../controller/auth.controller.js'
import express from 'express'
const router=express.Router()


router.post('/register',registerController)
router.post('/login',loginController)

export default router


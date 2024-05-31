import express from "express"
import { listUsers, login, search, signup, userTransfer } from "../controller/userController.js"
const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/transfer/:id/:amount",userTransfer)
router.get("/search/:search",search)
router.get("/getAllUsers/:id",listUsers)
export default router
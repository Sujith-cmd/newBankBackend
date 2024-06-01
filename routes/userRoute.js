import express from "express"
import { listUsers, login, search, signup, transactions, userTransfer } from "../controller/userController.js"
import protectRoute from "../middleware/protectRoute.js"
const router=express.Router()

router.post("/signup",signup)
router.post("/login",login)
router.post("/transfer/:id/:amount",userTransfer)
router.get("/search/:search",search)
router.get("/getAllUsers/:id",listUsers)
router.get("/getTransaction/:id",transactions)
export default router
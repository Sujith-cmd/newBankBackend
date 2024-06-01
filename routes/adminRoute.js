import express from "express"
import { blockUser, listUsers } from "../controller/adminController.js"
const router=express.Router()


router.get("/getAllUsers",listUsers) 
router.put("/blockUser/:id",blockUser) 
export default router
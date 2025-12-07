import express from 'express';
import {createUser,getAllusers,getuserById,updateUser,deleteUser} from "../controller/userController.js"
const router=express.Router();
router.post("/user",createUser);
router.get("/user",getAllusers);
router.get("/user/:id",getuserById);
router.put("/user/:id",updateUser);
router.delete("/user/:id",deleteUser);
export default router;
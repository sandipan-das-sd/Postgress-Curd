import express from express;
const router=express.Router();
router.post("/user",createUser);
router.get("/user",getAllusers);
router.get("/user/:id",getuserById);
router.put("/user/:id",updateUser);
router.delete("/user/:id",deleteUser);
export default router;